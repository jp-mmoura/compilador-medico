import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: 'medico' | 'paciente';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      console.log('Iniciando login...');
      const response = await fetch('http://localhost:8000/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: senha,
        }),
      });

      console.log('Resposta do token:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData?.detail || 'Credenciais inválidas');
      }

      const data = await response.json();
      console.log('Token recebido:', data);
      const token = data.access_token;

      // Buscar dados do usuário
      console.log('Buscando dados do usuário...');
      const userResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Resposta dos dados do usuário:', userResponse.status);
      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => null);
        console.error('Erro ao buscar dados do usuário:', errorData);
        throw new Error(errorData?.detail || 'Erro ao buscar dados do usuário');
      }

      const userData = await userResponse.json();
      console.log('Dados do usuário recebidos:', userData);

      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Atualizar estado
      setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Erro no login:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 