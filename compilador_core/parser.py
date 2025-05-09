import ply.yacc as yacc
from typing import Dict, Any, Optional
from .lexer import tokens
from .medicamentos import buscar_medicamento

def p_registro(t) -> Dict[str, Any]:
    '''registro : PACIENTE STRING CPF STRING CONSULTA DATA STRING CID STRING MEDICAMENTO STRING DOSAGEM STRING'''
    nome_medicamento = t[10].strip('"')
    
    # Verifica se o medicamento existe na API
    status, medicamento = buscar_medicamento(nome_medicamento)
    if status != 200:
        raise SyntaxError(f"Medicamento '{nome_medicamento}' não encontrado na base de dados")
    
    t[0] = {
        "nome": t[2].strip('"'),
        "cpf": t[4].strip('"'),
        "data_consulta": t[6].split(":")[1].strip(),
        "cid": t[8].split(":")[1].strip(),
        "medicamento": {
            "nome": medicamento["nome"],
            "dosagem": t[12].split(":")[1].strip(),
            "forma": medicamento["forma"],
            "fabricante": medicamento["fabricante"]
        }
    }

def p_error(t: Optional[yacc.YaccSymbol]) -> None:
    """
    Função chamada quando ocorre um erro de sintaxe.
    
    Args:
        t: Token que causou o erro ou None se o erro for EOF
    """
    if t is None:
        raise SyntaxError("Erro de sintaxe: fim inesperado do arquivo")
    else:
        raise SyntaxError(f"Erro de sintaxe em '{t.value}' na linha {t.lineno}")

# Cria o parser
parser = yacc.yacc()
