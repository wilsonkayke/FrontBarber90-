from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.mongo_connection import db
from app.utils.jwt_handler import create_access_token
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Auth"])

users_collection = db["clientes"]
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ✅ Schema direto aqui
class LoginRequest(BaseModel):
    email: str
    senha: str


@router.post("/login")
def login(dados: LoginRequest):

    user = users_collection.find_one({"email": dados.email})

    if not user:
        raise HTTPException(status_code=400, detail="Email ou senha inválidos")

    if not pwd_context.verify(dados.senha, user["senha"]):
        raise HTTPException(status_code=400, detail="Email ou senha inválidos")

    access_token = create_access_token(
        data={
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "cliente")
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "cliente")
        }
    }
