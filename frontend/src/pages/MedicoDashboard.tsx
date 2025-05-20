import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProntuarioModal } from '../components/ProntuarioModal';

interface Paciente {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface Medicamento {
  id: number;
  nome: string;
  descricao: string;
  dosagem: string;
  frequencia: string;
  paciente_id: number;
  medico_id: number;
}

interface Consulta {
  id: number;
  data: string;
  descricao: string;
  paciente_id: number;
  medico_id: number;
}

interface Gasto {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  paciente_id: number;
  medico_id: number;
}

export function MedicoDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('pacientes');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState({
    pacientes: false,
    medicamentos: false,
    consultas: false,
    gastos: false,
    submit: false
  });
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isProntuarioOpen, setIsProntuarioOpen] = useState(false);

  // Form states
  const [novoPaciente, setNovoPaciente] = useState({ nome: '', email: '', senha: '' });
  const [novoMedicamento, setNovoMedicamento] = useState({ nome: '', descricao: '', dosagem: '', frequencia: '', paciente_id: '' });
  const [novaConsulta, setNovaConsulta] = useState({ descricao: '', paciente_id: '' });
  const [novoGasto, setNovoGasto] = useState({ descricao: '', valor: '', categoria: '', paciente_id: '' });

  // Função para limpar mensagens após 5 segundos
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  // Função para mostrar mensagem de erro
  const showError = (message: string) => {
    setError(message);
    clearMessages();
  };

  // Função para mostrar mensagem de sucesso
  const showSuccess = (message: string) => {
    setSuccess(message);
    clearMessages();
  };

  useEffect(() => {
    fetchPacientes();
    fetchMedicamentos();
    fetchConsultas();
    fetchGastos();
  }, [token]);

  const fetchPacientes = async () => {
    try {
      setLoading(prev => ({ ...prev, pacientes: true }));
      const response = await fetch('http://localhost:8000/api/v1/pacientes/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      showError('Erro ao buscar pacientes');
    } finally {
      setLoading(prev => ({ ...prev, pacientes: false }));
    }
  };

  const fetchMedicamentos = async () => {
    try {
      setLoading(prev => ({ ...prev, medicamentos: true }));
      const response = await fetch('http://localhost:8000/api/v1/medicamentos/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMedicamentos(data);
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      showError('Erro ao buscar medicamentos');
    } finally {
      setLoading(prev => ({ ...prev, medicamentos: false }));
    }
  };

  const fetchConsultas = async () => {
    try {
      setLoading(prev => ({ ...prev, consultas: true }));
      const response = await fetch('http://localhost:8000/api/v1/consultas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setConsultas(data);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      showError('Erro ao buscar consultas');
    } finally {
      setLoading(prev => ({ ...prev, consultas: false }));
    }
  };

  const fetchGastos = async () => {
    try {
      setLoading(prev => ({ ...prev, gastos: true }));
      const response = await fetch('http://localhost:8000/api/v1/gastos/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGastos(data);
    } catch (error) {
      console.error('Erro ao buscar gastos:', error);
      showError('Erro ao buscar gastos');
    } finally {
      setLoading(prev => ({ ...prev, gastos: false }));
    }
  };

  const handleSubmitPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetch('http://localhost:8000/api/v1/pacientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...novoPaciente,
          tipo: 'paciente'
        })
      });
      if (!response.ok) throw new Error('Erro ao criar paciente');
      showSuccess('Paciente criado com sucesso!');
      setNovoPaciente({ nome: '', email: '', senha: '' });
      fetchPacientes();
    } catch (error) {
      showError('Erro ao criar paciente');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleSubmitMedicamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetch('http://localhost:8000/api/v1/medicamentos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...novoMedicamento,
          paciente_id: parseInt(novoMedicamento.paciente_id)
        })
      });
      if (!response.ok) throw new Error('Erro ao criar medicamento');
      showSuccess('Medicamento criado com sucesso!');
      setNovoMedicamento({ nome: '', descricao: '', dosagem: '', frequencia: '', paciente_id: '' });
      fetchMedicamentos();
    } catch (error) {
      showError('Erro ao criar medicamento');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleSubmitConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetch('http://localhost:8000/api/v1/consultas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...novaConsulta,
          paciente_id: parseInt(novaConsulta.paciente_id)
        })
      });
      if (!response.ok) throw new Error('Erro ao criar consulta');
      showSuccess('Consulta criada com sucesso!');
      setNovaConsulta({ descricao: '', paciente_id: '' });
      fetchConsultas();
    } catch (error) {
      showError('Erro ao criar consulta');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleSubmitGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetch('http://localhost:8000/api/v1/gastos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...novoGasto,
          paciente_id: parseInt(novoGasto.paciente_id),
          valor: parseFloat(novoGasto.valor)
        })
      });
      if (!response.ok) throw new Error('Erro ao registrar gasto');
      showSuccess('Gasto registrado com sucesso!');
      setNovoGasto({ descricao: '', valor: '', categoria: '', paciente_id: '' });
      fetchGastos();
    } catch (error) {
      showError('Erro ao registrar gasto');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDeleteMedicamento = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este medicamento?')) return;
    
    try {
      setLoading(prev => ({ ...prev, medicamentos: true }));
      const response = await fetch(`http://localhost:8000/api/v1/medicamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao excluir medicamento');
      showSuccess('Medicamento excluído com sucesso!');
      fetchMedicamentos();
    } catch (error) {
      showError('Erro ao excluir medicamento');
    } finally {
      setLoading(prev => ({ ...prev, medicamentos: false }));
    }
  };

  const handleDeleteConsulta = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta consulta?')) return;
    
    try {
      setLoading(prev => ({ ...prev, consultas: true }));
      const response = await fetch(`http://localhost:8000/api/v1/consultas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao excluir consulta');
      showSuccess('Consulta excluída com sucesso!');
      fetchConsultas();
    } catch (error) {
      showError('Erro ao excluir consulta');
    } finally {
      setLoading(prev => ({ ...prev, consultas: false }));
    }
  };

  const handleDeleteGasto = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este gasto?')) return;
    
    try {
      setLoading(prev => ({ ...prev, gastos: true }));
      const response = await fetch(`http://localhost:8000/api/v1/gastos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao excluir gasto');
      showSuccess('Gasto excluído com sucesso!');
      fetchGastos();
    } catch (error) {
      showError('Erro ao excluir gasto');
    } finally {
      setLoading(prev => ({ ...prev, gastos: false }));
    }
  };

  const handleVerProntuario = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setIsProntuarioOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center drop-shadow">Dashboard do Médico</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('pacientes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pacientes'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pacientes
          </button>
          <button
            onClick={() => setActiveTab('medicamentos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'medicamentos'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Medicamentos
          </button>
          <button
            onClick={() => setActiveTab('consultas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'consultas'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consultas
          </button>
          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'gastos'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Gastos
          </button>
        </div>

        {/* Mensagens de feedback */}
        {activeTab === 'pacientes' && error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {activeTab === 'pacientes' && success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4">
            {success}
          </div>
        )}

        {/* Conteúdo das tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulários */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {activeTab === 'pacientes' && 'Novo Paciente'}
              {activeTab === 'medicamentos' && 'Novo Medicamento'}
              {activeTab === 'consultas' && 'Nova Consulta'}
              {activeTab === 'gastos' && 'Novo Gasto'}
            </h2>

            {activeTab === 'pacientes' && (
              <form onSubmit={handleSubmitPaciente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoPaciente.nome}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={novoPaciente.email}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <input
                    type="password"
                    value={novoPaciente.senha}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, senha: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading.submit}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading.submit ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Criar Paciente'
                  )}
                </button>
              </form>
            )}

            {activeTab === 'medicamentos' && (
              <form onSubmit={handleSubmitMedicamento} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoMedicamento.nome}
                    onChange={(e) => setNovoMedicamento({ ...novoMedicamento, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={novoMedicamento.descricao}
                    onChange={(e) => setNovoMedicamento({ ...novoMedicamento, descricao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosagem</label>
                  <input
                    type="text"
                    value={novoMedicamento.dosagem}
                    onChange={(e) => setNovoMedicamento({ ...novoMedicamento, dosagem: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                  <input
                    type="text"
                    value={novoMedicamento.frequencia}
                    onChange={(e) => setNovoMedicamento({ ...novoMedicamento, frequencia: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select
                    value={novoMedicamento.paciente_id}
                    onChange={(e) => setNovoMedicamento({ ...novoMedicamento, paciente_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading.submit}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading.submit ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Criar Medicamento'
                  )}
                </button>
              </form>
            )}

            {activeTab === 'consultas' && (
              <form onSubmit={handleSubmitConsulta} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select
                    value={novaConsulta.paciente_id}
                    onChange={(e) => setNovaConsulta({ ...novaConsulta, paciente_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={novaConsulta.descricao}
                    onChange={(e) => setNovaConsulta({ ...novaConsulta, descricao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading.submit}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading.submit ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Criar Consulta'
                  )}
                </button>
              </form>
            )}

            {activeTab === 'gastos' && (
              <form onSubmit={handleSubmitGasto} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select
                    value={novoGasto.paciente_id}
                    onChange={(e) => setNovoGasto({ ...novoGasto, paciente_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={novoGasto.descricao}
                    onChange={(e) => setNovoGasto({ ...novoGasto, descricao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoGasto.valor}
                    onChange={(e) => setNovoGasto({ ...novoGasto, valor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={novoGasto.categoria}
                    onChange={(e) => setNovoGasto({ ...novoGasto, categoria: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="consulta">Consulta</option>
                    <option value="medicamento">Medicamento</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading.submit}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading.submit ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Registrar Gasto'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Listas */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {activeTab === 'pacientes' && 'Lista de Pacientes'}
              {activeTab === 'medicamentos' && 'Lista de Medicamentos'}
              {activeTab === 'consultas' && 'Lista de Consultas'}
              {activeTab === 'gastos' && 'Lista de Gastos'}
            </h2>

            {activeTab === 'pacientes' && (
              <div className="space-y-4">
                {loading.pacientes ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  pacientes.map((paciente) => (
                    <div key={paciente.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{paciente.nome}</h3>
                      <p className="text-gray-600">{paciente.email}</p>
                      <button
                        onClick={() => handleVerProntuario(paciente)}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Ver Prontuário
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'medicamentos' && (
              <div className="space-y-4">
                {loading.medicamentos ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  medicamentos.map((medicamento) => (
                    <div key={medicamento.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{medicamento.nome}</h3>
                          <p className="text-gray-600">{medicamento.descricao}</p>
                          <p className="text-sm text-gray-500">
                            Dosagem: {medicamento.dosagem} - Frequência: {medicamento.frequencia}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMedicamento(medicamento.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'consultas' && (
              <div className="space-y-4">
                {loading.consultas ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  consultas.map((consulta) => (
                    <div key={consulta.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Consulta com {pacientes.find(p => p.id === consulta.paciente_id)?.nome}
                          </h3>
                          <p className="text-gray-600">{consulta.descricao}</p>
                          <p className="text-sm text-gray-500">
                            Data: {new Date(consulta.data).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteConsulta(consulta.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'gastos' && (
              <div className="space-y-4">
                {loading.gastos ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  gastos.map((gasto) => (
                    <div key={gasto.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {gasto.descricao} - {pacientes.find(p => p.id === gasto.paciente_id)?.nome}
                          </h3>
                          <p className="text-gray-600">R$ {gasto.valor.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            Categoria: {gasto.categoria} - Data: {new Date(gasto.data).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteGasto(gasto.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add the modal at the end of the component, before the final closing div */}
        {selectedPaciente && (
          <ProntuarioModal
            isOpen={isProntuarioOpen}
            onClose={() => setIsProntuarioOpen(false)}
            paciente={selectedPaciente}
            medicamentos={medicamentos.filter(m => m.paciente_id === selectedPaciente.id)}
            consultas={consultas.filter(c => c.paciente_id === selectedPaciente.id)}
            gastos={gastos.filter(g => g.paciente_id === selectedPaciente.id)}
          />
        )}
      </div>
    </div>
  );
} 