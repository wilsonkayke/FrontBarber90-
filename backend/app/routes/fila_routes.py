from fastapi import APIRouter, HTTPException, Depends, Request
from app.db.mongo_connection import db
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth import get_current_user, get_admin
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from app.services.notificacao_fila import obter_filtro_fila, notificar_atualizacao_fila

import logging
from app.websocket.manager import manager

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/fila",
    tags=["Fila"]
)

agendamentos_collection = db["agendamentos"]
desistencias_collection = db["desistencias"]

@router.delete("/agendamentos/sair")    
async def sair_fila(usuario=Depends(get_current_user)):

    cliente_id = ObjectId(usuario["id"])
    horario_atual_utc = datetime.now(timezone.utc)

    # Busca o agendamento ativo
    agendamento = agendamentos_collection.find_one({
        "cliente_id": cliente_id,
        "status": "agendado"
    })

    if not agendamento:
        raise HTTPException(
            status_code=404,
            detail="Nenhum agendamento ativo encontrado."
        )

    # Calcula o tempo de espera usando entrada_em
    entrada_em = agendamento.get("entrada_em")

    if entrada_em:
        tempo_espera = int(
            (
                horario_atual_utc -
                entrada_em.astimezone(timezone.utc)
            ).total_seconds() / 60
        )
    else:
        tempo_espera = 0
    

    documento_desistencia = {
        "id_agendamento": agendamento["_id"],
        "id_cliente": cliente_id,
        "barber_id": agendamento.get("barber_id"),

        # serviço_id que o usuário escolheu para o agendamento
        "servico_id": agendamento.get("servico_id"),

        # Dados úteis para relatórios
        "email": usuario.get("email"),
        "role": usuario.get("role"),

        # Datas
        "data_agendamento": agendamento.get("horario"),
        "data_entrada_fila": entrada_em,
        "data_desistencia": horario_atual_utc,

        # Métricas
        "tempo_espera_minutos": max(0, tempo_espera),

        # Controle
        "status_anterior": "agendado",
        "motivo": "cliente_desistiu_via_site"
    }   

    try:
        resultado = desistencias_collection.insert_one(
            documento_desistencia
        )
        
        if resultado.inserted_id:
            agendamentos_collection.delete_one({"_id": agendamento["_id"]})
    except Exception as e:
        print("Erro ao salvar desistência:", e)
        raise HTTPException(
            status_code=500,
            detail="Erro ao processar a desistência."
        )
    
    evento = {
        "tipo": "cliente_desistiu",
        "agendamento_id": str(agendamento["_id"]),
        "cliente_id": str(cliente_id),
        "barber_id": str(agendamento["barber_id"]),
        "status": "cancelado"
    }   

    try:
        await manager.enviar_para_barbeiro(
            str(agendamento["barber_id"]),
            evento
        )
    except Exception:
        logger.exception(
            "Erro ao notificar barbeiro sobre desistência"
        )

    try:
        await manager.enviar_para_admins(evento)
    except Exception:
        logger.exception(
            "Erro ao notificar administradores sobre desistência"
        )
        
    await notificar_atualizacao_fila(
        agendamento["barber_id"],
        agendamento["horario"]
    )

    return {
        "msg": "Você saiu da fila de espera com sucesso."
    }
    

# =========================================================
# 📌 Fila do usuário (posição real)
#           Rota fila
# =========================================================


@router.get("/")
async def minha_fila(usuario=Depends(get_current_user)):

    cliente_id = ObjectId(usuario["id"])

    agendamento = agendamentos_collection.find_one({
        "cliente_id": cliente_id,
        "status": "agendado"
    })

    if not agendamento:
        return {
            "posicao": None,
            "pessoas_a_frente": 0,
            "total_na_fila": 0
        }

    # Reutiliza a regra de negócio da fila
    filtro = obter_filtro_fila(
        agendamento["barber_id"],
        agendamento["horario"]
    )

    agendamentos = list(
        agendamentos_collection.find(filtro).sort([
            ("horario", 1),
            ("_id", 1)
        ])
    )

    total = len(agendamentos)
    posicao = None

    for index, ag in enumerate(agendamentos):
        if ag["_id"] == agendamento["_id"]:
            posicao = index + 1
            break

    return {
        "usuario_logado": usuario["id"],
        "posicao": posicao,
        "pessoas_a_frente": posicao - 1 if posicao else 0,
        "total_na_fila": total
    }   
