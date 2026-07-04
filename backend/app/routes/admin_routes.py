from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin
from app.schemas.agendamento_schema import AgendamentoCreate
from app.services.relatorio_service import buscar_relatorio_atendimentos_por_dia


router = APIRouter(
    prefix="/agendamentos",
    tags=["agendamentos"]
)

agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]
desistencias_collection = db["desistencias"]



# =========================================================
# Finalizar atendimento 
# =========================================================

@router.post("/admin/finalizar")
def finalizar_atendimento(admin=Depends(get_admin)):

    atendimento = agendamentos_collection.find_one_and_update(
        {"status": "em_atendimento"},
        {
            "$set": {
                "status": "finalizado",
                "finalizado_em": datetime.utcnow()
            }
        },
        return_document=ReturnDocument.AFTER
    )

    if not atendimento:
        raise HTTPException(
            status_code=404,
            detail="Nenhum atendimento em andamento"
        )

    # 🔥 salvar histórico na collection atendidos
    atendidos_collection.insert_one(atendimento)
    agendamentos_collection.delete_one({"_id": atendimento["_id"]})

    return {
        "message": "Atendimento finalizado",
        "agendamento_id": str(atendimento["_id"])
    }


@router.get("/admin/dashboard/relatorio-atendimentos")
async def get_relatorio_atendimentos(
    _admin=Depends(get_admin)
):
    try: 
        pipeline = [
            # 1. Filtra os cancelados que ainda estão na coleção principal de agendamentos
            {
                "$match": {
                    "status": "cancelado"
                }
            },
            # 2. 🔥 A MÁGICA: Unimos os dados com a coleção de finalizados (atendidos_collection)
            {
                "$unionWith": {
                    "coll": "atendidos", # Coloque aqui o nome exato da sua coleção 'atendidos_collection' no banco
                    "pipeline": [
                        {
                            "$match": {
                                "status": "finalizado" #E aqui tambemmmmmmm
                            }
                        }
                    ]
                }
            },
            # 3. Agora que temos cancelados e finalizados juntos, extraímos a data pura (YYYY-MM-DD)
            {
                "$project": {
                    "status": 1,
                    "data_formatada": { 
                        "$substr": ["$horario", 0, 10] 
                    }
                }
            },
            # 4. Agrupamos por cada dia e somamos os totais
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
            # 5. Formatamos a saída limpa para o frontend
            {
                "$project": {
                    "_id": 0,
                    "data": "$_id",
                    "total_finalizados": 1,
                    "total_cancelados": 1
                }
            },
            # 6. Ordenamos do dia mais recente para o mais antigo
            {
                "$sort": {
                    "data": -1
                }
            }
        ]
         
        cursor = agendamentos_collection.aggregate(pipeline)
        resultado = list(cursor)
        
        return resultado
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao gerar relatório de atendimentos: {str(e)}"
        )
