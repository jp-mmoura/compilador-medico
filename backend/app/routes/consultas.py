from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class Consulta(BaseModel):
    id: Optional[int] = Field(default=None)
    paciente_id: int
    medico_crm: str = Field(..., pattern=r'^\d{6}$')
    data_consulta: str = Field(..., pattern=r'^\d{2}/\d{2}/\d{4}$')
    cid: str = Field(..., pattern=r'^CID-[A-Z]\d{2}$')
    medicamento_id: int
    dosagem: str = Field(..., pattern=r'^\d+mg$')

# Simulando um banco de dados em memória
consultas_db: List[Consulta] = []
id_counter = 1

@router.post("/", response_model=Consulta)
def cadastrar_consulta(consulta: Consulta):
    """
    Cadastra uma nova consulta.
    
    Args:
        consulta: Dados da consulta a ser cadastrada
        
    Returns:
        Consulta: Consulta cadastrada com ID
    """
    global id_counter
    consulta.id = id_counter
    id_counter += 1
    consultas_db.append(consulta)
    return consulta

@router.get("/", response_model=List[Consulta])
def listar_consultas():
    """
    Lista todas as consultas cadastradas.
    
    Returns:
        List[Consulta]: Lista de consultas
    """
    return consultas_db

@router.get("/paciente/{paciente_id}", response_model=List[Consulta])
def buscar_por_paciente(paciente_id: int):
    """
    Busca consultas de um paciente específico.
    
    Args:
        paciente_id: ID do paciente
        
    Returns:
        List[Consulta]: Lista de consultas do paciente
    """
    consultas = [c for c in consultas_db if c.paciente_id == paciente_id]
    if not consultas:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma consulta encontrada para o paciente {paciente_id}"
        )
    return consultas
