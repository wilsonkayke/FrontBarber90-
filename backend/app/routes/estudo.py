from fastapi import HTTPException
from app.db.mongo_connection import db


agendamentos_collection = db["agendamentos"]

#Aqui vamos verificar se tem hr agendado 

horario_agendado = collection.find_one({
    "horario": dados.horario,
#   "data": dados.data, (usuriamos assim caso o banco esteja salvando data y hora mas nesse caso estamos salvando hora e data juntos, então não precisamos da data)
    "status": "agendado"
})

#codição de que se o horário agendado for encontrado, ele vai retornar um erro 409 dizendo que existe um horário agendado.
if horario_agendado:
    raise HTTPException(
        status_code=409, 
        detail="Existe um horário agendado"
    )

#Verificamos se o usuário já possui um horário agendado
verificar_users = collection_agendamento.find_one({
    "usuario_id": dados.usuario_id,
    "status": "agendado"
})

#Se o usuário já tiver um horário agendado, ele vai retornar um erro 409 dizendo que o usuário já possui um horário agendado.
if verificar_users:
    raise HTTPException(status_code=409, detail="Este usuário já possui um horário agendado")

# 1 y 2 concluid

#============================

#============================

#Verificando se a hora está bloq ou free
horario_agendamento = {
    "usuario_id": dados.usuario_id,
    "horario": dados.horario, #dados.horario está puxando data também
    "status": "agendado",
    }

if horario_agendamento["status"] == "agendado":
    raise HTTPException(status_code=409, detail="Este horário já está agendado")


criar_agendamento = collection_agendamento.insert_one(horario_agendamento)


#======================================================
# Bloquear horário duplicado
#======================================================

#Verificando se o horário já está agendado para outro usuário
agenda_duplicada = collection_agendamento.find_one({
    "horario": dados.horario,
    "status": "agendado"
    
})

#Condição 
if agenda_duplicada:
    raise HTTPException(
        status_code=409,
        detail="Horário já reservado"
    )
    

#==============================================
# Tratamento de error com mongodb
#==============================================

try: 
    collection_agendamento.insert_one(agendamento)
    
except DuplicateKeyError:
    raise HTTPException(
        status_code = 409,
        detail="Horário já reservado"
    )
    
#===============================================
# 
#===============================================

#===============================================
#Digamos que nós já criamos a coleção das chaves para salvar no banco
#===============================================

chave_front = idempotencia_collection.find_one({
    "idempotencia_kay": dados.idempotency_key
})

if chave_front:
    return {
        "status": "agendado",
        "msg": "Requisição processada anteriomente",
        "agendamento_id" str(chave_front["agendamento_id"])
    }

horario_reservado = agendamentos_collection.find_one({
    "horario": dados.horario,
    "status": "agendado"
})

if horario_reservado:
    raise HTTPException(
        status_code=409,
        detail="Horário já reservado"
    )
    
verificar_usuario = agendamentos_collection.find_one({
    "_id": dados.usuario_id,
    "status": "agendado"
})

if verificar_usuario:
    raise HTTPException(
        status_code=409,
        detail="Você já tem um agendamento"
    )
    
    

     