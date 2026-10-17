from pydantic import BaseModel, EmailStr, validator


class BarbeiroCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    confirmar_senha: str
    
    @validator("nome")
    def validar_nome(cls, v):
        nome = v.strip()
        
        if len(nome) < 2:
            raise ValueError("O nome deve ter pelo menos 2 caracteres.")
        
        return nome
    @validator("confirmar_senha")
    def senhas_iguais(cls, v, values):
        if "senha" in values and v != values["senha"]:
            raise ValueError("As senha não coincidem.")
        return v
        