
import json

from bson import ObjectId
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager
from app.dependencies.auth import verify_token
from app.db.mongo_connection import db


router = APIRouter(tags=["WebSocket"])

barbeiros_collection = db["barbeiros"]


async def autenticar_websocket(websocket: WebSocket):
    """
    Aceita a conexão e espera uma mensagem inicial:
    {"token": "JWT_DO_USUARIO"}
    """
    await websocket.accept()

    try:
        mensagem = await websocket.receive_json()
    except (WebSocketDisconnect, json.JSONDecodeError, ValueError):
        await websocket.close(code=1008, reason="Autenticacao necessaria")
        return None

    if not isinstance(mensagem, dict):
        await websocket.close(code=1008, reason="Mensagem invalida")
        return None

    token = mensagem.get("token")

    if not isinstance(token, str) or not token:
        await websocket.close(code=1008, reason="Token nao fornecido")
        return None

    payload = verify_token(token)

    if not isinstance(payload, dict):
        await websocket.close(code=1008, reason="Token invalido ou expirado")
        return None

    user_id = payload.get("id")
    role = str(payload.get("role", "")).strip().lower()

    if not user_id:
        await websocket.close(code=1008, reason="Token sem ID de usuario")
        return None

    try:
        ObjectId(user_id)
    except Exception:
        await websocket.close(code=1008, reason="ID de usuario invalido")
        return None

    return {
        "id": user_id,
        "role": role
    }


# =========================================================
# WEBSOCKET — BARBEIRO
# =========================================================

@router.websocket("/ws/barbeiro")
async def websocket_barbeiro(websocket: WebSocket):
    barber_id = None
    autenticado = False

    try:
        usuario = await autenticar_websocket(websocket)

        if not usuario:
            return

        if usuario["role"] != "barbeiro":
            await websocket.close(code=1008, reason="Acesso permitido apenas para barbeiros")
            return

        perfil = barbeiros_collection.find_one({
            "usuario_id": ObjectId(usuario["id"]),
            "ativo": True
        })

        if not perfil:
            await websocket.close(code=1008, reason="Cadastro de barbeiro nao encontrado")
            return

        barber_id = str(perfil["_id"])

        await manager.conectar_barbeiro(barber_id, websocket)
        autenticado = True

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass
    finally:
        if autenticado and barber_id:
            manager.desconectar_barbeiro(barber_id, websocket)
            
            
            
@router.post("/ws/teste-admin")
async def testar_websocket_admin():
    await manager.enviar_para_admins({
        "tipo": "teste",
        "mensagem": "WebSocket do administrador funcionando!"
    })

    return {"message": "Evento de teste enviado"}           



# =========================================================
# WEBSOCKET — ADMIN
# ========================================================= 
@router.websocket("/ws/admin")
async def websocket_admin(websocket: WebSocket):
    autenticado = False

    try:
        usuario = await autenticar_websocket(websocket)

        if not usuario:
            return

        if usuario["role"] != "admin":
            await websocket.close(
                code=1008,
                reason="Acesso permitido apenas para administradores"
            )
            return

        await manager.conectar_admin(websocket)
        autenticado = True

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass

    finally:
        if autenticado:
            manager.desconectar_admin(websocket)    

# =========================================================
# WEBSOCKET — CLIENTE / FILA
# =========================================================

@router.websocket("/ws/fila")
async def websocket_fila(websocket: WebSocket):
    cliente_id = None
    autenticado = False

    try:
        usuario = await autenticar_websocket(websocket)

        if not usuario:
            return

        if usuario["role"] != "cliente":
            await websocket.close(code=1008, reason="Acesso permitido apenas para clientes")
            return

        cliente_id = usuario["id"]

        await manager.conectar_cliente(cliente_id, websocket)
        autenticado = True

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass
    finally:
        if autenticado and cliente_id:
            manager.desconectar_cliente(cliente_id, websocket)
