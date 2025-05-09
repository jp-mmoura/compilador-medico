from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.medicamentos import router as medicamentos_router
from app.routes.pacientes import router as pacientes_router
from app.routes.consultas import router as consultas_router
from app.routes.process import router as process_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(medicamentos_router, prefix="/medicamentos", tags=["medicamentos"])
app.include_router(pacientes_router, prefix="/pacientes", tags=["pacientes"])
app.include_router(consultas_router, prefix="/consultas", tags=["consultas"])
app.include_router(process_router, tags=["process"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 