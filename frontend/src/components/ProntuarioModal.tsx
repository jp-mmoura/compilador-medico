import React from 'react';

interface Paciente {
  id: number;
  nome: string;
  email: string;
}

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

interface Gasto {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  medico_id: number;
  medico: {
    nome: string;
  };
}

interface ProntuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente;
  medicamentos: Medicamento[];
  consultas: Consulta[];
  gastos: Gasto[];
}

export function ProntuarioModal({ isOpen, onClose, paciente, medicamentos, consultas, gastos }: ProntuarioModalProps) {
  if (!isOpen) return null;

  // Ordenar por data (mais recente primeiro)
  const sortedConsultas = [...consultas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  const sortedGastos = [...gastos].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-red-600">Prontuário do Paciente</h2>
              <p className="text-gray-600">{paciente.nome}</p>
              <p className="text-sm text-gray-500">{paciente.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Medicamentos Atuais */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Medicamentos em Uso</h3>
            <div className="space-y-4">
              {medicamentos.length === 0 ? (
                <p className="text-gray-500">Nenhum medicamento registrado</p>
              ) : (
                medicamentos.map((medicamento) => (
                  <div key={medicamento.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{medicamento.nome}</h4>
                    <p className="text-gray-600">{medicamento.descricao}</p>
                    <p className="text-sm text-gray-500">
                      Dosagem: {medicamento.dosagem} - Frequência: {medicamento.frequencia}
                    </p>
                    <p className="text-sm text-gray-500">
                      Prescrito por: {medicamento.medico?.nome || 'Médico não especificado'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico de Consultas */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Consultas</h3>
            <div className="space-y-4">
              {sortedConsultas.length === 0 ? (
                <p className="text-gray-500">Nenhuma consulta registrada</p>
              ) : (
                sortedConsultas.map((consulta) => (
                  <div key={consulta.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          Data: {new Date(consulta.data).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 mt-1">{consulta.descricao}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Médico: {consulta.medico?.nome || 'Médico não especificado'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico de Gastos */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Gastos</h3>
            <div className="space-y-4">
              {sortedGastos.length === 0 ? (
                <p className="text-gray-500">Nenhum gasto registrado</p>
              ) : (
                sortedGastos.map((gasto) => (
                  <div key={gasto.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          Data: {new Date(gasto.data).toLocaleDateString()}
                        </p>
                        <p className="text-gray-900 font-medium mt-1">{gasto.descricao}</p>
                        <p className="text-red-600 font-medium mt-1">R$ {gasto.valor.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Categoria: {gasto.categoria}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Registrado por: {gasto.medico?.nome || 'Médico não especificado'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 