from pydantic import BaseModel

class ClienteBase(BaseModel):
    nome: str

class ClienteCreate(ClienteBase):
    status: str = "espera"

class ClienteResponse(ClienteBase):
    id: int
    status: str

    class Config:
        from_atrributes = True
