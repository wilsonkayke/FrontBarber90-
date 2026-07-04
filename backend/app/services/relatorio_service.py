from bson import json_util
import json

from app.db.mongo_connection import db

async def buscar_relatorio_atendimentos_por_dia(db):
    """
    Agrupa e conta os atendimentos finalizados e cancelados por dia.
    """
    pipeline = [
        # 1. Filtra apenas os status históricos
        {
            "$match": {
                "status": {
                    "$in": ["finalizado", "cancelado"]
                }
            }
        },
        # 2. Converte a data do 'horario' para String no formato YYYY-MM-DD
        {
            "$project": {
                "status": 1,
                "data_formatada": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$horario",
                        "timezone": "America/Sao_Paulo"
                    }
                }
            }
        },
        # 3. Agrupa por cada dia e soma os status condicionalmente
        {
            "$group": {
                "_id": "$data_formatada",
                "total_finalizados": {
                    "$sum": { "$cond": [{ "$eq": ["$status", "finalizado"] }, 1, 0] }
                },
                "total_cancelados": {
                    "$sum": { "$cond": [{ "$eq": ["$status", "cancelado"] }, 1, 0] }
                }
            }
        },
        # 4. Formata a saída limpando o _id do Mongo para o formato que o frontend espera
        {
            "$project": {
                "_id": 0,
                "data": "$_id",
                "total_finalizados": 1,
                "total_cancelados": 1
            }
        },
        # 5. Ordena do dia mais recente para o mais antigo
        {
            "$sort": {
                "data": -1
            }
        }
    ]
    
    # Executa a agregação na sua coleção de agendamentos
    cursor = db.agendamentos.aggregate(pipeline)
    resultados = await cursor.to_list(length=100)
    
    return resultados