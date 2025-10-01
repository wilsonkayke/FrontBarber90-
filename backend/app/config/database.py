from mongo_connection import db

# Aqui você pode centralizar funções auxiliares
def get_collection(name: str):
    """Retorna uma coleção específica do MongoDB"""
    return db[name]
 