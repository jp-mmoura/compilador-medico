from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any, List
from datetime import datetime, timedelta

from ....db.session import get_db
from ....models.models import Gasto, Usuario, Consulta
from .auth import oauth2_scheme
from ....core.security import get_current_user

router = APIRouter()

@router.get("/paciente/{paciente_id}")
def obter_estatisticas_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém estatísticas detalhadas de um paciente.
    """
    print(f"Buscando estatísticas para o paciente {paciente_id}")
    
    # Verifica se o usuário tem permissão
    if current_user.tipo == "paciente" and current_user.id != paciente_id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Verifica se o paciente existe
    paciente = db.query(Usuario).filter(
        Usuario.id == paciente_id,
        Usuario.tipo == "paciente"
    ).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    # Calcula gastos totais
    gasto_total = db.query(func.sum(Gasto.valor)).filter(
        Gasto.paciente_id == paciente_id
    ).scalar() or 0
    print(f"Gasto total: {gasto_total}")

    # Calcula gastos com consultas
    gasto_consultas = db.query(func.sum(Gasto.valor)).filter(
        Gasto.paciente_id == paciente_id,
        Gasto.categoria == "consulta"
    ).scalar() or 0
    print(f"Gasto consultas: {gasto_consultas}")

    # Calcula gastos com medicamentos
    gasto_medicamentos = db.query(func.sum(Gasto.valor)).filter(
        Gasto.paciente_id == paciente_id,
        Gasto.categoria == "medicamento"
    ).scalar() or 0
    print(f"Gasto medicamentos: {gasto_medicamentos}")

    # Calcula total de consultas
    total_consultas = db.query(func.count(Consulta.id)).filter(
        Consulta.paciente_id == paciente_id
    ).scalar() or 0
    print(f"Total consultas: {total_consultas}")

    # Gera dados para o gráfico (últimos 6 meses)
    dados_grafico = []
    for i in range(5, -1, -1):  # Inverte a ordem para começar do mês mais antigo
        data = datetime.now() - timedelta(days=30*i)
        mes_ano = data.strftime("%Y-%m")
        
        # Gastos com consultas no mês
        valor_consulta = db.query(func.sum(Gasto.valor)).filter(
            Gasto.paciente_id == paciente_id,
            Gasto.categoria == "consulta",
            func.strftime("%Y-%m", Gasto.data) == mes_ano
        ).scalar() or 0

        # Gastos com medicamentos no mês
        valor_medicamento = db.query(func.sum(Gasto.valor)).filter(
            Gasto.paciente_id == paciente_id,
            Gasto.categoria == "medicamento",
            func.strftime("%Y-%m", Gasto.data) == mes_ano
        ).scalar() or 0

        total = float(valor_consulta + valor_medicamento)
        print(f"Mês {mes_ano}: Consultas={valor_consulta}, Medicamentos={valor_medicamento}, Total={total}")

        dados_grafico.append({
            "data": mes_ano,
            "valor_consulta": float(valor_consulta),
            "valor_medicamento": float(valor_medicamento),
            "total": total
        })

    resultado = {
        "gasto_total": float(gasto_total),
        "gasto_consultas": float(gasto_consultas),
        "gasto_medicamentos": float(gasto_medicamentos),
        "total_consultas": total_consultas,
        "dados_grafico": dados_grafico
    }
    
    print("Resultado final:", resultado)
    return resultado

@router.get("/gastos/total")
def obter_total_gastos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém o total de gastos.
    """
    if current_user.tipo == "medico":
        total = db.query(func.sum(Gasto.valor)).filter(
            Gasto.medico_id == current_user.id
        ).scalar() or 0
    else:
        total = db.query(func.sum(Gasto.valor)).filter(
            Gasto.paciente_id == current_user.id
        ).scalar() or 0
    
    return {"total": total}

@router.get("/gastos/categoria")
def obter_gastos_por_categoria(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Any:
    """
    Obtém os gastos agrupados por categoria.
    """
    if current_user.tipo == "medico":
        gastos = db.query(
            Gasto.categoria,
            func.sum(Gasto.valor).label("total")
        ).filter(
            Gasto.medico_id == current_user.id
        ).group_by(Gasto.categoria).all()
    else:
        gastos = db.query(
            Gasto.categoria,
            func.sum(Gasto.valor).label("total")
        ).filter(
            Gasto.paciente_id == current_user.id
        ).group_by(Gasto.categoria).all()
    
    return [{"categoria": g.categoria, "total": g.total} for g in gastos] 