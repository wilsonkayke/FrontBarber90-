import asyncio
import logging


from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importação das rotas
from app.routes.client_routes import router as client_router
from app.routes.auth_routes import router as auth_router
from app.routes.agendamento_routes import router as agendamento_router
from app.routes.fila_routes import router as fila_router
from app.routes.admin_routes import router as admin_router
from app.routes.servico_routes import router as servico_router
from app.routes.barbeiro_routes import router as barbeiro_router
from app.routes.websocket import router as websocket_router
from app.websocket.manager import manager

# Serviço de expiração
from app.services.expiracao_agendamentos import (
    processar_agendamentos_expirados
)

logger = logging.getLogger(__name__)



async def verificar_agendamentos_expirados():
    """
    Verifica os agendamentos expirados a cada 30 segundos
    e notifica os usuários conectados via WebSocket.
    """

    while True:
        try:
            eventos = await asyncio.to_thread(
                processar_agendamentos_expirados
            )

            for evento in eventos:

                cliente_id = evento["cliente_id"]
                barber_id = evento["barber_id"]

                notificacoes = [
                    (
                        "cliente",
                        manager.enviar_para_cliente(
                            cliente_id,
                            evento
                        )
                    ),
                    (
                        "barbeiro",
                        manager.enviar_para_barbeiro(
                            barber_id,
                            evento
                        )
                    ),
                    (
                        "administradores",
                        manager.enviar_para_admins(
                            evento
                        )
                    )
                ]

                for destinatario, notificacao in notificacoes:
                    try:
                        await notificacao
                    except Exception:
                        logger.exception(
                            "Falha ao notificar %s sobre prazo_expirado",
                            destinatario
                        )

                logger.info(
                    "Agendamento %s expirado e notificações processadas.",
                    evento["agendamento_id"]
                )

        except asyncio.CancelledError:
            raise

        except Exception:
            logger.exception(
                "Erro ao verificar agendamentos expirados."
            )

        await asyncio.sleep(30)


@asynccontextmanager
async def lifespan(app: FastAPI):

    tarefa_expiracao = asyncio.create_task(
        verificar_agendamentos_expirados()
    )

    logger.info("Verificação de expiração iniciada.")

    try:
        yield

    finally:
        tarefa_expiracao.cancel()

        try:
            await tarefa_expiracao
        except asyncio.CancelledError:
            pass

        logger.info("Verificação de expiração encerrada.")


app = FastAPI(
    title="Barbearia API com MongoDB",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "https://sistemagerenciamentofila.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_router)
app.include_router(auth_router)
app.include_router(agendamento_router)
app.include_router(fila_router)
app.include_router(admin_router)
app.include_router(servico_router)
app.include_router(barbeiro_router)
app.include_router(websocket_router)


@app.get("/")
def home():
    return {
        "message": "API Barber está rodando com sucesso 🚀"
    }
