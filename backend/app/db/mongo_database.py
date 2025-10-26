from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config

MONGO_URL = config("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)
database = client["barbearia_db"]  # nome do banco
cliente_collection = database["clientes"]  # coleção de clientes
