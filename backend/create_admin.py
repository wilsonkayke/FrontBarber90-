from passlib.context import CryptContext
from app.config.database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

usuarios = db["clientes"]  # ou "usuarios" se você usa essa coleção

def criar_admin():

    email = "admin@barber.com"
    senha = "admin123"

    # Verifica se já existe
    if usuarios.find_one({"email": email}):
        print("Admin já existe")
        return

    senha_hash = pwd_context.hash(senha)

    admin = {
        "usuario": "Administrador",
        "email": email,
        "senha": senha_hash,
        "role": "admin",
        "status": "ativo"
    }

    usuarios.insert_one(admin)

    print("Admin criado com sucesso!")

if __name__ == "__main__":
    criar_admin()