from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:

    def __init__(self):
        # Conexões dos barbeiros
        # barber_id -> lista de WebSockets
        self.barbeiros = {}

        # Conexões dos administradores
        self.admins = []

        # Conexões dos clientes
        # cliente_id -> lista de WebSockets
        self.clientes = {}

    # =========================================================
    # BARBEIROS
    # =========================================================

    
    async def enviar_para_barbeiro(
        self,
        barber_id: str,
        mensagem: dict
    ):
        conexoes = self.barbeiros.get(barber_id, [])

        for websocket in conexoes.copy():
            try:
                await websocket.send_json(mensagem)
            except Exception:
                logger.exception(
                    "Falha ao enviar mensagem ao barbeiro %s",
                    barber_id
                )
                self.desconectar_barbeiro(
                    barber_id,
                    websocket
                )

    async def enviar_para_admins(
        self,
        mensagem: dict
    ):
        for websocket in self.admins.copy():
            try:
                await websocket.send_json(mensagem)
            except Exception:
                logger.exception(
                    "Falha ao enviar mensagem ao administrador"
                )
                self.desconectar_admin(websocket)

    async def enviar_para_cliente(
        self,
        cliente_id: str,
        mensagem: dict
    ):
        conexoes = self.clientes.get(cliente_id, [])

        for websocket in conexoes.copy():
            try:
                await websocket.send_json(mensagem)
            except Exception:
                logger.exception(
                    "Falha ao enviar mensagem ao cliente %s",
                    cliente_id
                )
                self.desconectar_cliente(
                    cliente_id,
                    websocket
                )


    # =========================================================
    # ADMIN
    # =========================================================

    async def conectar_admin(
        self,
        websocket: WebSocket
    ):
        self.admins.append(websocket)

    def desconectar_admin(
        self,
        websocket: WebSocket
    ):
        if websocket in self.admins:
            self.admins.remove(websocket)

    async def enviar_para_admins(
        self,
        mensagem: dict
    ):
        for websocket in self.admins:
            await websocket.send_json(mensagem)

    # =========================================================
    # CLIENTES / FILA
    # =========================================================

    async def conectar_cliente(
        self,
        cliente_id: str,
        websocket: WebSocket
    ):
        if cliente_id not in self.clientes:
            self.clientes[cliente_id] = []

        self.clientes[cliente_id].append(websocket)

    def desconectar_cliente(
        self,
        cliente_id: str,
        websocket: WebSocket
    ):
        if cliente_id not in self.clientes:
            return

        if websocket in self.clientes[cliente_id]:
            self.clientes[cliente_id].remove(websocket)

        if not self.clientes[cliente_id]:
            del self.clientes[cliente_id]

    async def enviar_para_cliente(
        self,
        cliente_id: str,
        mensagem: dict
    ):
        conexoes = self.clientes.get(cliente_id, [])

        for websocket in conexoes:
            await websocket.send_json(mensagem)


manager = ConnectionManager()