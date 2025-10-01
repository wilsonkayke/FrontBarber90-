from mongo_connection import db

def test_connection():
    try:
        colecoes = db.list_collection_names()
        print("✅ Conexão bem-sucedida!")
        print("Coleções disponíveis:", colecoes)
    except Exception as e:
        print("❌ Erro na conexão:", e)

if __name__ == "__main__":
    test_connection()


