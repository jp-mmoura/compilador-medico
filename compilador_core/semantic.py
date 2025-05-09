from typing import Dict, Any
from datetime import datetime

def validar_registro(dados: Dict[str, Any]) -> bool:
    """
    Valida os dados do registro médico.
    
    Args:
        dados (Dict[str, Any]): Dados do registro a serem validados
        
    Returns:
        bool: True se os dados são válidos
        
    Raises:
        ValueError: Se algum dado for inválido
    """
    # Validação do CPF
    if not dados["cpf"].startswith("CPF:"):
        raise ValueError("CPF inválido: deve começar com 'CPF:'")
    
    # Validação da data
    try:
        data_consulta = datetime.strptime(dados["data_consulta"], "%d/%m/%Y")
        if data_consulta > datetime.now():
            raise ValueError("Data da consulta não pode ser futura")
    except ValueError:
        raise ValueError("Formato de data inválido. Use DD/MM/AAAA")
    
    # Validação do CID
    if not dados["cid"].startswith("CID-"):
        raise ValueError("CID inválido: deve começar com 'CID-'")
    
    # Validação do medicamento
    medicamento = dados["medicamento"]
    if not isinstance(medicamento, dict):
        raise ValueError("Dados do medicamento inválidos")
    
    # Validação da dosagem
    try:
        dosagem = int(medicamento["dosagem"].replace("mg", ""))
        if dosagem <= 0:
            raise ValueError("Dosagem deve ser maior que zero")
        if dosagem > 1000:
            raise ValueError("Dosagem acima do permitido (máximo 1000mg)")
    except ValueError as e:
        if "Dosagem" in str(e):
            raise
        raise ValueError("Formato de dosagem inválido. Use números seguidos de 'mg'")
    
    return True
