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

    agendamentos_collection.delete_one({
        "_id": atendimento["_id"]
    })

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

            # =====================================================
            # 1. PEGA OS ATENDIMENTOS FINALIZADOS
            # =====================================================
            {
                "$match": {
                    "status": "finalizado"
                }
            },

            # Criamos um status próprio para o relatório
            {
                "$set": {
                    "status_relatorio": "finalizado",
                    "data_base": "$horario"
                }
            },

            # =====================================================
            # 2. JUNTA AS DESISTÊNCIAS
            # =====================================================
            {
                "$unionWith": {
                    "coll": "desistencias",
                    "pipeline": [

                        {
                            "$set": {
                                "status_relatorio": "cancelado",
                                "data_base": "$data_agendamento"
                            }
                        }

                    ]
                }
            },

            # =====================================================
            # 3. PEGAMOS DATA + SERVIÇO + STATUS
            # =====================================================
            {
                "$project": {
                    "status_relatorio": 1,
                    "servico_id": 1,

                    "data_formatada": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$data_base",
                            "timezone": "America/Sao_Paulo"
                        }
                    }
                }
            },

            # =====================================================
            # 4. AGRUPA POR DATA + SERVIÇO + STATUS
            # =====================================================
            {
                "$group": {
                    "_id": {
                        "data": "$data_formatada",
                        "servico_id": "$servico_id",
                        "status": "$status_relatorio"
                    },

                    "total": {
                        "$sum": 1
                    }
                }
            },

            # =====================================================
            # 5. AGRUPA NOVAMENTE POR DATA
            # =====================================================
            {
                "$group": {
                    "_id": "$_id.data",

                    "servicos": {
                        "$push": {
                            "servico_id": "$_id.servico_id",
                            "status": "$_id.status",
                            "total": "$total"
                        }
                    },

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
                    }
                }
            },

            # =====================================================
            # 6. FORMATO FINAL PARA O FRONTEND
            # =====================================================
            {
                "$project": {
                    "_id": 0,
                    "data": "$_id",
                    "servicos": 1,
                    "total_finalizados": 1,
                    "total_cancelados": 1
                }
            },

            # =====================================================
            # 7. MAIS RECENTE PRIMEIRO
            # =====================================================
            {
                "$sort": {
                    "data": -1
                }
            }
        ]

        # IMPORTANTE:
        # Agora começamos pela coleção de atendidos,
        # pois ela contém os finalizados.
        cursor = atendidos_collection.aggregate(pipeline)

        resultado = list(cursor)

        return resultado

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar relatório de atendimentos: {str(e)}"
        )

# =========================================================
# 📌 Chamar próximo (somente admin)
# =========================================================
@router.post("/admin/chamar")
def chamar_proximo(admin=Depends(get_admin)):

    proximo = agendamentos_collection.find_one_and_update(
        {"status": "agendado"},
        {
            "$set": {
                "status": "em_atendimento",
                "atendido_em": datetime.utcnow()
            }
        },
        sort=[("horario", 1)],
        return_document=ReturnDocument.AFTER
    )

    if not proximo:
        raise HTTPException(
            status_code=404,
            detail="Nenhum agendamento pendente"
        )

    return {
        "message": "Cliente chamado",
        "agendamento_id": str(proximo["_id"]),
        "cliente_id": str(proximo["cliente_id"]),
        "status": proximo["status"]
    }
 
# =========================================================
# 📊 Dashboard Admin (produção)
# =========================================================
@router.get("/admin/dashboard")
def dashboard_admin(admin=Depends(get_admin)):

    hoje_inicio = datetime.utcnow().replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    hoje_fim = datetime.utcnow().replace(
        hour=23, minute=59, second=59, microsecond=999999
    )

    fila = agendamentos_collection.count_documents({
        "status": "agendado"
    })

    atendimentos_hoje = atendidos_collection.count_documents({
        "status": "finalizado",
        "finalizado_em": {"$gte": hoje_inicio, "$lte": hoje_fim}
    })



    pipeline = [
        {
            "$match": {
                "status": {"$in": ["agendado", "em_atendimento"]}
            }
        },
        {
            "$lookup": {
                "from": "clientes",  # nome da collection de clientes ****
                "localField": "cliente_id",
                "foreignField": "_id",
                "as": "cliente_info"
            }
        },
        {
            "$unwind": "$cliente_info"
        },
        {
            "$sort": {"horario": 1}
        }
    ]

    resultados = list(agendamentos_collection.aggregate(pipeline))

    lista = []

    for ag in resultados:
        lista.append({
            "_id": str(ag["_id"]),
            "cliente_id": str(ag["cliente_id"]),
            "nome": ag["cliente_info"]["usuario"],
            "horario": ag["horario"],
            "servico_id": ag["servico_id"],
            "status": ag["status"]
        })

    desistencias_hoje = desistencias_collection.count_documents({
        "data_desistencia": {
            "$gte": hoje_inicio,
            "$lte": hoje_fim
        }
    })

    print("DESISTÊNCIAS HOJE:", desistencias_hoje)

    return {
        "fila": fila,
        "atendimentosHoje": atendimentos_hoje,
        "barbeirosAtivos": 1,
        "agendamentos": lista,
        "desistenciasHoje": desistencias_hoje
    } 