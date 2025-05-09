# Compilador Médico

Sistema para processamento e validação de registros médicos, incluindo gerenciamento de medicamentos, pacientes e consultas.

## Estrutura do Projeto

```
.
├── backend/                 # API FastAPI
│   ├── app/
│   │   └── routes/         # Rotas da API
│   └── main.py             # Ponto de entrada da API
├── compilador_core/        # Core do compilador
│   ├── lexer.py           # Analisador léxico
│   ├── parser.py          # Analisador sintático
│   ├── semantic.py        # Análise semântica
│   ├── codegen.py         # Geração de código
│   └── medicamentos.py    # Gerenciamento de medicamentos
├── frontend/              # Interface React
│   ├── src/
│   │   ├── App.tsx       # Componente principal
│   │   └── index.css     # Estilos
│   └── package.json      # Dependências
└── setup.py              # Configuração do pacote Python
```

## Requisitos

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- Pydantic

### Frontend
- Node.js 18+
- React
- TypeScript
- Vite

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd compilador-medico
```

2. Configure o ambiente Python:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -e .
```

3. Configure o frontend:
```bash
cd frontend
npm install
```

## Executando o Projeto

1. Inicie o backend:
```bash
cd backend
python main.py
```
O servidor estará disponível em http://localhost:8000

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```
A interface estará disponível em http://localhost:5173

## Funcionalidades

### Backend

- **API REST** com endpoints para:
  - Gerenciamento de medicamentos
  - Cadastro de pacientes
  - Registro de consultas
  - Processamento de registros médicos

- **Compilador** com:
  - Análise léxica
  - Análise sintática
  - Análise semântica
  - Geração de código

### Frontend

- Interface moderna e responsiva
- Formulários para:
  - Cadastro de medicamentos
  - Cadastro de pacientes
  - Registro de consultas
- Validação de dados em tempo real
- Listagem de registros

## Uso

1. **Cadastro de Medicamentos**
   - Acesse a aba "Medicamentos"
   - Preencha nome, dosagem, forma e fabricante
   - Clique em "Cadastrar Medicamento"

2. **Cadastro de Pacientes**
   - Acesse a aba "Pacientes"
   - Preencha nome, CPF e data de nascimento
   - Clique em "Cadastrar Paciente"

3. **Registro de Consultas**
   - Acesse a aba "Consultas"
   - Selecione o paciente
   - Preencha CRM do médico, data, CID
   - Selecione o medicamento e dosagem
   - Clique em "Cadastrar Consulta"

## Formato dos Dados

### Medicamentos
```json
{
  "nome": "string",
  "dosagem": "string (ex: 500mg)",
  "forma": "string (ex: Comprimido)",
  "fabricante": "string"
}
```

### Pacientes
```json
{
  "nome": "string",
  "cpf": "string (formato: 123.456.789-00)",
  "data_nascimento": "string (formato: DD/MM/AAAA)"
}
```

### Consultas
```json
{
  "paciente_id": "number",
  "medico_crm": "string (6 dígitos)",
  "data_consulta": "string (formato: DD/MM/AAAA)",
  "cid": "string (formato: CID-XX)",
  "medicamento_id": "number",
  "dosagem": "string (ex: 500mg)"
}
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 