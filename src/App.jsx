import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/paginas/Login';
import Register from './componentes/paginas/Register';
import ClienteDashboard from './componentes/paginas/ClienteDashboard';
import CrearSolicitud from './componentes/paginas/CrearSolicitud';
import Navbar from './componentes/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/cliente"
          element={
            <>
              <Navbar />
              <ClienteDashboard />
            </>
          }
        />
        <Route
          path="/crear-solicitud"
          element={
            <>
              <Navbar />
              <CrearSolicitud />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
