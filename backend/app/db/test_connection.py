from mongo_connection import db

def test_connection():
    colecoes = db.list_collection_names()
    print("Coleções disponíveis:", colecoes)

if __name__ == "__main__":
    test_connection()

