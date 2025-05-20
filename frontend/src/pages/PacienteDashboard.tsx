import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Estatisticas {
  gasto_total: number;
  gasto_consultas: number;
  gasto_medicamentos: number;
  total_consultas: number;
  dados_grafico: Array<{
    data: string;
    valor_consulta: number;
    valor_medicamento: number;
    total: number;
  }>;
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
  descricao: string;
  data: string;
  medico_id: number;
  medico: {
    nome: string;
  };
}

interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

export function PacienteDashboard() {
  const { user, token } = useAuth();
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState({
    medicamentos: false,
    consultas: false,
    gastos: false
  });

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/estatisticas/paciente/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setEstatisticas(data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    if (user && token) {
      fetchEstatisticas();
    }
  }, [user, token]);

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
      setError('Erro ao buscar medicamentos');
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
      setError('Erro ao buscar consultas');
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
      setError('Erro ao buscar gastos');
    } finally {
      setLoading(prev => ({ ...prev, gastos: false }));
    }
  };

  useEffect(() => {
    if (token) {
      fetchMedicamentos();
      fetchConsultas();
      fetchGastos();
    }
  }, [token]);

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Por favor, faça login para acessar o dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estatisticas) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 4000,
      easing: 'easeInOutQuart',
      x: {
        type: 'number',
        easing: 'easeInOutQuart',
        duration: 4000,
        from: 0,
        delay: (context: any) => context.dataIndex * 300
      },
      y: {
        type: 'number',
        easing: 'easeInOutQuart',
        duration: 4000,
        from: 0,
        delay: (context: any) => context.dataIndex * 300
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#222',
          font: { size: 14, weight: 'bold' },
          boxWidth: 12,
          padding: 15
        },
      },
      title: {
        display: true,
        text: 'Evolução dos Gastos',
        color: '#e11d48',
        font: { size: 20, weight: 'bold' },
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#e11d48',
        bodyColor: '#222',
        borderColor: '#e11d48',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: { 
          color: '#64748b', 
          font: { size: 13 },
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: '#f1f5f9' },
      },
      y: {
        ticks: { 
          color: '#64748b', 
          font: { size: 13 },
          callback: function(value: any) {
            return `R$ ${value}`;
          }
        },
        grid: { color: '#f1f5f9' },
      },
    },
  };

  const chartData = {
    labels: estatisticas.dados_grafico.map(d => d.data),
    datasets: [
      {
        label: 'Valor Total',
        data: estatisticas.dados_grafico.map(d => d.total),
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225,29,72,0.1)',
        tension: 0.3,
        pointBackgroundColor: '#e11d48',
        pointBorderColor: '#fff',
        pointRadius: 5,
        fill: true,
        animation: {
          delay: (context: any) => context.dataIndex * 300,
          duration: 4000,
          easing: 'easeInOutQuart',
          from: 0
        }
      },
      {
        label: 'Valor Consulta',
        data: estatisticas.dados_grafico.map(d => d.valor_consulta),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.08)',
        tension: 0.3,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointRadius: 4,
        fill: true,
        animation: {
          delay: (context: any) => context.dataIndex * 300,
          duration: 4000,
          easing: 'easeInOutQuart',
          from: 0
        }
      },
      {
        label: 'Valor Medicamento',
        data: estatisticas.dados_grafico.map(d => d.valor_medicamento),
        borderColor: '#64748b',
        backgroundColor: 'rgba(100,116,139,0.08)',
        tension: 0.3,
        pointBackgroundColor: '#64748b',
        pointBorderColor: '#fff',
        pointRadius: 4,
        fill: true,
        animation: {
          delay: (context: any) => context.dataIndex * 300,
          duration: 4000,
          easing: 'easeInOutQuart',
          from: 0
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center drop-shadow">Dashboard do Paciente</h1>
        
        {/* Mensagens de feedback */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <h3 className="text-lg font-medium text-gray-700">Gasto Total</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">R$ {estatisticas.gasto_total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-700">Gasto em Consultas</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">R$ {estatisticas.gasto_consultas.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-400">
            <h3 className="text-lg font-medium text-gray-700">Gasto em Medicamentos</h3>
            <p className="mt-2 text-3xl font-bold text-gray-600">R$ {estatisticas.gasto_medicamentos.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Evolução dos Gastos</h2>
          <div className="h-[300px] sm:h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Medicamentos */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">Meus Medicamentos</h2>
            <div className="space-y-4">
              {loading.medicamentos ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : medicamentos.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum medicamento registrado</p>
              ) : (
                medicamentos.map((medicamento) => (
                  <div key={medicamento.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{medicamento.nome}</h3>
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

          {/* Consultas */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">Minhas Consultas</h2>
            <div className="space-y-4">
              {loading.consultas ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : consultas.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhuma consulta registrada</p>
              ) : (
                consultas.map((consulta) => (
                  <div key={consulta.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">
                      Consulta com {consulta.medico?.nome || 'Médico não especificado'}
                    </h3>
                    <p className="text-gray-600">{consulta.descricao}</p>
                    <p className="text-sm text-gray-500">
                      Data: {new Date(consulta.data).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gastos */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">Meus Gastos</h2>
            <div className="space-y-4">
              {loading.gastos ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : gastos.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum gasto registrado</p>
              ) : (
                gastos.map((gasto) => (
                  <div key={gasto.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{gasto.descricao}</h3>
                    <p className="text-gray-600">R$ {gasto.valor.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Categoria: {gasto.categoria} - Data: {new Date(gasto.data).toLocaleDateString()}
                    </p>
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