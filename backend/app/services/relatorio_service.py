from bson import json_util
import json

from app.db.mongo_connection import db

async def buscar_relatorio_atendimentos_por_dia(db):
    """
    Agrupa atendimentos finalizados e cancelados por dia
    e também separa os serviços por status.
    """

    pipeline = [
        {
            "$match": {
                "status": {
                    "$in": ["finalizado", "cancelado"]
                }
            }
        },

        # Cria a data no fuso de São Paulo
        {
            "$project": {
                "status": 1,
                "servico_id": 1,
                "data_formatada": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$horario",
                        "timezone": "America/Sao_Paulo"
                    }
                }
            }
        },

        # Agrupa por DATA + SERVIÇO + STATUS
        {
            "$group": {
                "_id": {
                    "data": "$data_formatada",
                    "servico_id": "$servico_id",
                    "status": "$status"
                },
                "total": {
                    "$sum": 1
                }
            }
        },

        # Agrupa novamente somente pela DATA
        {
            "$group": {
                "_id": "$_id.data",

                "total_finalizados": {
                    "$sum": {
                        "$cond": [
                            {
                                "$eq": [
                                    "$_id.status",
                                    "finalizado"
                                ]
                            },
                            "$total",
                            0
                        ]
                    }
                },

                "total_cancelados": {
                    "$sum": {
                        "$cond": [
                            {
                                "$eq": [
                                    "$_id.status",
                                    "cancelado"
                                ]
                            },
                            "$total",
                            0
                        ]
                    }
                },

                "servicos": {
                    "$push": {
                        "servico_id": "$_id.servico_id",
                        "status": "$_id.status",
                        "total": "$total"
                    }
                }
            }
        },

        # Formata a resposta
        {
            "$project": {
                "_id": 0,
                "data": "$_id",
                "total_finalizados": 1,
                "total_cancelados": 1,
                "servicos": 1
            }
        },

        {
            "$sort": {
                "data": -1
            }
        }
    ]

    cursor = db.agendamentos.aggregate(pipeline)

    resultados = await cursor.to_list(length=100)

    return resultados