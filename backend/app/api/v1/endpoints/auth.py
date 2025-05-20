from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from ....db.session import get_db
from ....core.security import verify_password, create_access_token, get_password_hash, oauth2_scheme, get_current_user
from ....core.config import settings
from ....models.models import Usuario
from ....schemas.schemas import Token, UsuarioCreate, UsuarioResponse

router = APIRouter()

@router.post("/token", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    print(f"Tentando login com email: {form_data.username}")
    
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user:
        print(f"Usuário não encontrado: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Usuário encontrado: {user.email}")
    print(f"Senha fornecida: {form_data.password}")
    print(f"Hash armazenado: {user.senha}")
    
    if not verify_password(form_data.password, user.senha):
        print(f"Senha incorreta para o usuário: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Login bem-sucedido para o usuário: {form_data.username}")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UsuarioResponse)
def read_users_me(
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/register", response_model=UsuarioResponse)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UsuarioCreate,
) -> Any:
    """
    Register new user.
    """
    print(f"Tentando registrar usuário: {user_in.email}")
    
    user = db.query(Usuario).filter(Usuario.email == user_in.email).first()
    if user:
        print(f"Email já registrado: {user_in.email}")
        raise HTTPException(
            status_code=400,
            detail="Email já registrado",
        )
    
    hashed_password = get_password_hash(user_in.senha)
    user = Usuario(
        nome=user_in.nome,
        email=user_in.email,
        senha=hashed_password,
        tipo=user_in.tipo
    )
    
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Usuário registrado com sucesso: {user_in.email}")
        return user
    except Exception as e:
        print(f"Erro ao registrar usuário: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Erro ao registrar usuário",
        ) 