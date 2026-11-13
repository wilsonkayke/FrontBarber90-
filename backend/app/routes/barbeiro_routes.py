from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta

from app.db.mongo_connection import db
from app.dependencies.auth import get_admin, get_barbeiro, get_current_user
from pymongo import ReturnDocument
from app.schemas.barbeiro_schema import BarbeiroCreate
from app.utils.security import hash_password
from bson import ObjectId

import logging
from app.websocket.manager import manager

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/barbeiros",
    tags=["Barbeiros"]
)

clientes_collection = db["clientes"]
barbeiros_collection = db["barbeiros"]
agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]



#Criando barbeiro
@router.post("/")
def criar_barbeiro(
    barbeiro: BarbeiroCreate,
    admin=Depends(get_admin)
):

    email = barbeiro.email.strip().lower()

    # Verifica limite de barbeiros ativos
    quantidade_barbeiros = barbeiros_collection.count_documents({
        "ativo": True
    })

    if quantidade_barbeiros >= 4:
        raise HTTPException(
            status_code=400,
            detail="Limite de barbeiros ativos atingido."
        )

    # Verifica se o e-mail já existe em qualquer usuário
    usuario_existente = clientes_collection.find_one({
        "email": email
    })

    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="Este e-mail já está cadastrado."
        )

    # 1. Cria o usuário na coleção clientes
    novo_usuario = {
        "usuario": barbeiro.nome,
        "email": email,
        "senha": hash_password(barbeiro.senha),
        "role": "barbeiro",
        "status": "ativo",
        "created_at": datetime.utcnow()
    }

    resultado_usuario = clientes_collection.insert_one(novo_usuario)

    # 2. Cria o perfil do barbeiro
    novo_barbeiro = {
        "usuario_id": resultado_usuario.inserted_id,
        "nome": barbeiro.nome,
        "ativo": True,
        "created_at": datetime.utcnow()
    }

    resultado_barbeiro = barbeiros_collection.insert_one(
        novo_barbeiro
    )

    return {
        "message": "Barbeiro criado com sucesso",
        "barbeiro": {
            "id": str(resultado_barbeiro.inserted_id),
            "usuario_id": str(resultado_usuario.inserted_id),
            "nome": barbeiro.nome,
            "email": email,
            "role": "barbeiro",
            "ativo": True
        }
    }
    
#
@router.get("/")
def listar_barbeiros(usuario=Depends(get_current_user)):
    barbeiros = barbeiros_collection.find({
        "ativo": True
    })

    return [
        {
            "id": str(barbeiro["_id"]),
            "nome": barbeiro["nome"]
        }
        for barbeiro in barbeiros
    ]
  
#Perfil do barbeiro  
@router.get("/me")
def meu_perfil_barbeiro(
    barbeiro=Depends(get_barbeiro)
):
    usuario_id = barbeiro.get("id")
    
    perfil_barbeiro = barbeiros_collection.find_one({
        "usuario_id": ObjectId(usuario_id)
    })
    
    if not perfil_barbeiro:
        raise HTTPException(
            status_code=404,
            detail="Perfil do barbeiro não encontrado."
        )
        
    return{
        "id": str(perfil_barbeiro["_id"]),
        "usuario_id": str(perfil_barbeiro["usuario_id"]),
        "nome": perfil_barbeiro["nome"],
        "ativo": perfil_barbeiro["ativo"],
        "created_at": perfil_barbeiro["created_at"]
    }

@router.get("/barbeiro/dashboard")
def dashboard_barbeiro(barbeiro=Depends(get_barbeiro)):

    perfil_barbeiro = barbeiros_collection.find_one({
        "usuario_id": ObjectId(barbeiro["id"]),
        "ativo": True
    })

    if not perfil_barbeiro:
        raise HTTPException(
            status_code=404,
            detail="Perfil de barbeiro não encontrado ou inativo"
        )

    barber_id = perfil_barbeiro["_id"]

    pipeline = [
        {
            "$match": {
                "barber_id": barber_id,
                "status": {
                    "$in": ["agendado", "em_atendimento"]
                }
            }
        },
        {
            "$lookup": {
                "from": "clientes",
                "localField": "cliente_id",
                "foreignField": "_id",
                "as": "cliente_info"
            }
        },
        {
            "$unwind": "$cliente_info"
        },
        {
            "$sort": {
                "horario": 1
            }
        }
    ]

    resultados = list(
        agendamentos_collection.aggregate(pipeline)
    )

    lista = []

    for ag in resultados:
        lista.append({
            "_id": str(ag["_id"]),
            "cliente_id": str(ag["cliente_id"]),
            "nome": ag["cliente_info"]["usuario"],
            "horario": ag["horario"],
            "servico_id": ag["servico_id"],
            "preco": ag["preco"],
            "status": ag["status"]
        })

    return {
        "agendamentos": lista
    }
    
