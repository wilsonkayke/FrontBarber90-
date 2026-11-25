
import logging
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:

    def __init__(self):
        self.barbeiros = {}
        self.admins = []
        self.clientes = {}

    # ==============================
    # CONEXÃO DO BARBEIRO
    # ==============================

    async def conectar_barbeiro(
        self,
        barber_id: str,
        websocket: WebSocket
    ):
        self.barbeiros.setdefault(
            barber_id, []
        ).append(websocket)

        logger.info(
            "Barbeiro %s conectado.",
            barber_id
        )

    def desconectar_barbeiro(
        self,
        barber_id: str,
        websocket: WebSocket
    ):
        if barber_id not in self.barbeiros:
            return

        if websocket in self.barbeiros[barber_id]:
            self.barbeiros[barber_id].remove(websocket)

        if not self.barbeiros[barber_id]:
            del self.barbeiros[barber_id]

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

    # ==============================
    # CONEXÃO DO ADMINISTRADOR
    # ==============================

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
        for websocket in self.admins.copy():
            try:
                await websocket.send_json(mensagem)

            except Exception:
                logger.exception(
                    "Falha ao enviar mensagem ao administrador."
                )

                self.desconectar_admin(websocket)

    # ==============================
    # CONEXÃO DO CLIENTE
    # ==============================

    async def conectar_cliente(
        self,
        cliente_id: str,
        websocket: WebSocket
    ):
        self.clientes.setdefault(
            cliente_id, []
        ).append(websocket)

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


# Instância compartilhada
manager = ConnectionManager()
