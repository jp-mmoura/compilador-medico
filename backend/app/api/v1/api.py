from fastapi import APIRouter
from .endpoints import auth, pacientes, medicamentos, consultas, gastos, estatisticas

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(pacientes.router, prefix="/pacientes", tags=["pacientes"])
api_router.include_router(medicamentos.router, prefix="/medicamentos", tags=["medicamentos"])
api_router.include_router(consultas.router, prefix="/consultas", tags=["consultas"])
api_router.include_router(gastos.router, prefix="/gastos", tags=["gastos"])
api_router.include_router(estatisticas.router, prefix="/estatisticas", tags=["estatisticas"]) 