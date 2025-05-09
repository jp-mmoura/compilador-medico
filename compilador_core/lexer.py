import ply.lex as lex
from typing import Any, List
from datetime import datetime

# Lista de tokens
tokens: List[str] = [
    'PACIENTE', 'CPF', 'MEDICAMENTO', 'DOSAGEM', 'CONSULTA', 'DATA', 'CID',
    'STRING'
]

# Caracteres a serem ignorados
t_ignore = ' \t'

# Definição dos tokens
def t_PACIENTE(t: lex.LexToken) -> lex.LexToken:
    r'PACIENTE'
    return t

def t_CPF(t: lex.LexToken) -> lex.LexToken:
    r'CPF:[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}'
    return t

def t_MEDICAMENTO(t: lex.LexToken) -> lex.LexToken:
    r'MEDICAMENTO'
    return t

def t_DOSAGEM(t: lex.LexToken) -> lex.LexToken:
    r'DOSAGEM:[0-9]+mg'
    # Validação da dosagem
    try:
        dosagem = int(t.value.split(':')[1].replace('mg', ''))
        if dosagem <= 0:
            raise ValueError("Dosagem deve ser maior que zero")
        if dosagem > 1000:
            raise ValueError("Dosagem acima do permitido (máximo 1000mg)")
    except ValueError as e:
        print(f"Erro na linha {t.lineno}: {str(e)}")
        t.lexer.skip(1)
    return t

def t_CID(t: lex.LexToken) -> lex.LexToken:
    r'CID:[A-Z][0-9]{2}'
    return t

def t_CONSULTA(t: lex.LexToken) -> lex.LexToken:
    r'CONSULTA'
    return t

def t_DATA(t: lex.LexToken) -> lex.LexToken:
    r'DATA:[0-9]{2}/[0-9]{2}/[0-9]{4}'
    # Validação da data
    try:
        data_str = t.value.split(':')[1]
        data = datetime.strptime(data_str, "%d/%m/%Y")
        if data > datetime.now():
            print(f"Erro na linha {t.lineno}: Data da consulta não pode ser futura")
            t.lexer.skip(1)
    except ValueError:
        print(f"Erro na linha {t.lineno}: Formato de data inválido. Use DD/MM/AAAA")
        t.lexer.skip(1)
    return t

def t_STRING(t: lex.LexToken) -> lex.LexToken:
    r'"[^"]+"'
    return t

def t_newline(t: lex.LexToken) -> None:
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t: lex.LexToken) -> None:
    """
    Função chamada quando um caractere inválido é encontrado.
    
    Args:
        t: Token que causou o erro
    """
    print(f"Erro na linha {t.lineno}: Caractere inválido '{t.value[0]}'")
    t.lexer.skip(1)

# Cria o lexer
lexer = lex.lex()
