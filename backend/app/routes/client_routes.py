from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from app.db.mongo_connection import db
from app.schemas.client_schema import ClientCreate
from app.utils.security import hash_password
from app.dependencies.auth import get_current_user, get_admin

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

clientes_collection = db["clientes"]
atendidos_collection = db["atendidos"]
servicos_collection = db["servicos"]
desistencias_collection = db ["desistencias"]


# 🔐 Área protegida (usuário autenticado)
@router.get("/area-protegida")
def rota_protegida(user = Depends(get_current_user)):
    return {"message": "Área protegida", "user": user}


# 🔐 Painel Admin
@router.get("/painel-admin")
def painel_admin(admin = Depends(get_admin)):
    return {"message": "Bem-vindo administrador"}


# ✅ Criar cliente
@router.post("/")
def criar_cliente(cliente: ClientCreate):

    if clientes_collection.find_one({"email": cliente.email}):
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    novo_cliente = {
        "usuario": cliente.usuario,
        "email": cliente.email,
        "senha": hash_password(cliente.senha),
        "role": "cliente",
        "status": "ativo",
        "created_at": datetime.utcnow()
    }

    result = clientes_collection.insert_one(novo_cliente)

    return {
        "message": "Cliente criado com sucesso",
        "cliente": {
            "id": str(result.inserted_id),
            "usuario": cliente.usuario,
            "email": cliente.email
        }
    }


# ✅ Listar clientes (somente admin)
@router.get("/")
def listar_clientes(admin = Depends(get_admin)):

    clientes = []

    for cliente in clientes_collection.find({}, {"senha": 0}):
        cliente["_id"] = str(cliente["_id"])
        clientes.append(cliente)

    return clientes


# 📊 Histórico e gastos do cliente
@router.get("/meu-historico")
def meu_historico(usuario_logado=Depends(get_current_user)):

    cliente_id = ObjectId(usuario_logado["id"])
    
    desistencias = list(
                desistencias_collection.find({
                    "id_cliente": cliente_id
                })
            )
            
    quantidade_cancelamentos = len(desistencias)

    atendimentos = list(
        atendidos_collection.find({
            "cliente_id": cliente_id,
            "status": "finalizado"
        }).sort("finalizado_em", -1)
    )

    total_gasto = 0
    quantidade_atendimentos = len(atendimentos)

    historico = []
    servicos_quantidade = {}

    for atendimento in atendimentos:

        preco = atendimento.get("preco", 0)
        servico_id = atendimento.get("servico_id")

        total_gasto += preco

        # Buscar nome do serviço
        servico = servicos_collection.find_one({
            "_id": servico_id
        })

        nome_servico = (
            servico["nome"]
            if servico
            else "Serviço não encontrado"
        )

        # Contar quantidade de cada serviço
        if servico_id not in servicos_quantidade:
            servicos_quantidade[servico_id] = {
                "servico_id": servico_id,
                "nome": nome_servico,
                "quantidade": 0
            }

        servicos_quantidade[servico_id]["quantidade"] += 1

        historico.append({
            "data": atendimento.get("finalizado_em"),
            "servico_id": servico_id,
            "servico": nome_servico,
            "preco": preco
        })
        
    return {
        "quantidade_atendimentos": quantidade_atendimentos,
        "total_gasto": total_gasto,
        "quantidade_cancelamentos": quantidade_cancelamentos,
        "historico": historico,
        "servicos": list(servicos_quantidade.values())
    }
                          

# ✅ Buscar cliente por ID
@router.get("/{cliente_id}")
def buscar_cliente(
    cliente_id: str,
    usuario_logado = Depends(get_current_user)
):

    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    cliente = clientes_collection.find_one({"_id": ObjectId(cliente_id)})

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # Permite ver apenas próprio perfil ou admin
    if (
        str(cliente["_id"]) != usuario_logado["id"]
        and usuario_logado["role"] != "admin"
    ):
        raise HTTPException(status_code=403, detail="Sem permissão")

    cliente["_id"] = str(cliente["_id"])
    cliente.pop("senha", None)

    return cliente
