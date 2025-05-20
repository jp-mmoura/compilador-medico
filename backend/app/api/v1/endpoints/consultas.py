from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from ....db.session import get_db
from ....models.models import Consulta, Usuario
from ....schemas.schemas import ConsultaCreate, ConsultaResponse
from .auth import oauth2_scheme
from ....core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=ConsultaResponse)
def criar_consulta(
    *,
    db: Session = Depends(get_db),
    consulta_in: ConsultaCreate,
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Cria uma nova consulta.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verifica se o paciente existe
    paciente = db.query(Usuario).filter(
        Usuario.id == consulta_in.paciente_id,
        Usuario.tipo == "paciente"
    ).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    consulta = Consulta(
        **consulta_in.dict(),
        medico_id=current_user.id,
        data=datetime.now()
    )
    db.add(consulta)
    db.commit()
    db.refresh(consulta)
    return consulta

@router.get("/", response_model=List[ConsultaResponse])
def listar_consultas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Lista todas as consultas.
    """
    if current_user.tipo == "medico":
        consultas = db.query(Consulta).filter(Consulta.medico_id == current_user.id).all()
    else:
        consultas = db.query(Consulta).filter(Consulta.paciente_id == current_user.id).all()
    return consultas

@router.get("/{consulta_id}", response_model=ConsultaResponse)
def obter_consulta(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém uma consulta específica.
    """
    consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")
    
    if current_user.tipo == "medico" and consulta.medico_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    elif current_user.tipo == "paciente" and consulta.paciente_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    return consulta 