from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError 
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin, get_barbeiro
from app.schemas.agendamento_schema import AgendamentoCreate

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"]
)

agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]
desistencias_collection = db["desistencias"]
servicos_collection = db["servicos"]
clientes_collection = db["clientes"]
barbeiros_collection = db["barbeiros"]

# =========================================================
# 📌 Criar agendamento (cliente autenticado)
# =========================================================
@router.post("/")
def criar_agendamento(
    dados: AgendamentoCreate,
    usuario=Depends(get_current_user)
):
    
    dados.horario = dados.horario.astimezone(timezone.utc)

    # 🔒 Cliente é sempre o do token
    cliente_oid = ObjectId(usuario["id"])
    
    try:
        barber_oid = ObjectId(dados.barber_id)
    except Exception:
        raise HTTPException(
        status_code=400,
        detail="ID do barbeiro inválido"
    )
        
    barbeiro = barbeiros_collection.find_one({
        "_id": barber_oid, 
        "ativo": True
    })
    
    if not barbeiro:
        raise HTTPException(
            status_code=400,
            detail="Barbeiro não encontrado ou inativo"
        )
    

    agora = datetime.now(timezone.utc)

    # 🔎 Validar se horário é futuro
    if dados.horario <= agora:
        raise HTTPException(
            status_code=400,
            detail="Não é possível agendar para horário passado"
        )

    # 🔎 Verificar se horário já está ocupado
    existente = agendamentos_collection.find_one({
        "barber_id": barber_oid,
        "horario": dados.horario,
        "status": "agendado"
    })

    if existente:
        raise HTTPException(
            status_code=409,
            detail="Horário já reservado"
        )

    servico = servicos_collection.find_one({
    "_id": dados.servico_id,
    "status": "ativo"
    })

    if not servico:
        raise HTTPException(
            status_code=400,
            detail="Serviço inválido ou indisponível."
        )

    agendamento = {
        "cliente_id": cliente_oid,
        "barber_id": barber_oid,
        "horario": dados.horario,
        "servico_id": dados.servico_id,
        "preco": servico["preco"],
        "status": "agendado",
        "created_at": datetime.now(timezone.utc)
    }

    print("AGENDAMENTO A SER INSERIDO:", agendamento)

    #Aquiiiiiiiiiiiiiii

    try: 
        result = agendamentos_collection.insert_one(agendamento) 
        
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Horário já reservado"
        )

    return {
        "message": "Agendamento criado com sucesso",
        "agendamento_id": str(result.inserted_id)
    }
   
   
# =========================================================
# 📌 Buscar horários ocupados por data
# =========================================================

@router.get("/horarios")
def horarios_ocupados(
    data: str,
    barber_id: str
    ):
    
    try:
        barber_oid = ObjectId(barber_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID do barbeiro inválido"
        )
        
    barbeiros = barbeiros_collection.find_one({
        "_id": barber_oid,
        "ativo": True  
    })

    if not barbeiros:
        raise HTTPException(
            status_code=404,
            detail="Barbeiro não encontrado ou inativo"
        )

    try:
        data_inicio = datetime.strptime(
            data,
            "%Y-%m-%d"
        ).replace(
            tzinfo=ZoneInfo("America/Sao_Paulo")
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Data inválida. Use o formato YYYY-MM-DD"
        )

    data_fim = data_inicio + timedelta(days=1)

    # Converter para UTC para consultar o MongoDB
    data_inicio_utc = data_inicio.astimezone(timezone.utc)
    data_fim_utc = data_fim.astimezone(timezone.utc)

    # Buscar somente os horários ocupados daquele barbeiro
    agendamentos = agendamentos_collection.find({
        "barber_id": barber_oid,
        "horario": {
            "$gte": data_inicio_utc,
            "$lt": data_fim_utc
        },
        "status": "agendado"
    })  
    
    horarios = [
        agendamento["horario"].astimezone(
            ZoneInfo("America/Sao_Paulo")
        ).strftime("%H:%M")
        for agendamento in agendamentos
    ]

    return horarios


