from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter()

class Medicamento(BaseModel):
    id: Optional[int] = Field(default=None)
    nome: str = Field(..., min_length=1)
    dosagem: str = Field(..., min_length=1)
    forma: str = Field(..., min_length=1)
    fabricante: str = Field(..., min_length=1)

# Simulando um banco de dados em memória
medicamentos_db: List[Medicamento] = []
id_counter = 1

@router.post("/", response_model=Medicamento)
def cadastrar_medicamento(med: Medicamento):
    """
    Cadastra um novo medicamento.
    
    Args:
        med: Dados do medicamento a ser cadastrado
        
    Returns:
        Medicamento: Medicamento cadastrado com ID
    """
    global id_counter
    med.id = id_counter
    id_counter += 1
    medicamentos_db.append(med)
    return med

@router.get("/", response_model=List[Medicamento])
def listar_medicamentos():
    """
    Lista todos os medicamentos cadastrados.
    
    Returns:
        List[Medicamento]: Lista de medicamentos
    """
    return medicamentos_db

@router.get("/buscar/{nome}", response_model=Medicamento)
def buscar_por_nome(nome: str):
    """
    Busca um medicamento pelo nome.
    
    Args:
        nome: Nome do medicamento a ser buscado
        
    Returns:
        Medicamento: Medicamento encontrado
        
    Raises:
        HTTPException: Se o medicamento não for encontrado
    """
    medicamento = next(
        (m for m in medicamentos_db if m.nome.lower() == nome.lower()),
        None
    )
    if not medicamento:
        raise HTTPException(
            status_code=404,
            detail=f"Medicamento '{nome}' não encontrado"
        )
    return medicamento
