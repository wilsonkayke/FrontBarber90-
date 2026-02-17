from fastapi import APIRouter, HTTPException
from app.db.mongo_connection import db
from bson import ObjectId

router = APIRouter(
    prefix="/fila",
    tags=["Fila"]
)

agendamentos_collection = db["agendamentos"]

@router.get("/{cliente_id}")
def obter_posicao_fila(cliente_id: str):

    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    cliente_object_id = ObjectId(cliente_id)

    fila = list(
        agendamentos_collection
        .find({"status": "aguardando"})
        .sort("entrada_em", 1)
    )

    for index, item in enumerate(fila):
        if item["cliente_id"] == cliente_object_id:
            return {
                "posicao": index + 1,
                "pessoas_a_frente": index,
                "total_na_fila": len(fila)
            }

    raise HTTPException(status_code=404, detail="Cliente não está na fila")
    