from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    tipo = Column(String)  # "medico" ou "paciente"
    cpf = Column(String, unique=True)

    # Relacionamentos
    consultas_medico = relationship("Consulta", back_populates="medico", foreign_keys="Consulta.medico_id")
    consultas_paciente = relationship("Consulta", back_populates="paciente", foreign_keys="Consulta.paciente_id")
    gastos_medico = relationship("Gasto", back_populates="medico", foreign_keys="Gasto.medico_id")
    gastos_paciente = relationship("Gasto", back_populates="paciente", foreign_keys="Gasto.paciente_id")
    medicamentos_medico = relationship("Medicamento", back_populates="medico", foreign_keys="Medicamento.medico_id")
    medicamentos_paciente = relationship("Medicamento", back_populates="paciente", foreign_keys="Medicamento.paciente_id")

class Medicamento(Base):
    __tablename__ = "medicamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    descricao = Column(Text)
    dosagem = Column(String)
    frequencia = Column(String)
    medico_id = Column(Integer, ForeignKey("usuarios.id"))
    paciente_id = Column(Integer, ForeignKey("usuarios.id"))

    # Relacionamentos
    medico = relationship("Usuario", back_populates="medicamentos_medico", foreign_keys=[medico_id])
    paciente = relationship("Usuario", back_populates="medicamentos_paciente", foreign_keys=[paciente_id])

class Consulta(Base):
    __tablename__ = "consultas"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(DateTime, default=datetime.now)
    descricao = Column(Text)
    medico_id = Column(Integer, ForeignKey("usuarios.id"))
    paciente_id = Column(Integer, ForeignKey("usuarios.id"))

    # Relacionamentos
    medico = relationship("Usuario", back_populates="consultas_medico", foreign_keys=[medico_id])
    paciente = relationship("Usuario", back_populates="consultas_paciente", foreign_keys=[paciente_id])

class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(Text)
    valor = Column(Float)
    categoria = Column(String)  # "consulta", "medicamento", etc.
    data = Column(DateTime, default=datetime.now)
    medico_id = Column(Integer, ForeignKey("usuarios.id"))
    paciente_id = Column(Integer, ForeignKey("usuarios.id"))

    # Relacionamentos
    medico = relationship("Usuario", back_populates="gastos_medico", foreign_keys=[medico_id])
    paciente = relationship("Usuario", back_populates="gastos_paciente", foreign_keys=[paciente_id]) 