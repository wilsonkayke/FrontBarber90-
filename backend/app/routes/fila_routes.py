from fastapi import APIRouter, HTTPException
from app.config.database import db
from bson import ObjectId

router = APIRouter(
    prefix="/fila",
    tags=["Fila"]
)

fila_collection = db["fila"]

@router.get("/{cliente_id}")
def obter_posicao_fila(cliente_id: str):
    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    fila = list(
        fila_collection
        .find({"status": "aguardando"})
        .sort("entrada_em", 1)
    )

    for index, item in enumerate(fila):
        if str(item["cliente_id"]) == cliente_id:
            return {
                "posicao": index + 1,
                "pessoas_a_frente": index,
                "total_na_fila": len(fila)
            }

    raise HTTPException(status_code=404, detail="Cliente não está na fila")


