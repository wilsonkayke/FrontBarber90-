from pydantic import BaseModel, Field
from typing import Optional

class FilaResponse(BaseModel):
    posicao: int
    pessoas_a_frente: int
    total_na_fila: int

