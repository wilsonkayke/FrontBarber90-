from pydantic import BaseModel 
from datetime import datetime
from typing import Optional

class ServicoCreate(BaseModel):
    nome: str
    preco: float

class ServicoResponse(BaseModel):
    id: int
    nome: str
    preco: float
    status: str
    created_at: datetime