import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Medicamento {
  id: number;
  nome: string;
  descricao: string;
  dosagem: string;
  frequencia: string;
  medico_id: number;
  medico: {
    nome: string;
  };
}

interface Consulta {
  id: number;
  data: string;
  descricao: string;
  medico_id: number;
  medico: {
    nome: string;
  };
}

interface Paciente {
  id: number;
  nome: string;
  email: string;
}

export function ProntuarioPaciente() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPacienteData();
  }, [id, token]);

  const fetchPacienteData = async () => {
    try {
      setLoading(true);
      setError('');

      // Buscar dados do paciente
      const pacienteResponse = await fetch(`http://localhost:8000/api/v1/pacientes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!pacienteResponse.ok) throw new Error('Erro ao buscar dados do paciente');
      const pacienteData = await pacienteResponse.json();
      setPaciente(pacienteData);

      // Buscar medicamentos do paciente
      const medicamentosResponse = await fetch(`http://localhost:8000/api/v1/medicamentos/paciente/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!medicamentosResponse.ok) throw new Error('Erro ao buscar medicamentos');
      const medicamentosData = await medicamentosResponse.json();
      setMedicamentos(medicamentosData);

      // Buscar consultas do paciente
      const consultasResponse = await fetch(`http://localhost:8000/api/v1/consultas/paciente/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!consultasResponse.ok) throw new Error('Erro ao buscar consultas');
      const consultasData = await consultasResponse.json();
      setConsultas(consultasData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do paciente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center drop-shadow">
          Prontuário do Paciente
        </h1>

        {/* Dados do Paciente */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Dados do Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-medium">{paciente?.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{paciente?.email}</p>
            </div>
          </div>
        </div>

        {/* Medicamentos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Medicamentos Prescritos</h2>
          <div className="space-y-4">
            {medicamentos.map((medicamento) => (
              <div key={medicamento.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{medicamento.nome}</h3>
                <p className="text-gray-600">{medicamento.descricao}</p>
                <p className="text-sm text-gray-500">
                  Dosagem: {medicamento.dosagem} - Frequência: {medicamento.frequencia}
                </p>
                <p className="text-sm text-gray-500">
                  Prescrito por: {medicamento.medico.nome}
                </p>
              </div>
            ))}
            {medicamentos.length === 0 && (
              <p className="text-gray-500 text-center">Nenhum medicamento prescrito</p>
            )}
          </div>
        </div>

        {/* Consultas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Histórico de Consultas</h2>
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div key={consulta.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  Consulta em {new Date(consulta.data).toLocaleDateString()}
                </h3>
                <p className="text-gray-600">{consulta.descricao}</p>
                <p className="text-sm text-gray-500">
                  Médico: {consulta.medico.nome}
                </p>
              </div>
            ))}
            {consultas.length === 0 && (
              <p className="text-gray-500 text-center">Nenhuma consulta registrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 