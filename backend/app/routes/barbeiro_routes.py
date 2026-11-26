from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta

from app.db.mongo_connection import db, client
from app.dependencies.auth import get_admin, get_barbeiro, get_current_user
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError, OperationFailure
from app.schemas.barbeiro_schema import BarbeiroCreate
from app.utils.security import hash_password
from bson import ObjectId
from app.services.notificacao_fila import notificar_atualizacao_fila

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
        "agendamento_ativo_id": None,
        "created_at": datetime.now(timezone.utc)
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
                    "$in": ["agendado", "chamado", "em_atendimento"]
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
async def chamar_proximo_barbeiro(
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

    barber_id = perfil_barbeiro["_id"]
    agora = datetime.now(timezone.utc)
    proximo = None

    try:
        with client.start_session() as session:
            with session.start_transaction():

                # Seleciona o próximo cliente
                proximo = agendamentos_collection.find_one(
                    {
                        "barber_id": barber_id,
                        "status": "agendado"
                    },
                    sort=[("horario", 1)],
                    session=session
                )

                if not proximo:
                    raise HTTPException(
                        status_code=404,
                        detail="Nenhum agendamento pendente."
                    )

                # Reserva o barbeiro atomicamente
                reserva = barbeiros_collection.update_one(
                    {
                        "_id": barber_id,
                        "ativo": True,
                        "agendamento_ativo_id": None
                    },
                    {
                        "$set": {
                            "agendamento_ativo_id": proximo["_id"]
                        }
                    },
                    session=session
                )

                if reserva.modified_count != 1:
                    raise HTTPException(
                        status_code=409,
                        detail="Barbeiro já possui um cliente ativo."
                    )

                # Atualiza o agendamento
                resultado = agendamentos_collection.update_one(
                    {
                        "_id": proximo["_id"],
                        "barber_id": barber_id,
                        "status": "agendado"
                    },
                    {
                        "$set": {
                            "status": "chamado",
                            "chamado_em": agora
                        },
                        "$unset": {
                            "atendido_em": ""
                        }
                    },
                    session=session
                )

                if resultado.modified_count != 1:
                    raise HTTPException(
                        status_code=409,
                        detail="Agendamento não está mais disponível."
                    )

    except HTTPException:
        raise

    except OperationFailure as error:
        logger.exception(
            "Conflito ou falha na transação de chamada"
        )

        if error.has_error_label("TransientTransactionError"):
            raise HTTPException(
                status_code=409,
                detail="Chamada concorrente detectada. Tente novamente."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro ao processar chamada."
        )

    except PyMongoError:
        logger.exception("Erro no MongoDB ao chamar cliente")
        raise HTTPException(
            status_code=500,
            detail="Erro ao processar chamada."
        )

    # A transação já foi confirmada neste ponto.
    evento = {
        "tipo": "cliente_chamado",
        "agendamento_id": str(proximo["_id"]),
        "cliente_id": str(proximo["cliente_id"]),
        "barber_id": str(barber_id),
        "status": "chamado",
        "chamado_em": agora.isoformat()
    }
    
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
                str(barber_id),
                evento
            )
        ),
        (
            "administradores",
            manager.enviar_para_admins(evento)
        ),
        (
            "cliente na fila",
            notificar_atualizacao_fila(
                barber_id,
                proximo["horario"]
            )
        )
    ]

    for destinatario, notificacao in notificacoes:
        try:
            await notificacao
        except Exception:
            logger.exception(
                "Falha ao processar notificação de chamada para %s",
                destinatario
            )

    return {
        "message": "Cliente chamado com sucesso.",
        "agendamento_id": str(proximo["_id"]),
        "cliente_id": str(proximo["cliente_id"]),
        "barber_id": str(barber_id),
        "status": "chamado",
        "chamado_em": agora.isoformat()
    }
    

