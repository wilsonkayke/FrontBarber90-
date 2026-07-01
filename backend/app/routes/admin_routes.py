from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin
from app.schemas.agendamento_schema import AgendamentoCreate


router = APIRouter(
    prefix="/agendamentos",
    tags=["agendamentos"]
)

agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]
desistencias_collection = db["desistencias"]


@router.get("/admin/dashboard/datas")
async def get_agendamentos_admin_datas(
    admin=Depends(get_admin)
):
    
    try:
        pipeline = [

                {
                    "$match": {
                        "status": {
                            "$in": [
                                "agendado",
                                "em_atendimento"
                            ]
                        },
                        "horario": {
                            "$gte": datetime.utcnow()
                        }
                    }
                },

                {
                    "$project": {
                        "data_formatada": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$horario",
                                "timezone": "America/Sao_Paulo"
                            }
                        }
                    }
                },

                {
                    "$group": {
                        "_id": "$data_formatada",
                        "quantidade": {
                            "$sum": 1
                        }
                    }
                },

                {
                    "$project": {
                        "_id": 0,
                        "data": "$_id",
                        "quantidade": 1
                    }
                },

                {
                    "$sort": {
                        "data": 1
                    }
                }

        ]
        
        # Executa a agregação no MongoDB
        cursor = agendamentos_collection.aggregate(pipeline)
        resultado = list(cursor)
        
        return resultado
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao buscar datas de agendamentos: {str(e)}"
        )