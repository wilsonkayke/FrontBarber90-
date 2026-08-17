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

#@router.post("/forgot-password")
#async def forgot_password(dados: ForgotPasswordRequest):
    # Padroniza o e-mail para evitar problemas de caixa alta/baixa
    email_cliente = dados.email.strip().lower()
    
    user = users_collection.find_one({"email": email_cliente})

    # Segurança: Mantém a mesma mensagem de sucesso mesmo se o usuário não existir
    if not user:
        return {
            "msg": "Se o e-mail estiver cadastrado, um link de redefinição será enviado."
        }

    # Gera o token seguro de reset
    token = create_reset_token(str(user["_id"]))

    # Seu link oficial apontando para a produção na Vercel
    reset_link = (
        f"https://sistemagerenciamentefila.vercel.app/reset-password?token={token}"
    )

    print(f"\n[SISTEMA DE FILA] Link de redefinição gerado para {email_cliente}: {reset_link}\n")

    # Dispara o e-mail através do serviço do Resend com tratamento de erro isolado
    try:
        send_reset_email(email_cliente, reset_link)
    except Exception as e:
        # Registra o erro no terminal do backend para você debugar, 
        # mas não quebra a resposta HTTP do usuário final
        print(f"⚠️ Erro ao disparar e-mail de recuperação: {str(e)}")
        
        # Opcional: Em ambiente local, você pode retornar o link no console caso o Resend falhe por restrição de sandbox
        return {
            "msg": "Se o e-mail estiver cadastrado, um link de redefinição será enviado.",
            "debug_local_link": reset_link  # Remova essa linha quando o domínio próprio estiver verificado
        }

 #   return {
 #       "msg": "Se o e-mail estiver cadastrado, um link de redefinição será enviado."
 #   }

@router.post("/forgot-password")
async def forgot_password(dados: ForgotPasswordRequest):
    # Padroniza o e-mail para evitar problemas de caixa alta/baixa
    email_cliente = dados.email.strip().lower()
    
    user = users_collection.find_one({"email": email_cliente})

    # Segurança: Mantém a mesma mensagem mesmo se o usuário não existir
    if not user:
        return {
            "msg": "Instruções enviadas com sucesso.",
            "status": "mock_mode"
        }

    # Gera o token seguro de redefinição
    token = create_reset_token(str(user["_id"]))

    # Link oficial apontando para a produção na Vercel
    reset_link = (
        f"https://vercel.app{token}"
    )

    # 📌 IMPORTANTE: O link continuará aparecendo no console da Render para você poder testar e simular!
    print(f"\n[BARBERFLOW AMBIENTE DE TESTE] Link de redefinição gerado para {email_cliente}: {reset_link}\n")

    return {
        "msg": "Instruções enviadas com sucesso.",
        "status": "mock_mode"
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