from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.db.mongo_connection import db
from app.dependencies.auth import get_admin
from app.schemas.servico_schema import ServicoCreate, ServicoResponse


router = APIRouter(
    prefix="/servicos",
    tags=["Serviços"]
)

servicos_collection = db["servicos"]


# =========================================================
# 📌 Listar serviços ativos
# =========================================================
@router.get("/", response_model=List[ServicoResponse])
def listar_servicos():

    servicos = servicos_collection.find({
        "status": "ativo"
    })

    lista_servicos = []

    for servico in servicos:
        lista_servicos.append({
            "id": int(servico["_id"]),
            "nome": servico["nome"],
            "preco": servico["preco"],
            "status": servico["status"],
            "created_at": servico["created_at"]
        })

    return lista_servicos


# =========================================================
# 📌 Cadastrar serviço
# Somente administrador
# =========================================================
@router.post("/", response_model=ServicoResponse)
def criar_servico(
    dados: ServicoCreate,
    usuario=Depends(get_admin)
):

    if dados.preco <= 0:
        raise HTTPException(
            status_code=400,
            detail="O preço deve ser maior que zero."
        )

    ultimo_servico = servicos_collection.find_one(
        sort=[("_id", -1)]
    )

    if ultimo_servico:
        novo_id = int(ultimo_servico["_id"]) + 1
    else:
        novo_id = 1

    servico = {
        "_id": novo_id,
        "nome": dados.nome,
        "preco": dados.preco,
        "status": "ativo",
        "created_at": datetime.now(timezone.utc)
    }

    servicos_collection.insert_one(servico)

    return {
        "id": novo_id,
        "nome": servico["nome"],
        "preco": servico["preco"],
        "status": servico["status"],
        "created_at": servico["created_at"]
    }