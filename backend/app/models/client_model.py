from datetime import datetime
from pydantic import BaseModel, Field

class Client(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100, description="Nome completo do cliente")
    telefone: str = Field(..., min_length=8, max_length=15, description="Telefone do Cliente")
    data_cadastro: datetime = Field(default_factory=datetime.utcnow)
