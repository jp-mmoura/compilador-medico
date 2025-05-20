# Sistema de Gestão Médica

Um sistema completo para gestão de pacientes, consultas, medicamentos e gastos médicos, desenvolvido com FastAPI no backend e React no frontend.

## 🚀 Tecnologias Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Python 3.8+

### Frontend
- React
- TypeScript
- Tailwind CSS
- Chart.js
- React Router

## 📋 Pré-requisitos

- Python 3.8 ou superior
- Node.js 14 ou superior
- pip (gerenciador de pacotes Python)
- npm (gerenciador de pacotes Node)

## 🔧 Instalação

### Backend

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd compilador-medico
```

2. Crie e ative um ambiente virtual Python:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Instale as dependências do backend:
```bash
cd backend
pip install -r requirements.txt
```

Se encontrar erros durante a instalação das dependências:

- **Erro com uvicorn**: Tente instalar separadamente:
```bash
pip install uvicorn[standard]
```

- **Erro com SQLAlchemy**: Tente instalar com versão específica:
```bash
pip install SQLAlchemy==1.4.41
```

- **Erro com alembic**: Instale separadamente:
```bash
pip install alembic
```

4. Configure o banco de dados:
- O sistema usa SQLite por padrão
- O banco de dados será criado automaticamente na primeira execução
- O arquivo do banco será criado em `backend/app.db`

5. Execute as migrações:
```bash
# Certifique-se de estar na pasta backend
cd backend

# Inicialize o alembic (se ainda não foi feito)
alembic init alembic

# Atualize o arquivo alembic.ini com a URL do banco
# Altere a linha sqlalchemy.url para:
# sqlalchemy.url = sqlite:///./app.db

# Atualize o arquivo env.py em alembic/
# Adicione no início do arquivo:
# import os
# import sys
# sys.path.append(os.path.dirname(os.path.dirname(__file__)))
# from app.db.session import Base
# target_metadata = Base.metadata

# Execute as migrações
alembic upgrade head
```

Se encontrar erros nas migrações:

- **Erro de importação**: Verifique se está na pasta correta e se o PYTHONPATH está configurado:
```bash
# Windows
set PYTHONPATH=%PYTHONPATH%;%CD%

# Linux/Mac
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

- **Erro de banco de dados**: Remova o arquivo app.db (se existir) e tente novamente:
```bash
rm app.db
alembic upgrade head
```

6. Inicie o servidor backend:
```bash
# Certifique-se de estar na pasta backend
cd backend

# Inicie o servidor
uvicorn app.main:app --reload
```

Se encontrar erros ao iniciar o servidor:

- **Erro de importação**: Verifique se está na pasta correta e se o PYTHONPATH está configurado (veja acima)
- **Erro de porta em uso**: Use uma porta diferente:
```bash
uvicorn app.main:app --reload --port 8001
```

### Frontend

1. Em um novo terminal, navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

Se encontrar erros durante a instalação:

- **Erro de permissão**: Use sudo (Linux/Mac) ou execute como administrador (Windows)
- **Erro de versão do Node**: Verifique se está usando a versão correta:
```bash
node -v  # Deve ser 14 ou superior
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Se encontrar erros ao iniciar o frontend:

- **Erro de porta em uso**: Altere a porta no arquivo `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3001
  },
  // ... resto da configuração
})
```

## 🔍 Verificação da Instalação

1. Backend:
- Acesse http://localhost:8000/docs
- Você deve ver a documentação Swagger da API
- Teste o endpoint de login com as credenciais padrão

2. Frontend:
- Acesse http://localhost:5173
- Você deve ver a tela de login
- Tente fazer login com as credenciais padrão

## 👥 Usuários Padrão

O sistema vem com dois usuários pré-configurados que são criados automaticamente na primeira execução:

### Médico
- Email: medico@exemplo.com
- Senha: senha123

### Paciente
- Email: paciente@exemplo.com
- Senha: senha123

## 🎯 Funcionalidades

### Dashboard do Médico

#### 1. Gestão de Pacientes
- Visualizar lista de pacientes
- Adicionar novos pacientes
- Ver prontuário completo de cada paciente
  - Histórico de consultas
  - Medicamentos em uso
  - Histórico de gastos

#### 2. Gestão de Medicamentos
- Registrar novos medicamentos
- Associar medicamentos a pacientes
- Definir dosagem e frequência
- Visualizar lista de medicamentos prescritos

#### 3. Gestão de Consultas
- Agendar novas consultas
- Registrar descrições e observações
- Visualizar histórico de consultas por paciente

#### 4. Gestão de Gastos
- Registrar gastos com consultas e medicamentos
- Visualizar gastos por categoria
- Acompanhar gastos por paciente

### Dashboard do Paciente

#### 1. Visualização de Dados
- Ver medicamentos prescritos
- Acompanhar histórico de consultas
- Visualizar gastos realizados

#### 2. Estatísticas
- Gráfico de gastos por categoria
- Evolução de gastos ao longo do tempo
- Total de consultas realizadas

## 🔐 Segurança

- Autenticação JWT
- Senhas criptografadas
- Controle de acesso baseado em roles (médico/paciente)
- Proteção de rotas sensíveis

## 📱 Interface Responsiva

- Design adaptativo para desktop e mobile
- Navegação intuitiva
- Feedback visual para ações do usuário
- Animações suaves

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
compilador-medico/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── alembic/
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   └── services/
    └── package.json
```

### Comandos Úteis

#### Backend
```bash
# Criar nova migração
alembic revision --autogenerate -m "descrição"

# Aplicar migrações
alembic upgrade head

# Rodar testes
pytest
```

#### Frontend
```bash
# Construir para produção
npm run build

# Rodar testes
npm test

# Verificar linting
npm run lint
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- FastAPI por fornecer um framework web moderno e rápido
- React por possibilitar uma interface de usuário dinâmica
- Tailwind CSS por simplificar o desenvolvimento de UI
- Chart.js por fornecer visualizações de dados interativas 