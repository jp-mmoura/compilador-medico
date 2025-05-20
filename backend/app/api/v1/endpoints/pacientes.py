from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any

from ....db.session import get_db
from ....models.models import Usuario
from ....schemas.schemas import UsuarioResponse, UsuarioCreate
from .auth import oauth2_scheme
from ....core.security import get_current_user, get_password_hash

router = APIRouter()

@router.post("/", response_model=UsuarioResponse)
def criar_paciente(
    *,
    db: Session = Depends(get_db),
    paciente_in: UsuarioCreate,
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Cria um novo paciente.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verifica se o email já está em uso
    if db.query(Usuario).filter(Usuario.email == paciente_in.email).first():
        raise HTTPException(status_code=400, detail="Email já registrado")
    
    # Cria o novo paciente
    hashed_password = get_password_hash(paciente_in.senha)
    paciente = Usuario(
        nome=paciente_in.nome,
        email=paciente_in.email,
        senha=hashed_password,
        tipo="paciente"
    )
    
    try:
        db.add(paciente)
        db.commit()
        db.refresh(paciente)
        return paciente
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao criar paciente")

@router.get("/", response_model=List[UsuarioResponse])
def listar_pacientes(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Lista todos os pacientes.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    pacientes = db.query(Usuario).filter(Usuario.tipo == "paciente").all()
    return pacientes

@router.get("/{paciente_id}", response_model=UsuarioResponse)
def obter_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém um paciente específico.
    """
    if current_user.tipo != "medico":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    paciente = db.query(Usuario).filter(
        Usuario.id == paciente_id,
        Usuario.tipo == "paciente"
    ).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    return paciente 