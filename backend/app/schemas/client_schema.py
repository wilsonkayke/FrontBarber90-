from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional

class ClientBase(BaseModel):
    usuario: str
    email: EmailStr

class ClientCreate(ClientBase):
    senha: str
    confirmar_senha: str

    @validator("confirmar_senha")
    def senhas_iguais(cls, v, values):
        if "senha" in values and v != values["senha"]:
            raise ValueError("As senhas não coincidem")
        return v

class ClientLogin(BaseModel):
    email: EmailStr
    senha: str

class ClientResponse(BaseModel):
    id: str
    usuario: str
    email: EmailStr
    created_at: datetime

class GoogleLoginRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):  
    token: str
    nova_senha: str
    confirmar_nova_senha: str

    @validator("confirmar_nova_senha")
    def senhas_iguais(cls, v, values):
        if "nova_senha" in values and v != values["nova_senha"]:
            raise ValueError("As senhas não coincidem")
        return v
