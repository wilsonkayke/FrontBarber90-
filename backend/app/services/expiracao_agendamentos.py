import logging
from datetime import datetime, timezone, timedelta

from bson import ObjectId
from pymongo.errors import PyMongoError

from app.db.mongo_connection import db, client

logger = logging.getLogger(__name__)

agendamentos_collection = db["agendamentos"]
barbeiros_collection = db["barbeiros"]
nao_comparecimentos_collection = db["nao_comparecimentos"]


def expirar_agendamento(agendamento_id: ObjectId):
    """
    Arquiva um agendamento chamado após 15 minutos
    e libera o barbeiro na mesma transação.

    Retorna o evento para notificação quando expira,
    ou None quando não há expiração a processar.
    """

    agora = datetime.now(timezone.utc)
    prazo_limite = agora - timedelta(minutes=15)

    evento = None

    try:
        with client.start_session() as session:
            with session.start_transaction():

                agendamento = agendamentos_collection.find_one(
                    {
                        "_id": agendamento_id,
                        "status": "chamado",
                        "chamado_em": {"$lte": prazo_limite}
                    },
                    session=session
                )

                if not agendamento:
                    return None

                barber_id = agendamento["barber_id"]

                # Libera somente a reserva deste agendamento.
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
                    raise RuntimeError(
                        "Reserva inconsistente ao expirar agendamento."
                    )

                # Preserva o ID original para rastreabilidade.
                historico = {
                    **agendamento,
                    "agendamento_id": agendamento_id,
                    "status": "nao_compareceu",
                    "expirado_em": agora
                }

                historico.pop("_id", None)

                nao_comparecimentos_collection.insert_one(
                    historico,
                    session=session
                )

                # Remove da coleção de agendamentos ativos.
                remocao = agendamentos_collection.delete_one(
                    {
                        "_id": agendamento_id,
                        "barber_id": barber_id,
                        "status": "chamado"
                    },
                    session=session
                )

                if remocao.deleted_count != 1:
                    raise RuntimeError(
                        "Falha ao remover agendamento expirado."
                    )

                evento = {
                    "tipo": "prazo_expirado",
                    "agendamento_id": str(agendamento_id),
                    "cliente_id": str(agendamento["cliente_id"]),
                    "barber_id": str(barber_id),
                    "status": "nao_compareceu",
                    "expirado_em": agora.isoformat()
                }

    except (PyMongoError, RuntimeError):
        logger.exception(
            "Erro ao expirar agendamento %s",
            agendamento_id
        )
        raise

    return evento


def processar_agendamentos_expirados():
    """
    Localiza agendamentos chamados com prazo vencido.
    Retorna os eventos dos agendamentos expirados.
    """

    prazo_limite = datetime.now(timezone.utc) - timedelta(
        minutes=15
    )

    agendamentos = agendamentos_collection.find(
        {
            "status": "chamado",
            "chamado_em": {"$lte": prazo_limite}
        },
        {"_id": 1}
    )

    eventos = []

    for agendamento in agendamentos:
        try:
            evento = expirar_agendamento(agendamento["_id"])

            if evento:
                eventos.append(evento)

        except Exception:
            logger.exception(
                "Falha ao processar expiração do agendamento %s",
                agendamento["_id"]
            )

    return eventos
