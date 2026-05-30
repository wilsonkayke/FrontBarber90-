from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.mongo_connection import db
from app.utils.jwt_handler import create_access_token
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests
from app.schemas.client_schema import GoogleLoginRequest

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

@router.post("/google")
async def google_login(dados: GoogleLoginRequest):

    try:
        idinfo = id_token.verify_oauth2_token(
            dados.token,
            requests.Request(),
            "1063455431163-dfm6gi79r4gkiio0257iuh043tr3ocu3.apps.googleusercontent.com"
        )

        email = idinfo["email"]

        user = users_collection.find_one({"email": email})

        # cria usuário automaticamente
        if not user:

            novo_usuario = {
                "email": email,
                "usuario": idinfo.get("name", email),
                "role": "cliente",
                "google_auth": True
            }

            resultado = users_collection.insert_one(novo_usuario)

            user = users_collection.find_one({
                "_id": resultado.inserted_id
            })

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

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