@router.post("/barbeiro/chamar")
async def chamar_proximo_barbeiro(barbeiro=Depends(get_barbeiro)):

    perfil_barbeiro = barbeiros_collection.find_one({
        "usuario_id": ObjectId(barbeiro["id"]),
        "ativo": True
    })

    if not perfil_barbeiro:
        raise HTTPException(
            status_code=404,
            detail="Perfil de barbeiro não encontrado ou inativo"
        )

    filtro = {
        "status": "agendado",
        "barber_id": perfil_barbeiro["_id"]
    }

    proximo = agendamentos_collection.find_one_and_update(
        filtro,
        {
            "$set": {
                "status": "em_atendimento",
                "atendido_em": datetime.now(timezone.utc)
            }
        },
        sort=[("horario", 1)],
        return_document=ReturnDocument.AFTER
    )

    if not proximo:
        raise HTTPException(
            status_code=404,
            detail="Nenhum agendamento pendente para este barbeiro"
        )

    # Notifica o cliente via WebSocket
    evento = {
    "tipo": "cliente_chamado",
    "agendamento_id": str(proximo["_id"]),
    "cliente_id": str(proximo["cliente_id"]),
    "barber_id": str(proximo["barber_id"]),
    "status": "em_atendimento"
    }

    # Notificar cada destinatário
    notificacoes = [
        (
            "cliente",
            manager.enviar_para_cliente(
                str(proximo["cliente_id"]),
                evento
            )
        ),
        (
            "barbeiro",
            manager.enviar_para_barbeiro(
                str(proximo["barber_id"]),
                evento
            )
        ),  
        (
            "administradores",
            manager.enviar_para_admins(evento)
        )
    ]

    for destinatario, notificacao in notificacoes:
        try:
         await notificacao
        except Exception:
            logger.exception(
                "Falha ao notificar %s sobre cliente_chamado",
                destinatario
        )   

    return {
        "message": "Cliente chamado",
        "agendamento_id": str(proximo["_id"]),
        "cliente_id": str(proximo["cliente_id"]),
        "barber_id": str(proximo["barber_id"]),
        "status": proximo["status"]
    }
    
@router.post("/barbeiro/finalizar")
async def finalizar_atendimento_barbeiro(
    dados: dict,
    barbeiro=Depends(get_barbeiro)
):
    perfil_barbeiro = barbeiros_collection.find_one({
        "usuario_id": ObjectId(barbeiro["id"]),
        "ativo": True
    })

    if not perfil_barbeiro:
        raise HTTPException(
            status_code=404,
            detail="Perfil de barbeiro não encontrado ou inativo."
        )

    agendamento_id = dados.get("agendamento_id")

    if not agendamento_id:
        raise HTTPException(
            status_code=400,
            detail="ID do agendamento não informado."
        )

    try:
        agendamento_id = ObjectId(agendamento_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID do agendamento inválido."
        )

    agendamento = agendamentos_collection.find_one({
        "_id": agendamento_id,
        "barber_id": perfil_barbeiro["_id"],
        "status": "em_atendimento"
    })

    if not agendamento:
        raise HTTPException(
            status_code=404,
            detail="Agendamento não encontrado ou não está em atendimento."
        )

    agora = datetime.now(timezone.utc)

    atendimento = {
        **agendamento,
        "status": "finalizado",
        "finalizado_em": agora
    }

    atendimento.pop("_id", None)

    resultado_atendido = atendidos_collection.insert_one(
        atendimento
    )

    resultado_remocao = agendamentos_collection.delete_one({
        "_id": agendamento_id,
        "barber_id": perfil_barbeiro["_id"],
        "status": "em_atendimento"
    })

    if resultado_remocao.deleted_count == 0:
        atendidos_collection.delete_one({
            "_id": resultado_atendido.inserted_id
        })

        raise HTTPException(
            status_code=400,
            detail="Não foi possível remover o agendamento."
        )
        
    evento = {
        "tipo": "atendimento_finalizado",
        "agendamento_id": str(agendamento_id),
        "cliente_id": str(agendamento["cliente_id"]),
        "barber_id": str(perfil_barbeiro["_id"]),
        "status": "finalizado"
    }

    # Enviar evento ao cliente
    try:
        await manager.enviar_para_cliente(
            str(agendamento["cliente_id"]),
            evento
        )
    
    except Exception:
        logger.exception(
            "Erro ao notificar cliente sobre finalização"
        )

    # Enviar evento ao barbeiro responsável
    try:
        await manager.enviar_para_barbeiro(
            str(perfil_barbeiro["_id"]),
            evento
        )
    except Exception:
        logger.exception(
            "Erro ao notificar barbeiro sobre finalização"
        )
    

    # Enviar evento aos administradores
    try:
        await manager.enviar_para_admins(evento)
    except Exception:
        logger.exception(
            "Erro ao notificar administradores sobre finalização"
        )

    return {
        "message": "Atendimento finalizado com sucesso.",
        "agendamento_id": str(agendamento_id),
        "atendido_id": str(resultado_atendido.inserted_id),
        "status": "finalizado",
        "finalizado_em": agora
    }