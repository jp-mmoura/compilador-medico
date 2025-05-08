from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Medicamento(BaseModel):
    id: int
    nome: str
    dosagem: str
    forma: str
    fabricante: str

medicamentos_db: List[Medicamento] = []

@router.post("/", response_model=Medicamento)
def cadastrar_medicamento(med: Medicamento):
    medicamentos_db.append(med)
    return med

@router.get("/", response_model=List[Medicamento])
def listar_medicamentos():
    return medicamentos_db

@router.get("/buscar/{nome}", response_model=Medicamento)
def buscar_por_nome(nome: str):
    for m in medicamentos_db:
        if m.nome.lower() == nome.lower():
            return m
    raise HTTPException(status_code=404, detail="Medicamento não encontrado")
