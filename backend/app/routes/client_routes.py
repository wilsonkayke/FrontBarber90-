from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.db.mongo_connection import db
from app.models.client_model import Client

router = APIRouter(prefix="/clientes", tags=["Clientes"])
collection = db["clientes"]

@router.post("/")
def criar_cliente(cliente: Client):
    """Cadastra um novo cliente na barbearia"""
    result = collection.insert_one(cliente.dict())
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Erro ao cadastrar cliente")
    return {"message": "Cliente cadastrado com sucesso!", "id": str(result.inserted_id)}

@router.get("/{cliente_id}")
def obter_cliente(cliente_id: str):
    """Obtém um cliente pelo ID"""
    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    cliente = collection.find_one({"_id": ObjectId(cliente_id)})
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    cliente["_id"] = str(cliente["_id"])
    return cliente

@router.put("/{cliente_id}")
def atualizar_cliente(cliente_id: str, dados: Client):
    """Atualiza os dados de um cliente"""
    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    result = collection.update_one(
        {"_id": ObjectId(cliente_id)},
        {"$set": dados.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    return {"message": "Cliente atualizado com sucesso!"}

@router.delete("/{cliente_id}")
def deletar_cliente(cliente_id: str):
    """Remove um cliente pelo ID"""
    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    result = collection.delete_one({"_id": ObjectId(cliente_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    return {"message": "Cliente removido com sucesso!"}