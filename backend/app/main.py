from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database

# Criar tabelas
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Dependency para DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Criar cliente
@app.post("/clientes/", response_model=schemas.ClienteResponse)
def criar_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    novo = models.Cliente(nome=cliente.nome, status=cliente.status)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

# Listar clientes
@app.get("/clientes/", response_model=list[schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()

