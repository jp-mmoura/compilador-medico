import requests
from typing import Dict, Any, Tuple
from fastapi import HTTPException

def registrar_consulta(dados: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    """
    Registra uma nova consulta na API.
    
    Args:
        dados (Dict[str, Any]): Dados da consulta a ser registrada
        
    Returns:
        Tuple[int, Dict[str, Any]]: Status code e resposta da API
        
    Raises:
        HTTPException: Se houver erro na comunicação com a API
    """
    try:
        response = requests.post(
            "http://localhost:8000/consultas/",
            json=dados,
            timeout=5
        )
        response.raise_for_status()
        return response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comunicar com a API: {str(e)}"
        )
