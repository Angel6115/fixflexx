import React from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "./paginas/lib/supabaseClient";

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">FixFlexx</h1>
        <nav className="space-y-4">
          <Link to="/cliente" className="block text-gray-800 hover:text-blue-600">
            🧾 Mis Solicitudes
          </Link>
          <Link to="/crear-solicitud" className="block text-gray-800 hover:text-blue-600">
            ➕ Crear Solicitud
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline mt-10"
          >
            🚪 Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;
