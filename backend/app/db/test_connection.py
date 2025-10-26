from mongo_connection import db

def test_connection():
    try:
        # Tenta listar coleções
        colecoes = db.list_collection_names()
        print("✅ Conexão bem-sucedida!")
        print("Coleções disponíveis:", colecoes)

        # Tenta inserir um documento simples
        test_collection = db["teste_conexao"]
        resultado = test_collection.insert_one({"status": "ok"})
        print("Documento inserido com ID:", resultado.inserted_id)

        # Tenta ler o documento
        doc = test_collection.find_one({"_id": resultado.inserted_id})
        print("Documento encontrado:", doc)

        # Limpar depois do teste
        test_collection.delete_one({"_id": resultado.inserted_id})
        print("🧹 Teste finalizado e limpo.")

    except Exception as e:
        print("❌ Erro na conexão:", e)

if __name__ == "__main__":
    test_connection()



