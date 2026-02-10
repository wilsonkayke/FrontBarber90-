from fastapi import APIRouter, HTTPException
from app.schemas.client_schema import ClientLogin
from app.db.mongo_connection import db
from app.utils.security import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

collection = db["clientes"]


@router.post("/login")
def login(dados: ClientLogin):
    cliente = collection.find_one({"email": dados.email})

    if not cliente:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    if not verify_password(dados.senha, cliente["senha"]):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    return {
        "message": "Login realizado com sucesso",
        "cliente_id": str(cliente["_id"]),
        "usuario": cliente["usuario"],
        "email": cliente["email"],
        "role": cliente.get("role", "cliente")  
    }
