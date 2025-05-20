from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.models.base import Base, engine
from app.models.base import SessionLocal
from app.services.seed import seed_database

app = FastAPI(title="Compilador Médico API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API
app.include_router(api_router, prefix="/api/v1")

def init_db():
    print("Criando banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")
    
    print("Iniciando população do banco de dados...")
    db = SessionLocal()
    try:
        seed_database(db)
        print("Banco de dados populado com sucesso!")
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 