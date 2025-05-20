import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import { PacienteDashboard } from './pages/PacienteDashboard';
import { MedicoDashboard } from './pages/MedicoDashboard';
import { ProntuarioPaciente } from './pages/ProntuarioPaciente';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/" />;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/medico"
            element={
              <PrivateRoute>
                <MedicoDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/paciente"
            element={
              <PrivateRoute>
                <PacienteDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/prontuario/:id"
            element={
              <PrivateRoute>
                <ProntuarioPaciente />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
