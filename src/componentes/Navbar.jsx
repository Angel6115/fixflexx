import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoFixFlexx.jpg';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="FixFlexx Logo"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <Link
            to="/cliente"
            className="text-2xl md:text-3xl font-extrabold text-purple-700 hover:text-purple-800 transition"
          >
            FixFlexx
          </Link>
        </div>

        {/* Menú hamburguesa */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Enlaces en pantallas grandes */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/cliente"
            className="text-md font-medium text-gray-700 hover:text-blue-700 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/crear-solicitud"
            className="text-md font-medium text-gray-700 hover:text-blue-700 transition"
          >
            Crear Solicitud
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <Link
            to="/cliente"
            className="block text-md font-medium text-gray-700 hover:text-blue-700"
          >
            Dashboard
          </Link>
          <Link
            to="/crear-solicitud"
            className="block text-md font-medium text-gray-700 hover:text-blue-700"
          >
            Crear Solicitud
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
