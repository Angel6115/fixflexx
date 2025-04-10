import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './componentes/paginas/Login';
import Register from './componentes/paginas/Register';
import ClienteDashboard from './componentes/paginas/ClienteDashboard';
// Puedes agregar más vistas aquí según necesites
// import TecnicoDashboard from './componentes/paginas/TecnicoDashboard';
// import RutaPrivada from './componentes/RutaPrivada';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
        {/* <Route path="/tecnico" element={<TecnicoDashboard />} /> */}
        {/* <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
