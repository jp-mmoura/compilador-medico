from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class Paciente(BaseModel):
    id: Optional[int] = Field(default=None)
    nome: str = Field(..., min_length=1)
    cpf: str = Field(..., pattern=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$')
    data_nascimento: str = Field(..., pattern=r'^\d{2}/\d{2}/\d{4}$')

# Simulando um banco de dados em memória
pacientes_db: List[Paciente] = []
id_counter = 1

@router.post("/", response_model=Paciente)
def cadastrar_paciente(paciente: Paciente):
    """
    Cadastra um novo paciente.
    
    Args:
        paciente: Dados do paciente a ser cadastrado
        
    Returns:
        Paciente: Paciente cadastrado com ID
    """
    global id_counter
    paciente.id = id_counter
    id_counter += 1
    pacientes_db.append(paciente)
    return paciente

@router.get("/", response_model=List[Paciente])
def listar_pacientes():
    """
    Lista todos os pacientes cadastrados.
    
    Returns:
        List[Paciente]: Lista de pacientes
    """
    return pacientes_db

@router.get("/buscar/{cpf}", response_model=Paciente)
def buscar_por_cpf(cpf: str):
    """
    Busca um paciente pelo CPF.
    
    Args:
        cpf: CPF do paciente a ser buscado
        
    Returns:
        Paciente: Paciente encontrado
        
    Raises:
        HTTPException: Se o paciente não for encontrado
    """
    paciente = next(
        (p for p in pacientes_db if p.cpf == cpf),
        None
    )
    if not paciente:
        raise HTTPException(
            status_code=404,
            detail=f"Paciente com CPF '{cpf}' não encontrado"
        )
    return paciente
