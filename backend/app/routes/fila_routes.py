from fastapi import APIRouter, HTTPException, Depends, Request
from app.db.mongo_connection import db
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth import get_current_user, get_admin
from datetime import datetime, timezone

router = APIRouter(
    prefix="/fila",
    tags=["Fila"]
)

agendamentos_collection = db["agendamentos"]
desistencias_collection = db["desistencias"]

@router.get("/{cliente_id}")
def obter_posicao_fila(cliente_id: str):

    if not ObjectId.is_valid(cliente_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    cliente_object_id = ObjectId(cliente_id)

    fila = list(
        agendamentos_collection
        .find({"status": "aguardando"})
        .sort("entrada_em", 1)
    )

    for index, item in enumerate(fila):
        if item["cliente_id"] == cliente_object_id:
            return {
                "posicao": index + 1,
                "pessoas_a_frente": index,
                "total_na_fila": len(fila)
            }

    raise HTTPException(status_code=404, detail="Cliente não está na fila")

@router.delete("/agendamentos/sair")
def sair_fila(usuario=Depends(get_current_user)):

    cliente_id = ObjectId(usuario["id"])
    horario_atual_utc = datetime.now(timezone.utc)

    # Busca o agendamento ativo
    agendamento = agendamentos_collection.find_one({
        "cliente_id": cliente_id,
        "status": "agendado"
    })

    if not agendamento:
        raise HTTPException(
            status_code=404,
            detail="Nenhum agendamento ativo encontrado."
        )

    # Calcula o tempo de espera usando entrada_em
    entrada_em = agendamento.get("entrada_em")

    if entrada_em:
        tempo_espera = int(
            (
                horario_atual_utc -
                entrada_em.astimezone(timezone.utc)
            ).total_seconds() / 60
        )
    else:
        tempo_espera = 0

    # Atualiza o status para cancelado
    result_update = agendamentos_collection.update_one(
        {"_id": agendamento["_id"]},
        {
            "$set": {
                "status": "cancelado",
                "cancelado_em": horario_atual_utc
            }
        }
    )

    if result_update.modified_count > 0:

        documento_desistencia = {
            "id_agendamento": agendamento["_id"],
            "id_cliente": cliente_id,

            # Dados úteis para relatórios
            "email": usuario.get("email"),
            "role": usuario.get("role"),

            # Datas
            "data_agendamento": agendamento.get("horario"),
            "data_entrada_fila": entrada_em,
            "data_desistencia": horario_atual_utc,

            # Métricas
            "tempo_espera_minutos": max(0, tempo_espera),

            # Controle
            "status_anterior": "agendado",
            "motivo": "cliente_desistiu_via_app"
        }

        print("=== Documento de desistências ===")
        print(documento_desistencia)

        try:
            resultado = desistencias_collection.insert_one(
                documento_desistencia
            )
            print("Salvo com ID:", resultado.inserted_id)
        except Exception as e:
            print("Erro ao salvar desistência:", e)

    return {
        "msg": "Você saiu da fila de espera com sucesso."
    }
    

# =========================================================
# 📌 Fila do usuário (posição real)
#           Rota fila
# =========================================================
@router.get("/")
async def minha_fila( usuario=Depends(get_current_user)):
    
    print("USUARIO LOGADO:", usuario["id"])


    agora = datetime.utcnow()

    agendamentos = list(
        agendamentos_collection.find({
            "status": "agendado",
            "horario": {"$gte": agora}
        }).sort("horario", 1)
    )

    total = len(agendamentos)
    posicao = None

    for index, ag in enumerate(agendamentos):
        if ag["cliente_id"] == ObjectId(usuario["id"]):
            posicao = index + 1
            break

    if posicao is None:
        return {
            "posicao": None,
            "pessoas_a_frente": 0,
            "total_na_fila": total
        }

    return {
    "usuario_logado": usuario["id"],
    "posicao": posicao,
    "pessoas_a_frente": posicao - 1 if posicao else 0,
    "total_na_fila": total
    }
