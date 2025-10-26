from pydantic import BaseModel, Field
from typing import Optional

class ClientBase(BaseModel):
    nome: str = Field(..., example="João Silva")
    telefone: Optional[str] = Field(None, example="(75) 99999-1234")
    email: Optional[str] = Field(None, example="joao@email.com")
    status: Optional[str] = Field("ativo", example="ativo")

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: str = Field(..., alias="_id")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
