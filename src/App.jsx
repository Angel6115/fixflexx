import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/paginas/Login';
import Register from './componentes/paginas/Register';
import ClienteDashboard from './componentes/paginas/ClienteDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
