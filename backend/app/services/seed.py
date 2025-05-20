from sqlalchemy.orm import Session
from ..models.models import Usuario, Medicamento, Consulta, Gasto
from ..core.security import get_password_hash
from datetime import datetime, timedelta
import random

def seed_database(db: Session):
    # Verificar se já existem usuários
    if db.query(Usuario).first():
        print("Banco de dados já populado!")
        return

    # Criar usuários de teste
    senha_hash = get_password_hash("senha123")
    print(f"Hash da senha gerado: {senha_hash}")

    medico = Usuario(
        nome="Médico Teste",
        email="medico@teste.com",
        senha=senha_hash,
        tipo="medico",
        cpf="12345678900"
    )
    
    paciente = Usuario(
        nome="Paciente Teste",
        email="paciente@teste.com",
        senha=senha_hash,
        tipo="paciente",
        cpf="98765432100"
    )
    
    db.add(medico)
    db.add(paciente)
    db.commit()
    db.refresh(medico)
    db.refresh(paciente)
    
    # Criar medicamentos de teste
    medicamentos = [
        Medicamento(
            nome="Paracetamol",
            descricao="Analgésico e antitérmico",
            dosagem="500mg",
            frequencia="8/8 horas",
            medico_id=medico.id,
            paciente_id=paciente.id
        ),
        Medicamento(
            nome="Dipirona",
            descricao="Analgésico e antitérmico",
            dosagem="1g",
            frequencia="6/6 horas",
            medico_id=medico.id,
            paciente_id=paciente.id
        )
    ]
    
    for medicamento in medicamentos:
        db.add(medicamento)
    db.commit()
    
    # Criar consultas de teste
    consultas = [
        Consulta(
            descricao="Consulta de rotina",
            medico_id=medico.id,
            paciente_id=paciente.id,
            data=datetime.now() - timedelta(days=30)
        ),
        Consulta(
            descricao="Retorno",
            medico_id=medico.id,
            paciente_id=paciente.id,
            data=datetime.now() - timedelta(days=15)
        )
    ]
    
    for consulta in consultas:
        db.add(consulta)
    db.commit()
    
    # Criar gastos de teste
    gastos = [
        Gasto(
            descricao="Consulta",
            valor=150.00,
            categoria="consulta",
            medico_id=medico.id,
            paciente_id=paciente.id,
            data=datetime.now() - timedelta(days=30)
        ),
        Gasto(
            descricao="Medicamentos",
            valor=50.00,
            categoria="medicamento",
            medico_id=medico.id,
            paciente_id=paciente.id,
            data=datetime.now() - timedelta(days=15)
        )
    ]
    
    for gasto in gastos:
        db.add(gasto)
    db.commit()

    # Criar consultas e gastos nos últimos 6 meses
    data_inicial = datetime.now() - timedelta(days=180)
    for i in range(10):
        data = data_inicial + timedelta(days=i * 15)  # Consulta a cada 15 dias
        
        # Criar consulta
        consulta = Consulta(
            data=data,
            descricao=f"Consulta de rotina {i+1}",
            medico_id=medico.id,
            paciente_id=paciente.id
        )
        db.add(consulta)
        
        # Criar gasto da consulta
        gasto_consulta = Gasto(
            descricao=f"Consulta {i+1}",
            valor=random.uniform(100, 200),
            categoria="consulta",
            data=data,
            medico_id=medico.id,
            paciente_id=paciente.id
        )
        db.add(gasto_consulta)
        
        # Criar gasto de medicamento
        gasto_medicamento = Gasto(
            descricao=f"Medicamentos {i+1}",
            valor=random.uniform(50, 150),
            categoria="medicamento",
            data=data,
            medico_id=medico.id,
            paciente_id=paciente.id
        )
        db.add(gasto_medicamento)
    
    db.commit() 