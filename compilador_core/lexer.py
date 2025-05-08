import ply.lex as lex

tokens = (
    'PACIENTE', 'CPF', 'MEDICAMENTO', 'DOSAGEM', 'CONSULTA', 'DATA', 'CID',
    'STRING'
)

t_ignore = ' \t'
t_PACIENTE = r'PACIENTE'
t_CPF = r'CPF:[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}'
t_MEDICAMENTO = r'MEDICAMENTO'
t_DOSAGEM = r'DOSAGEM:[0-9]+mg'
t_CID = r'CID:[A-Z][0-9]{2}'
t_CONSULTA = r'CONSULTA'
t_DATA = r'DATA:[0-9]{2}/[0-9]{2}/[0-9]{4}'
t_STRING = r'"[^"]+"'

def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t):
    print(f"Caractere inválido: {t.value[0]}")
    t.lexer.skip(1)

lexer = lex.lex()
