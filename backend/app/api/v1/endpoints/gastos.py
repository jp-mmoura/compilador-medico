from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from ....db.session import get_db
from ....models.models import Gasto, Usuario
from ....schemas.schemas import GastoCreate, GastoResponse
from .auth import oauth2_scheme
from ....core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=GastoResponse)
def criar_gasto(
    *,
    db: Session = Depends(get_db),
    gasto_in: GastoCreate,
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Cria um novo gasto.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verifica se o paciente existe
    paciente = db.query(Usuario).filter(
        Usuario.id == gasto_in.paciente_id,
        Usuario.tipo == "paciente"
    ).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    gasto = Gasto(
        **gasto_in.dict(),
        medico_id=current_user.id,
        data=datetime.now()
    )
    db.add(gasto)
    db.commit()
    db.refresh(gasto)
    return gasto

@router.get("/", response_model=List[GastoResponse])
def listar_gastos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Lista todos os gastos.
    """
    if current_user.tipo == "medico":
        gastos = db.query(Gasto).filter(Gasto.medico_id == current_user.id).all()
    else:
        gastos = db.query(Gasto).filter(Gasto.paciente_id == current_user.id).all()
    return gastos

@router.get("/paciente/{paciente_id}", response_model=List[GastoResponse])
def listar_gastos_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Lista todos os gastos de um paciente específico.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    gastos = db.query(Gasto).filter(
        Gasto.paciente_id == paciente_id,
        Gasto.medico_id == current_user.id
    ).all()
    return gastos 