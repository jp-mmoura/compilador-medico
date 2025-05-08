# 🩺 MedCompiler - Sistema de Gestão Clínica

Sistema completo de backend com **FastAPI**, organizado com arquitetura limpa e modular, que permite o gerenciamento de **pacientes**, **consultas**, **medicamentos** e **atendimentos**.

---

## ✅ Funcionalidades

- 📋 Cadastro e listagem de pacientes
- 📅 Agendamento e consulta de registros médicos
- 💊 Gerenciamento de medicamentos
- 🏥 Controle de atendimentos
- 🔧 Estrutura pronta para expansão com um compilador médico customizado

- ## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/medcompiler.git
cd medcompiler
### 2. Instalar dependências do backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

### 3. Rodar frontend
cd frontend
npm install
npm start

| Rota Base       | Método | Descrição                  |
| --------------- | ------ | -------------------------- |
| `/pacientes`    | GET    | Listar pacientes           |
| `/pacientes`    | POST   | Cadastrar novo paciente    |
| `/consultas`    | GET    | Listar consultas           |
| `/consultas`    | POST   | Cadastrar nova consulta    |
| `/medicamentos` | GET    | Listar medicamentos        |
| `/medicamentos` | POST   | Cadastrar novo medicamento |


Tecnologias
FastAPI
Pydantic
Uvicorn
React.js
