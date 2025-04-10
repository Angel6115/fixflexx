import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./lib/supabaseClient";

function CrearSolicitud() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const cliente_id = user.data.user?.id;

    const { data, error } = await supabase.from("solicitudes").insert([
      {
        descripcion,
        categoria,
        cliente_id,
      },
    ]);

    if (error) {
      setMensaje("Error al crear solicitud: " + error.message);
    } else {
      setMensaje("¡Solicitud creada exitosamente!");
      setTimeout(() => navigate("/cliente"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Crear Solicitud</h2>
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        <input
          type="text"
          placeholder="Descripción"
          className="w-full p-2 mb-2 border rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          className="w-full p-2 mb-4 border rounded"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

export default CrearSolicitud;
