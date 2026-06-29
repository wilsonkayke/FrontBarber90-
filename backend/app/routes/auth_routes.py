from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from bson import ObjectId

#rotas
from app.db.mongo_connection import db
from app.utils.jwt_handler import create_access_token, create_reset_token, verify_reset_token
from app.utils.email_service import send_reset_email
from app.schemas.client_schema import ForgotPasswordRequest, ResetPasswordRequest
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests
from app.schemas.client_schema import GoogleLoginRequest, ClientLogin

router = APIRouter(prefix="/auth", tags=["Auth"])

users_collection = db["clientes"]
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 

@router.post("/login")
async def login(dados: ClientLogin):

    email = dados.email.strip().lower()

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email ou senha inválidos"
        )

    if not pwd_context.verify(dados.senha, user["senha"]):
        raise HTTPException(
            status_code=400,
            detail="Email ou senha inválidos"
        )

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

@router.post("/forgot-password")
async def forgot_password(dados: ForgotPasswordRequest):

    user = users_collection.find_one({"email": dados.email})

    # Nunca informar se o e-mail existe ou não
    if not user:
        return {
            "msg": "Seu link foi gerado!! (Teste de redefinir senha)"
        }

    token = create_reset_token(str(user["_id"]))

    reset_link = (
     f"https://sistemagerenciamentefila.vercel.app/reset-password?token={token}"
    )

    print(f"\n[TESTE LOCAL] Link de redefinição gerado: {reset_link}\n")

    #send_reset_email(user["email"], reset_link)

    return {
        "msg": "Link gerado para teste",
        "reset_link": reset_link
    }


@router.post("/reset-password")
def reset_password(dados: ResetPasswordRequest):

    user_id = verify_reset_token(dados.token)

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado"
        )

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )

    nova_senha_hash = pwd_context.hash(dados.nova_senha)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "senha": nova_senha_hash
            }
        }
    )

    return {
        "msg": "Senha alterada com sucesso!"
    }