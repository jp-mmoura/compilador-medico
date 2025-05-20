from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Usuario
class UsuarioBase(BaseModel):
    email: str
    nome: str
    tipo: str

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

# Medicamento
class MedicamentoBase(BaseModel):
    nome: str
    descricao: str
    dosagem: str
    frequencia: str
    paciente_id: int

class MedicamentoCreate(MedicamentoBase):
    pass

class MedicamentoResponse(MedicamentoBase):
    id: int
    medico_id: int

    class Config:
        from_attributes = True

# Consulta
class ConsultaBase(BaseModel):
    descricao: str
    paciente_id: int

class ConsultaCreate(ConsultaBase):
    pass

class ConsultaResponse(ConsultaBase):
    id: int
    data: datetime
    medico_id: int

    class Config:
        from_attributes = True

# Gasto
class GastoBase(BaseModel):
    descricao: str
    valor: float
    categoria: str
    paciente_id: int

class GastoCreate(GastoBase):
    pass

class GastoResponse(GastoBase):
    id: int
    data: datetime
    medico_id: int

    class Config:
        from_attributes = True 