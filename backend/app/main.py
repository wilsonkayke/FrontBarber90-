from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.client_routes import router as client_router
from app.routes.auth_routes import router as auth_router
from app.routes.agendamento_routes import router as agendamento_router

app = FastAPI(title="Barbearia API com MongoDB")

# ✅ CORS antes das rotas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # depois você pode restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_router)
app.include_router(auth_router)
app.include_router(agendamento_router)

@app.get("/")
def home():
    return {"message": "API Barber está rodando com sucesso 🚀"}
