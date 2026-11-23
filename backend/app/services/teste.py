from bson import ObjectId
from app.services.expiracao_agendamentos import expirar_agendamento

resultado = expirar_agendamento(
    ObjectId("6afa5a9088034b3d72643839")
)
    
print(resultado)