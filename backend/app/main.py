from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

# Importação das rotas
from app.routes.client_routes import router as client_router
from app.routes.auth_routes import router as auth_router
from app.routes.agendamento_routes import router as agendamento_router
from app.routes.fila_routes import router as fila_router
 
app = FastAPI(title="Barbearia API com MongoDB") 

origins = [
    "http://localhost:3000",
    "https://sistemagerenciamentefila.vercel.app",
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

@app.get("/")
def home():
    return {"message": "API Barber está rodando com sucesso 🚀"}
