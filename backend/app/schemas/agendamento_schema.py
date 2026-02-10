from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class AgendamentoCreate(BaseModel):
    cliente_id: str = Field(..., example="ObjectId do cliente")
    data: str = Field(..., example="2026-01-20")
    hora: str = Field(..., example="14:30")

class AgendamentoResponse(AgendamentoCreate):
    id: str
    status: str
