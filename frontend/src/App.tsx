import { useState } from 'react'
import './index.css'

interface Medicamento {
  id?: number
  nome: string
  dosagem: string
  forma: string
  fabricante: string
}

interface Paciente {
  id?: number
  nome: string
  cpf: string
  data_nascimento: string
}

interface Consulta {
  id?: number
  paciente_id: number
  medico_crm: string
  data_consulta: string
  cid: string
  medicamento_id: number
  dosagem: string
}

function App() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'medicamentos' | 'pacientes' | 'consultas'>('medicamentos')

  // Form states
  const [medicamentoForm, setMedicamentoForm] = useState<Medicamento>({
    nome: '',
    dosagem: '',
    forma: '',
    fabricante: ''
  })

  const [pacienteForm, setPacienteForm] = useState<Paciente>({
    nome: '',
    cpf: '',
    data_nascimento: ''
  })

  const [consultaForm, setConsultaForm] = useState<Consulta>({
    paciente_id: 0,
    medico_crm: '',
    data_consulta: '',
    cid: '',
    medicamento_id: 0,
    dosagem: ''
  })

  const handleMedicamentoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/medicamentos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicamentoForm)
      })
      if (!response.ok) throw new Error('Erro ao cadastrar medicamento')
      const data = await response.json()
      setMedicamentos([...medicamentos, data])
      setMedicamentoForm({ nome: '', dosagem: '', forma: '', fabricante: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handlePacienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/pacientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacienteForm)
      })
      if (!response.ok) throw new Error('Erro ao cadastrar paciente')
      const data = await response.json()
      setPacientes([...pacientes, data])
      setPacienteForm({ nome: '', cpf: '', data_nascimento: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handleConsultaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/consultas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultaForm)
      })
      if (!response.ok) throw new Error('Erro ao cadastrar consulta')
      const data = await response.json()
      setConsultas([...consultas, data])
      setConsultaForm({
        paciente_id: 0,
        medico_crm: '',
        data_consulta: '',
        cid: '',
        medicamento_id: 0,
        dosagem: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  return (
    <div className="container">
      <h1>Compilador Médico</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'medicamentos' ? 'active' : ''} 
          onClick={() => setActiveTab('medicamentos')}
        >
          Medicamentos
        </button>
        <button 
          className={activeTab === 'pacientes' ? 'active' : ''} 
          onClick={() => setActiveTab('pacientes')}
        >
          Pacientes
        </button>
        <button 
          className={activeTab === 'consultas' ? 'active' : ''} 
          onClick={() => setActiveTab('consultas')}
        >
          Consultas
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {activeTab === 'medicamentos' && (
        <div className="form-container">
          <h2>Cadastrar Medicamento</h2>
          <form onSubmit={handleMedicamentoSubmit} className="form">
            <input
              type="text"
              placeholder="Nome do medicamento"
              value={medicamentoForm.nome}
              onChange={(e) => setMedicamentoForm({...medicamentoForm, nome: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Dosagem (ex: 500mg)"
              value={medicamentoForm.dosagem}
              onChange={(e) => setMedicamentoForm({...medicamentoForm, dosagem: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Forma (ex: Comprimido)"
              value={medicamentoForm.forma}
              onChange={(e) => setMedicamentoForm({...medicamentoForm, forma: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Fabricante"
              value={medicamentoForm.fabricante}
              onChange={(e) => setMedicamentoForm({...medicamentoForm, fabricante: e.target.value})}
              required
            />
            <button type="submit">Cadastrar Medicamento</button>
          </form>

          <div className="list">
            <h3>Medicamentos Cadastrados</h3>
            {medicamentos.map((med) => (
              <div key={med.id} className="item">
                <p><strong>Nome:</strong> {med.nome}</p>
                <p><strong>Dosagem:</strong> {med.dosagem}</p>
                <p><strong>Forma:</strong> {med.forma}</p>
                <p><strong>Fabricante:</strong> {med.fabricante}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pacientes' && (
        <div className="form-container">
          <h2>Cadastrar Paciente</h2>
          <form onSubmit={handlePacienteSubmit} className="form">
            <input
              type="text"
              placeholder="Nome do paciente"
              value={pacienteForm.nome}
              onChange={(e) => setPacienteForm({...pacienteForm, nome: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="CPF (ex: 123.456.789-00)"
              value={pacienteForm.cpf}
              onChange={(e) => setPacienteForm({...pacienteForm, cpf: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Data de Nascimento (ex: 01/01/1990)"
              value={pacienteForm.data_nascimento}
              onChange={(e) => setPacienteForm({...pacienteForm, data_nascimento: e.target.value})}
              required
            />
            <button type="submit">Cadastrar Paciente</button>
          </form>

          <div className="list">
            <h3>Pacientes Cadastrados</h3>
            {pacientes.map((pac) => (
              <div key={pac.id} className="item">
                <p><strong>Nome:</strong> {pac.nome}</p>
                <p><strong>CPF:</strong> {pac.cpf}</p>
                <p><strong>Data de Nascimento:</strong> {pac.data_nascimento}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'consultas' && (
        <div className="form-container">
          <h2>Cadastrar Consulta</h2>
          <form onSubmit={handleConsultaSubmit} className="form">
            <select
              value={consultaForm.paciente_id}
              onChange={(e) => setConsultaForm({...consultaForm, paciente_id: Number(e.target.value)})}
              required
            >
              <option value="">Selecione o Paciente</option>
              {pacientes.map((pac) => (
                <option key={pac.id} value={pac.id}>{pac.nome}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="CRM do Médico (6 dígitos)"
              value={consultaForm.medico_crm}
              onChange={(e) => setConsultaForm({...consultaForm, medico_crm: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Data da Consulta (ex: 09/05/2024)"
              value={consultaForm.data_consulta}
              onChange={(e) => setConsultaForm({...consultaForm, data_consulta: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="CID (ex: CID-10)"
              value={consultaForm.cid}
              onChange={(e) => setConsultaForm({...consultaForm, cid: e.target.value})}
              required
            />
            <select
              value={consultaForm.medicamento_id}
              onChange={(e) => setConsultaForm({...consultaForm, medicamento_id: Number(e.target.value)})}
              required
            >
              <option value="">Selecione o Medicamento</option>
              {medicamentos.map((med) => (
                <option key={med.id} value={med.id}>{med.nome}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Dosagem (ex: 500mg)"
              value={consultaForm.dosagem}
              onChange={(e) => setConsultaForm({...consultaForm, dosagem: e.target.value})}
              required
            />
            <button type="submit">Cadastrar Consulta</button>
          </form>

          <div className="list">
            <h3>Consultas Cadastradas</h3>
            {consultas.map((cons) => (
              <div key={cons.id} className="item">
                <p><strong>Paciente:</strong> {pacientes.find(p => p.id === cons.paciente_id)?.nome}</p>
                <p><strong>CRM:</strong> {cons.medico_crm}</p>
                <p><strong>Data:</strong> {cons.data_consulta}</p>
                <p><strong>CID:</strong> {cons.cid}</p>
                <p><strong>Medicamento:</strong> {medicamentos.find(m => m.id === cons.medicamento_id)?.nome}</p>
                <p><strong>Dosagem:</strong> {cons.dosagem}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
