from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any

from ....db.session import get_db
from ....models.models import Medicamento, Usuario
from ....schemas.schemas import MedicamentoCreate, MedicamentoResponse
from .auth import oauth2_scheme
from ....core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=MedicamentoResponse)
def criar_medicamento(
    *,
    db: Session = Depends(get_db),
    medicamento_in: MedicamentoCreate,
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Cria um novo medicamento.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verifica se o paciente existe
    paciente = db.query(Usuario).filter(
        Usuario.id == medicamento_in.paciente_id,
        Usuario.tipo == "paciente"
    ).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    medicamento = Medicamento(
        **medicamento_in.dict(),
        medico_id=current_user.id
    )
    db.add(medicamento)
    db.commit()
    db.refresh(medicamento)
    return medicamento

@router.get("/", response_model=List[MedicamentoResponse])
def listar_medicamentos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Lista todos os medicamentos.
    """
    if current_user.tipo == "medico":
        medicamentos = db.query(Medicamento).filter(Medicamento.medico_id == current_user.id).all()
    else:
        medicamentos = db.query(Medicamento).filter(Medicamento.paciente_id == current_user.id).all()
    return medicamentos

@router.get("/{medicamento_id}", response_model=MedicamentoResponse)
def obter_medicamento(
    medicamento_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém um medicamento específico.
    """
    medicamento = db.query(Medicamento).filter(Medicamento.id == medicamento_id).first()
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    return medicamento

@router.delete("/{medicamento_id}")
def deletar_medicamento(
    medicamento_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Deleta um medicamento específico.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    medicamento = db.query(Medicamento).filter(
        Medicamento.id == medicamento_id,
        Medicamento.medico_id == current_user.id
    ).first()
    
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    
    db.delete(medicamento)
    db.commit()
    return {"message": "Medicamento deletado com sucesso"} 