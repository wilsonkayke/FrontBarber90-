from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from datetime import datetime, timedelta

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin
from app.schemas.agendamento_schema import AgendamentoCreate

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"]
)

agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]


# =========================================================
# 📌 Criar agendamento (cliente autenticado)
# =========================================================
@router.post("/")
def criar_agendamento(
    dados: AgendamentoCreate,
    usuario=Depends(get_current_user)
):
    
    dados.horario = dados.horario.astimezone(timezone.utc)

    # 🔒 Cliente é sempre o do token
    cliente_oid = ObjectId(usuario["id"])

    agora = datetime.now(timezone.utc)

    # 🔎 Validar se horário é futuro
    if dados.horario <= agora:
        raise HTTPException(
            status_code=400,
            detail="Não é possível agendar para horário passado"
        )

    # 🔎 Verificar se horário já está ocupado
    existente = agendamentos_collection.find_one({
        "horario": dados.horario,
        "status": "agendado"
    })

    if existente:
        raise HTTPException(
            status_code=400,
            detail="Horário já reservado"
        )

    agendamento = {
        "cliente_id": cliente_oid,
        "horario": dados.horario,
        "status": "agendado",
        "created_at": datetime.now(timezone.utc)
    }

    #Aquiiiiiiiiiiiiiii

    result = agendamentos_collection.insert_one(agendamento) 

    return {
        "message": "Agendamento criado com sucesso",
        "agendamento_id": str(result.inserted_id)
    }


# =========================================================
# 📌 Listar agendamentos
# Admin vê todos
# Cliente vê apenas os seus
# =========================================================
@router.get("/")
def listar_agendamentos(usuario=Depends(get_current_user)):

    filtro = {"horario": {"$exists": True}}

    if usuario["role"] == "admin":
        agendamentos = agendamentos_collection.find(filtro).sort("horario", 1)
    else:
        filtro["cliente_id"] = ObjectId(usuario["id"])
        agendamentos = agendamentos_collection.find(filtro).sort("horario", 1)

    lista = []

    for ag in agendamentos:
        lista.append({
            "_id": str(ag["_id"]),
            "cliente_id": str(ag["cliente_id"]),
            "horario": ag["horario"],
            "status": ag["status"],
            "created_at": ag["created_at"]
        })

    return lista



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
            "status": ag["status"]
        })

    return {
        "fila": fila,
        "atendimentosHoje": atendimentos_hoje,
        "barbeirosAtivos": 1,
        "agendamentos": lista
    }

# =========================================================
# 📌 Fila do usuário (posição real)
# =========================================================
@router.get("/fila")
def minha_fila(usuario=Depends(get_current_user)):

    print("USUARIO LOGADO:", usuario["id"])


    agora = datetime.utcnow()

    agendamentos = list(
        agendamentos_collection.find({
            "status": "agendado",
            "horario": {"$gte": agora}
        }).sort("horario", 1)
    )

    total = len(agendamentos)
    posicao = None

    for index, ag in enumerate(agendamentos):
        if ag["cliente_id"] == ObjectId(usuario["id"]):
            posicao = index + 1
            break

    if posicao is None:
        return {
            "posicao": None,
            "pessoas_a_frente": 0,
            "total_na_fila": total
        }

    return {
    "usuario_logado": usuario["id"],
    "posicao": posicao,
    "pessoas_a_frente": posicao - 1 if posicao else 0,
    "total_na_fila": total
    }






