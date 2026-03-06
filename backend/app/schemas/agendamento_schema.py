from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class StatusAgendamento(str, Enum):
    agendado = "agendado"
    em_atendimento = "em_atendimento"
    finalizado = "finalizado"

class AgendamentoCreate(BaseModel):
    horario: datetime

class AgendamentoResponse(AgendamentoCreate):
    id: str
    cliente_id: str
    status: StatusAgendamento
    created_at: datetime
    atendimento_em: Optional[datetime] = None

    class Config:
        populate_by_name = True

class AgendamentoUpdateStatus(BaseModel):
    status: StatusAgendamento 