@router.post("/barbeiro/confirmar-presenca")
async def confirmar_presenca_barbeiro(
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

    if not agendamento_id or not ObjectId.is_valid(agendamento_id):
        raise HTTPException(
            status_code=400,
            detail="ID do agendamento inválido."
        )

    agendamento_id = ObjectId(agendamento_id)
    barber_id = perfil_barbeiro["_id"]
    agora = datetime.now(timezone.utc)
    prazo_limite = agora - timedelta(minutes=15)

    try:
        with client.start_session() as session:
            with session.start_transaction():

                # Confirma somente se o barbeiro estiver
                # reservado para este agendamento.
                reserva = barbeiros_collection.find_one(
                    {
                        "_id": barber_id,
                        "ativo": True,
                        "agendamento_ativo_id": agendamento_id
                    },
                    session=session
                )

                if not reserva:
                    raise HTTPException(
                        status_code=409,
                        detail="Este agendamento não está reservado para o barbeiro."
                    )

                # Atualização condicional: impede confirmar
                # um cliente cujo prazo já expirou.
                resultado = agendamentos_collection.update_one(
                    {
                        "_id": agendamento_id,
                        "barber_id": barber_id,
                        "status": "chamado",
                        "chamado_em": {
                            "$gt": prazo_limite,
                            "$lte": agora
                        }
                    },
                    {
                        "$set": {
                            "status": "em_atendimento",
                            "atendido_em": agora
                        }
                    },
                    session=session
                )

                if resultado.modified_count != 1:
                    raise HTTPException(
                        status_code=409,
                        detail=(
                            "Não foi possível confirmar a presença. "
                            "O prazo pode ter expirado ou o "
                            "agendamento não está mais disponível."
                        )
                    )

    except HTTPException:
        raise

    except OperationFailure as error:
        logger.exception("Erro na transação de confirmação")

        if error.has_error_label("TransientTransactionError"):
            raise HTTPException(
                status_code=409,
                detail="Conflito na confirmação. Tente novamente."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro ao confirmar presença."
        )

    except PyMongoError:
        logger.exception("Erro no MongoDB ao confirmar presença")
        raise HTTPException(
            status_code=500,
            detail="Erro ao confirmar presença."
        )

    evento = {
        "tipo": "presenca_confirmada",
        "agendamento_id": str(agendamento_id),
        "barber_id": str(barber_id),
        "status": "em_atendimento",
        "atendido_em": agora.isoformat()
    }

    # Busca o cliente após a transação confirmada.
    agendamento = agendamentos_collection.find_one({
        "_id": agendamento_id,
        "barber_id": barber_id,
        "status": "em_atendimento"
    })

    if agendamento:
        evento["cliente_id"] = str(agendamento["cliente_id"])

        notificacoes = [
            manager.enviar_para_cliente(
                str(agendamento["cliente_id"]), evento
            ),
            manager.enviar_para_barbeiro(
                str(barber_id), evento
            ),
            manager.enviar_para_admins(evento)
        ]

        for notificacao in notificacoes:
            try:
                await notificacao
            except Exception:
                logger.exception(
                    "Falha ao enviar evento presenca_confirmada"
                )

    return {
        "message": "Presença confirmada com sucesso.",
        "agendamento_id": str(agendamento_id),
        "barber_id": str(barber_id),
        "status": "em_atendimento",
        "atendido_em": agora.isoformat()
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

    if not agendamento_id or not ObjectId.is_valid(agendamento_id):
        raise HTTPException(
            status_code=400,
            detail="ID do agendamento inválido."
        )

    agendamento_id = ObjectId(agendamento_id)
    barber_id = perfil_barbeiro["_id"]
    agora = datetime.now(timezone.utc)

    agendamento = None
    atendido_id = None

    try:
        with client.start_session() as session:
            with session.start_transaction():

                # Verifica se o agendamento está em atendimento.
                agendamento = agendamentos_collection.find_one(
                    {
                        "_id": agendamento_id,
                        "barber_id": barber_id,
                        "status": "em_atendimento"
                    },
                    session=session
                )

                if not agendamento:
                    raise HTTPException(
                        status_code=409,
                        detail="Agendamento não está em atendimento."
                    )

                # Libera somente o barbeiro reservado
                # para este agendamento.
                liberacao = barbeiros_collection.update_one(
                    {
                        "_id": barber_id,
                        "agendamento_ativo_id": agendamento_id
                    },
                    {
                        "$set": {
                            "agendamento_ativo_id": None
                        }
                    },
                    session=session
                )

                if liberacao.modified_count != 1:
                    raise HTTPException(
                        status_code=409,
                        detail="Reserva do barbeiro inconsistente."
                    )

                # Prepara o histórico do atendimento.
                atendimento = {
                    **agendamento,
                    "agendamento_id": agendamento_id,
                    "status": "finalizado",
                    "finalizado_em": agora
                }

                atendimento.pop("_id", None)

                # Registra o atendimento no histórico.
                resultado_atendido = atendidos_collection.insert_one(
                    atendimento,
                    session=session
                )

                atendido_id = resultado_atendido.inserted_id

                # Remove o agendamento ativo.
                resultado_remocao = agendamentos_collection.delete_one(
                    {
                        "_id": agendamento_id,
                        "barber_id": barber_id,
                        "status": "em_atendimento"
                    },
                    session=session
                )

                if resultado_remocao.deleted_count != 1:
                    raise HTTPException(
                        status_code=409,
                        detail="Não foi possível remover o agendamento."
                    )

    except HTTPException:
        raise

    except OperationFailure as error:
        logger.exception("Erro na transação de finalização")

        if error.has_error_label("TransientTransactionError"):
            raise HTTPException(
                status_code=409,
                detail="Conflito na finalização. Tente novamente."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro ao finalizar atendimento."
        )

    except PyMongoError:
        logger.exception("Erro no MongoDB ao finalizar atendimento")
        raise HTTPException(
            status_code=500,
            detail="Erro ao finalizar atendimento."
        )

    # Notifica somente após a transação ser confirmada.
    evento = {
        "tipo": "atendimento_finalizado",
        "agendamento_id": str(agendamento_id),
        "cliente_id": str(agendamento["cliente_id"]),
        "barber_id": str(barber_id),
        "status": "finalizado"
    }

    notificacoes = [
        (
            "cliente",
            manager.enviar_para_cliente(
                str(agendamento["cliente_id"]), evento
            )
        ),
        (
            "barbeiro",
            manager.enviar_para_barbeiro(
                str(barber_id), evento
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
                "Falha ao notificar %s sobre finalização",
                destinatario
            )

    return {
        "message": "Atendimento finalizado com sucesso.",
        "agendamento_id": str(agendamento_id),
        "atendido_id": str(atendido_id),
        "status": "finalizado",
        "finalizado_em": agora.isoformat()
    }
