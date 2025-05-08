import requests

def registrar_consulta(dados):
    response = requests.post("http://localhost:8000/api/consultas", json=dados)
    return response.status_code, response.json()
