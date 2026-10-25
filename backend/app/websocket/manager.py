from fastapi import WebSocket


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

    async def conectar_barbeiro(
        self,
        barber_id: str,
        websocket: WebSocket
    ):
        if barber_id not in self.barbeiros:
            self.barbeiros[barber_id] = []

        self.barbeiros[barber_id].append(websocket)

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

        for websocket in conexoes:
            await websocket.send_json(mensagem)

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