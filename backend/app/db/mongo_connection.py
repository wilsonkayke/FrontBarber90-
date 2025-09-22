import os
from pymongo import MongoClient
from dotenv import load_dotenv

# carregar variáveis de ambiente do .env
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("⚠️ Defina a variável MONGODB_URI no .env")

client = MongoClient(MONGODB_URI)
db = client["barberdb"]  # nome do banco
