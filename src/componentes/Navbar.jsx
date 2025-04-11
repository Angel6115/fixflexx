import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo + Nombre */}
      <div className="flex items-center space-x-3">
        <img
          src="/logoFixFlexx.jpg"
          alt="FixFlexx Logo"
          className="w-16 h-16 object-contain"
        />
        <span className="text-3xl font-bold text-purple-700">FixFlexx</span>
      </div>

      {/* Navegación */}
      <div className="flex items-center space-x-6">
        <Link to="/cliente" className="text-gray-700 hover:text-purple-600 font-medium">
          Dashboard
        </Link>
        <Link to="/crear-solicitud" className="text-gray-700 hover:text-purple-600 font-medium">
          Crear Solicitud
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
