from pydantic import BaseModel
from datetime import datetime

class AgendamentoCreate(BaseModel):
    horario: datetime

class AgendamentoResponse(AgendamentoCreate):
    id: str
    status: str
    created_at: datetime

class AgendamentoUpdateStatus(BaseModel):
    status: str
