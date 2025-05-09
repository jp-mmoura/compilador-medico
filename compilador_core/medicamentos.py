import requests
from typing import Dict, Any, Tuple, List
from fastapi import HTTPException

def registrar_medicamento(dados: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    """
    Registra um novo medicamento na API.
    
    Args:
        dados (Dict[str, Any]): Dados do medicamento a ser registrado
        
    Returns:
        Tuple[int, Dict[str, Any]]: Status code e resposta da API
        
    Raises:
        HTTPException: Se houver erro na comunicação com a API
    """
    try:
        response = requests.post(
            "http://localhost:8000/medicamentos/",
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

def listar_medicamentos() -> Tuple[int, List[Dict[str, Any]]]:
    """
    Lista todos os medicamentos registrados.
    
    Returns:
        Tuple[int, List[Dict[str, Any]]]: Status code e lista de medicamentos
        
    Raises:
        HTTPException: Se houver erro na comunicação com a API
    """
    try:
        response = requests.get(
            "http://localhost:8000/medicamentos/",
            timeout=5
        )
        response.raise_for_status()
        return response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comunicar com a API: {str(e)}"
        )

def buscar_medicamento(nome: str) -> Tuple[int, Dict[str, Any]]:
    """
    Busca um medicamento pelo nome.
    
    Args:
        nome (str): Nome do medicamento a ser buscado
        
    Returns:
        Tuple[int, Dict[str, Any]]: Status code e dados do medicamento
        
    Raises:
        HTTPException: Se houver erro na comunicação com a API
    """
    try:
        response = requests.get(
            f"http://localhost:8000/medicamentos/buscar/{nome}",
            timeout=5
        )
        response.raise_for_status()
        return response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comunicar com a API: {str(e)}"
        ) 