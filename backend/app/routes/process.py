from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Add the compilador_core directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '../../'))
sys.path.append(project_root)

from compilador_core.parser import parser
from compilador_core.semantic import validar_registro

router = APIRouter()

class ProcessRequest(BaseModel):
    text: str

@router.post("/process")
async def process_medical_record(request: ProcessRequest) -> Dict[str, Any]:
    """
    Processa um registro médico e retorna os dados estruturados.
    
    Args:
        request: Objeto contendo o texto do registro médico
        
    Returns:
        Dict[str, Any]: Dados estruturados do registro
        
    Raises:
        HTTPException: Se houver erro no processamento
    """
    try:
        # Parse the input text
        result = parser.parse(request.text)
        
        # Validate the parsed data
        validar_registro(result)
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        ) 