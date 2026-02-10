from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.config.database import db
from app.schemas.agendamento_schema import AgendamentoCreate

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"]
)

@router.post("/")
def criar_agendamento(dados: AgendamentoCreate):

    if not ObjectId.is_valid(dados.cliente_id):
        raise HTTPException(status_code=400, detail="ID do cliente inválido")

    cliente_oid = ObjectId(dados.cliente_id)

    agendamentos_collection = db["agendamentos"]
    fila_collection = db["fila"]

    # 📅 Criar agendamento
    agendamento = {
        "cliente_id": cliente_oid,
        "data": dados.data,
        "hora": dados.hora,
        "status": "agendado",
        "created_at": datetime.utcnow()
    }

    result = agendamentos_collection.insert_one(agendamento)

    # ⏳ Inserir cliente na fila
    fila_collection.insert_one({
        "cliente_id": cliente_oid,
        "agendamento_id": result.inserted_id,
        "status": "aguardando",
        "entrada_em": datetime.utcnow()  # ✅ AQUI
    })

    return {
        "message": "Agendamento criado e cliente inserido na fila",
        "agendamento_id": str(result.inserted_id)
    }


