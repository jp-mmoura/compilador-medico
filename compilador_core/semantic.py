def validar_registro(dados):
    if not dados["cpf"].startswith("CPF:"):
        raise ValueError("CPF inválido")
    if int(dados["dosagem"].replace("mg", "")) > 1000:
        raise ValueError("Dosagem acima do permitido")
    return True
