from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin
from app.schemas.agendamento_schema import AgendamentoCreate
from app.services.relatorio_service import buscar_relatorio_atendimentos_por_dia
from app.schemas.servico_schema import ServicoResponse


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

    historico = {
        "cliente_id": atendimento["cliente_id"],
        "servico_id": atendimento["servico_id"],
        "preco": atendimento["preco"],
        "horario": atendimento["horario"],
        "status": "finalizado",
        "created_at": atendimento["created_at"],
        "atendido_em": atendimento.get("atendido_em"),
        "finalizado_em": atendimento["finalizado_em"]
    }

    atendidos_collection.insert_one(historico)

    # Remover da fila de agendamentos
    agendamentos_collection.delete_one({
        "_id": atendimento["_id"]
    })

    return {
        "message": "Atendimento finalizado",
        "agendamento_id": str(atendimento["_id"])
    }  

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
            "preco": ag["preco"],
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


@router.get("/admin/dashboard/relatorio-atendimentos")
async def get_relatorio_atendimentos(
    data_inicio: str | None = None,
    data_fim: str | None = None,
    _admin=Depends(get_admin)
):
    
    inicio = None
    fim = None
    
    if data_inicio:
        inicio = datetime.fromisoformat(data_inicio).replace(
            tzinfo=timezone.ut
        )
        
    if data_fim:
        fim = datetime.fromisoformat(data_fim).replace(
            tzinfo=timezone.utc
        ) + timedelta(days=1)

    try:
        
        filtro_finalizados = {
            "status": "finalizado"
        }
        
        if inicio and fim:
            filtro_finalizados["finalizado_em"] = {
                "$gte": inicio,
                "$lt": fim
            }

        pipeline = [

             {
        "$match": filtro_finalizados
    },

    {
        "$set": {
            "status_relatorio": "finalizado",
            "data_base": "$finalizado_em"
        }
    },

    {
        "$unionWith": {
            "coll": "desistencias",
            "pipeline": [
                {
                    "$match": (
                        {
                            "data_agendamento": {
                                "$gte": inicio,
                                "$lt": fim
                            }
                        }
                        if inicio and fim
                        else {}
                    )
                },
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
            # 4. FORMATA A DATA E MANTÉM OS CAMPOS NECESSÁRIOS
            # =====================================================
            {
                "$project": {
                    "status_relatorio": 1,
                    "servico_id": 1,
                    "preco": 1,
                    "data_base": 1,

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
            # 5. AGRUPA POR:
            #    DATA + SERVIÇO + STATUS
            # =====================================================
            {
                "$group": {
                    "_id": {
                        "data": "$data_formatada",
                        "servico_id": "$servico_id",
                        "status": "$status_relatorio"
                    },

                    # Quantidade de atendimentos/desistências
                    "total": {
                        "$sum": 1
                    },

                    # Soma o preço somente dos atendimentos finalizados
                    "valor_total": {
                        "$sum": {
                            "$cond": [
                                {
                                    "$eq": [
                                        "$status_relatorio",
                                        "finalizado"
                                    ]
                                },
                                {
                                    "$ifNull": [
                                        "$preco",
                                        0
                                    ]
                                },
                                0
                            ]
                        }
                    }
                }
            },

            # =====================================================
            # 6. AGRUPA NOVAMENTE POR DATA
            # =====================================================
            {
                "$group": {
                    "_id": "$_id.data",

                    # Detalhamento por serviço
                    "servicos": {
                        "$push": {
                            "servico_id": "$_id.servico_id",
                            "status": "$_id.status",
                            "total": "$total",
                            "valor_total": "$valor_total"
                        }
                    },

                    # Total de atendimentos finalizados no dia
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

                    # Total de desistências no dia
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

                    # Faturamento daquele dia
                    "faturamento": {
                        "$sum": "$valor_total"
                    }
                }
            },

            # =====================================================
            # 7. TRANSFORMA A DATA STRING EM DATETIME
            # =====================================================
            {
                "$set": {
                    "data_datetime": {
                        "$dateFromString": {
                            "dateString": "$_id",
                            "format": "%Y-%m-%d",
                            "timezone": "America/Sao_Paulo"
                        }
                    }
                }
            },

            # =====================================================
            # 8. CALCULA OS INDICADORES GERAIS
            # =====================================================
            {
                "$group": {
                    
                    "_id": None,

                    # =================================================
                    # FATURAMENTO TOTAL
                    #
                    # Soma todo o histórico de faturamentos.
                    # Não é:
                    # hoje + semana + mês
                    #
                    # porque esses períodos se sobrepõem.
                    # =================================================
                    "faturamentoTotal": {
                        "$sum": "$faturamento"
                    },

                    # =================================================
                    # FATURAMENTO DE HOJE
                    # =================================================
                    "faturamentoHoje": {
                        "$sum": {
                            "$cond": [

                                {
                                    "$eq": [
                                        "$data_datetime",
                                        {
                                            "$dateTrunc": {
                                                "date": "$$NOW",
                                                "unit": "day",
                                                "timezone": "America/Sao_Paulo"
                                            }
                                        }
                                    ]
                                },

                                "$faturamento",

                                0
                            ]
                        }
                    },

                    # =================================================
                    # FATURAMENTO DA SEMANA
                    #
                    # Semana começa na segunda-feira.
                    # =================================================
                    "faturamentoSemana": {
                        "$sum": {
                            "$cond": [

                                {
                                    "$and": [

                                        {
                                            "$gte": [
                                                "$data_datetime",
                                                {
                                                    "$dateTrunc": {
                                                        "date": "$$NOW",
                                                        "unit": "week",
                                                        "startOfWeek": "monday",
                                                        "timezone": "America/Sao_Paulo"
                                                    }
                                                }
                                            ]
                                        },

                                        {
                                            "$lt": [
                                                "$data_datetime",
                                                {
                                                    "$dateAdd": {
                                                        "startDate": {
                                                            "$dateTrunc": {
                                                                "date": "$$NOW",
                                                                "unit": "week",
                                                                "startOfWeek": "monday",
                                                                "timezone": "America/Sao_Paulo"
                                                            }
                                                        },
                                                        "unit": "week",
                                                        "amount": 1
                                                    }
                                                }
                                            ]
                                        }

                                    ]
                                },

                                "$faturamento",

                                0
                            ]
                        }
                    },

                    # =================================================
                    # FATURAMENTO DO MÊS
                    # =================================================
                    "faturamentoMes": {
                        "$sum": {
                            "$cond": [

                                {
                                    "$and": [

                                        {
                                            "$gte": [
                                                "$data_datetime",
                                                {
                                                    "$dateTrunc": {
                                                        "date": "$$NOW",
                                                        "unit": "month",
                                                        "timezone": "America/Sao_Paulo"
                                                    }
                                                }
                                            ]
                                        },

                                        {
                                            "$lt": [
                                                "$data_datetime",
                                                {
                                                    "$dateAdd": {
                                                        "startDate": {
                                                            "$dateTrunc": {
                                                                "date": "$$NOW",
                                                                "unit": "month",
                                                                "timezone": "America/Sao_Paulo"
                                                            }
                                                        },
                                                        "unit": "month",
                                                        "amount": 1
                                                    }
                                                }
                                            ]
                                        }

                                    ]
                                },

                                "$faturamento",

                                0
                            ]
                        }
                    },

                    # =================================================
                    # RELATÓRIO DIÁRIO
                    # =================================================
                    "relatorio": {
                        "$push": {
                            "data": "$_id",
                            "servicos": "$servicos",
                            "total_finalizados": "$total_finalizados",
                            "total_cancelados": "$total_cancelados",
                            "faturamento": "$faturamento"
                        }
                    }
                }
            },

            # =====================================================
            # 9. ORGANIZA O RETORNO FINAL
            # =====================================================
            {
                "$project": {
                    "_id": 0,
                    "faturamentoHoje": 1,
                    "faturamentoSemana": 1,
                    "faturamentoMes": 1,
                    "faturamentoTotal": 1,
                    "relatorio": 1
                }
            }
        ]

        # =========================================================
        # 10. EXECUTA O PIPELINE
        # =========================================================
        resultado = list(
            atendidos_collection.aggregate(pipeline)
        )

        # =========================================================
        # 11. RETORNA O RESULTADO
        # =========================================================
        if resultado:
            return resultado[0]

        return {
            "faturamentoHoje": 0,
            "faturamentoSemana": 0,
            "faturamentoMes": 0,
            "faturamentoTotal": 0,
            "relatorio": []
        }

    except Exception as e:

        print(
            "ERRO NO RELATÓRIO DE ATENDIMENTOS:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Erro ao gerar relatório de atendimentos."
        )