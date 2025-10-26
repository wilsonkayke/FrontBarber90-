@router.get("/")
def listar_clientes():
    """Lista todos os clientes cadastrados"""
    clientes = list(collection.find({}, {"_id": 0}))
    return clientes