import ply.yacc as yacc
from lexer import tokens

def p_registro(t):
    '''registro : PACIENTE STRING CPF STRING CONSULTA DATA STRING CID STRING MEDICAMENTO STRING DOSAGEM STRING'''
    t[0] = {
        "nome": t[2].strip('"'),
        "cpf": t[4],
        "data_consulta": t[6].split(":")[1],
        "cid": t[8].split(":")[1],
        "medicamento": t[10].strip('"'),
        "dosagem": t[12].split(":")[1]
    }

def p_error(t):
    print("Erro de sintaxe:", t)

parser = yacc.yacc()