# =========================================================
# Dados do agendamento do cliente
# ========================================================= 
@router.get("/meu-agendamento")
def meu_agendamento(usuario_logado=Depends(get_current_user)):

    cliente_id = ObjectId(usuario_logado["id"])

    agendamento = agendamentos_collection.find_one(
        {
            "cliente_id": cliente_id,
            "status": {
                "$in": ["agendado", "na_fila", "aguardando"]
            }
        },
        sort=[("horario", -1)]
    )

    if not agendamento:
        return {
            "agendamento": None
        }

    cliente = clientes_collection.find_one({
        "_id": agendamento["cliente_id"]
    })

    servico = servicos_collection.find_one({
        "_id": agendamento.get("servico_id")
    })

    return {
        "agendamento": {
            "id": str(agendamento["_id"]),
            "nome_cliente": cliente["usuario"] if cliente else "Cliente não encontrado",
            "servico": servico["nome"] if servico else "Serviço não encontrado",
            "horario": agendamento.get("horario"),
            "preco": agendamento.get("preco", 0),
            "status": agendamento.get("status")
        }
    }


# =========================================================
# 📌 Listar agendamentos
# Admin vê todos
# Cliente vê apenas os seus
# =========================================================
@router.get("/")
def listar_agendamentos(usuario=Depends(get_current_user)):

    filtro = {
        "horario": {"$exists": True},
        "status": "agendado"
    }

    role = usuario.get("role", "").strip().lower()

    # Administrador visualiza todos os agendamentos
    if role == "admin":
        pass

    # Barbeiro visualiza somente seus agendamentos
    elif role == "barbeiro":
        perfil_barbeiro = barbeiros_collection.find_one({
            "usuario_id": ObjectId(usuario["id"]),
            "ativo": True
        })

        if not perfil_barbeiro:
            raise HTTPException(
                status_code=404,
                detail="Perfil de barbeiro não encontrado ou inativo"
            )

        filtro["barber_id"] = perfil_barbeiro["_id"]

    # Cliente visualiza somente seus próprios agendamentos
    else:
        filtro["cliente_id"] = ObjectId(usuario["id"])

    agendamentos = agendamentos_collection.find(
        filtro
    ).sort("horario", 1)

    lista = []

    for ag in agendamentos:
        lista.append({
            "_id": str(ag["_id"]),
            "cliente_id": str(ag["cliente_id"]),
            "barber_id": str(ag["barber_id"]),
            "horario": ag["horario"],
            "status": ag["status"],
            "created_at": ag["created_at"]
        })

    return lista    
    
# =========================================================
# 📌 Aqui eu estou checamos se o usuário se atrasou ou não
# =========================================================
@router.get("/{agendamento_id}/status")
def checar_status_fila(agendamento_id: str):
    try:
        oid = ObjectId(agendamento_id)
    except:
        raise HTTPException(status_code=400, detail="ID inválido")

    agendamento = agendamentos_collection.find_one({"_id": oid})
    if not agendamento:
        raise HTTPException(status_code=404, detail="Não encontrado")

    status_atual = agendamento.get("status")
    minutos_passados = None

    # Se o barbeiro já chamou, o Python calcula a diferença real usando UTC puro
    if status_atual == "em_atendimento" and agendamento.get("atendido_em"):
        atendido_em = agendamento["atendido_em"]
        
        # Garante que ambos os objetos datetime usem a mesma referência UTC para o cálculo
        if atendido_em.tzinfo is None:
            atendido_em = atendido_em.replace(tzinfo=timezone.utc)
            
        agora_utc = datetime.now(timezone.utc)
        
        # Calcula a diferença exata em minutos absolutos
        diferenca = agora_utc - atendido_em
        minutos_passados = int(diferenca.total_seconds() / 60)

    return {
        "status": status_atual,
        "minutos_passados": minutos_passados
    }