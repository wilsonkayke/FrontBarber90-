from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.db.mongo_connection import db
from app.dependencies.auth import get_current_user, get_admin
from app.schemas.agendamento_schema import AgendamentoCreate

router = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"]
)

agendamentos_collection = db["agendamentos"]
atendidos_collection = db["atendidos"]
desistencias_collection = db["desistencias"]

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

    agora = datetime.now(timezone.utc)

    # 🔎 Validar se horário é futuro
    if dados.horario <= agora:
        raise HTTPException(
            status_code=400,
            detail="Não é possível agendar para horário passado"
        )

    # 🔎 Verificar se horário já está ocupado
    existente = agendamentos_collection.find_one({
        "horario": dados.horario,
        "status": "agendado"
    })

    if existente:
        raise HTTPException(
            status_code=400,
            detail="Horário já reservado"
        )

    # if dados.servico_id not in [1, 2, 3, 4, 5]:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Serviço inválido."
    #     )

    agendamento = {
        "cliente_id": cliente_oid,
        "horario": dados.horario,
       # "servico_id": dados.servico_id,
        "status": "agendado",
        "created_at": datetime.now(timezone.utc)
    }

    print("AGENDAMENTO A SER INSERIDO:", agendamento)

    #Aquiiiiiiiiiiiiiii

    result = agendamentos_collection.insert_one(agendamento) 

    return {
        "message": "Agendamento criado com sucesso",
        "agendamento_id": str(result.inserted_id)
    }


# =========================================================
# 📌 Buscar horários ocupados por data
# =========================================================

@router.get("/horarios")
def horarios_ocupados(data: str):

    inicio_local = datetime.strptime(data, "%Y-%m-%d")

    inicio_utc = inicio_local.replace(
        tzinfo=timezone.utc
    )

    fim_utc = inicio_utc + timedelta(days=1)

    agendamentos = list(
        agendamentos_collection.find({
            "horario": {
                "$gte": inicio_utc,
                "$lt": fim_utc
            },
            "status": "agendado"
        })
    )

    horarios = []

    for ag in agendamentos:

        print(
            "HORARIO BANCO:",
            ag["horario"],
            "TZ:",
            ag["horario"].tzinfo
        )

        horario = (
            ag["horario"]
            .astimezone(
                ZoneInfo("America/Sao_Paulo")
            )
            .strftime("%H:%M")
        )

        horarios.append(horario)

    return horarios


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

    if usuario["role"] == "admin":
        agendamentos = agendamentos_collection.find(filtro).sort("horario", 1)
    else:
        filtro["cliente_id"] = ObjectId(usuario["id"])
        agendamentos = agendamentos_collection.find(filtro).sort("horario", 1)

    lista = []

    for ag in agendamentos:
        lista.append({
            "_id": str(ag["_id"]),
            "cliente_id": str(ag["cliente_id"]),
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