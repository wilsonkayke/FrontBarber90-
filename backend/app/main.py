from fastapi import FastAPI
from app.routes.client_routes import router as client_router

app = FastAPI(title="Barbearia API com MongoDB")

# Inclui as rotas de clientes
app.include_router(client_router)

@app.get("/")
def home():
    return {"message": "API Barber está rodando com sucesso 🚀"}


