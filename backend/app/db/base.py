from app.models.base import Base, engine, SessionLocal

# Importar todos os modelos aqui para que o Alembic possa detectá-los
from app.models.models import Usuario, Medicamento, Consulta, Gasto 