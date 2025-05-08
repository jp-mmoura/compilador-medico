from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import date

router = APIRouter()

class Consulta(BaseModel):
    id: int
    cpf_paciente: str
    data: date
    especialidade: str
    observacoes: str

consultas_db: List[Consulta] = []

@router.post("/", response_model=Consulta)
def criar_consulta(consulta: Consulta):
    consultas_db.append(consulta)
    return consulta

@router.get("/", response_model=List[Consulta])
def listar_consultas():
    return consultas_db

@router.get("/paciente/{cpf}", response_model=List[Consulta])
def listar_consultas_por_paciente(cpf: str):
    resultado = [c for c in consultas_db if c.cpf_paciente == cpf]
    if not resultado:
        raise HTTPException(status_code=404, detail="Nenhuma consulta encontrada para este paciente")
    return resultado
