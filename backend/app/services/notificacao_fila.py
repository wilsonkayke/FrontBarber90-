
import logging

from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from bson import ObjectId

from app.db.mongo_connection import db
from app.websocket.manager import manager


logger = logging.getLogger(__name__)

agendamentos_collection = db["agendamentos"]

FUSO_HORARIO = ZoneInfo("America/Bahia")


def obter_limites_dia(horario: datetime):

    if horario.tzinfo is None:
        horario = horario.replace(tzinfo=timezone.utc)

    horario_local = horario.astimezone(FUSO_HORARIO)

    inicio_dia = horario_local.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    fim_dia = inicio_dia + timedelta(days=1)

    return (
        inicio_dia.astimezone(timezone.utc),
        fim_dia.astimezone(timezone.utc)
    )


def obter_filtro_fila(
    barber_id: ObjectId,
    horario: datetime
):

    inicio_utc, fim_utc = obter_limites_dia(horario)

    return {
        "barber_id": barber_id,
        "status": "agendado",
        "horario": {
            "$gte": inicio_utc,
            "$lt": fim_utc
        }
    }


async def notificar_atualizacao_fila(
    barber_id: ObjectId,
    horario: datetime
):

    try:

        filtro = obter_filtro_fila(
            barber_id,
            horario
        )

        clientes_ids = agendamentos_collection.distinct(
            "cliente_id",
            filtro
        )

        clientes_ids = [
            str(cliente_id)
            for cliente_id in clientes_ids
        ]

        if not clientes_ids:
            return

        evento = {
            "tipo": "fila_atualizada"
        }

        await manager.enviar_para_clientes(
            clientes_ids,
            evento
        )

        logger.info(
            "Atualização da fila processada. "
            "Barbeiro: %s | Clientes elegíveis: %s",
            barber_id,
            len(clientes_ids)
        )

    except Exception:
        logger.exception(
            "Erro ao notificar atualização da fila. "
            "Barbeiro: %s",
            barber_id
        )
