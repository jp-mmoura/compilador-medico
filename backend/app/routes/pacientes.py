from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Paciente(BaseModel):
    id: int
    nome: str
    cpf: str
    idade: int
    genero: str

pacientes_db: List[Paciente] = []

@router.post("/", response_model=Paciente)
def criar_paciente(paciente: Paciente):
    for p in pacientes_db:
        if p.cpf == paciente.cpf:
            raise HTTPException(status_code=400, detail="CPF já cadastrado")
    pacientes_db.append(paciente)
    return paciente

@router.get("/", response_model=List[Paciente])
def listar_pacientes():
    return pacientes_db


@router.get("/{cpf}", response_model=Paciente)
def buscar_paciente(cpf: str):
    for paciente in pacientes_db:
        if paciente.cpf == cpf:
            return paciente
    raise HTTPException(status_code=404, detail="Paciente não encontrado")
