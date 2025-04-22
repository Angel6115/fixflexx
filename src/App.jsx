import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './componentes/paginas/Login';
import Register from './componentes/paginas/Register';
import ClienteDashboard from './componentes/paginas/ClienteDashboard';
import CrearSolicitud from './componentes/paginas/CrearSolicitud';
import Navbar from './componentes/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para el inicio de sesión

  const loginHandler = () => {
    setIsLoggedIn(true); // Simula un inicio de sesión
  };

  const logoutHandler = () => {
    setIsLoggedIn(false); // Cierra la sesión
  };

  return (
    <Routes>
      {/* Ruta de Login */}
      <Route
        path="/"
        element={<Login onLogin={loginHandler} />}
      />

      {/* Ruta de Registro */}
      <Route
        path="/registro"
        element={<Register />}
      />

      {/* Ruta de Cliente Dashboard, solo accesible si está logueado */}
      <Route
        path="/cliente"
        element={
          isLoggedIn ? (
            <>
              <Navbar onLogout={logoutHandler} />
              <ClienteDashboard />
            </>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Ruta para crear solicitud */}
      <Route
        path="/crear-solicitud"
        element={
          isLoggedIn ? (
            <>
              <Navbar onLogout={logoutHandler} />
              <CrearSolicitud />
            </>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Redirección a la página de login si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
