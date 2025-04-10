import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

function CrearSolicitud() {
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Debes iniciar sesión para enviar una solicitud.');
      setEnviando(false);
      return;
    }

    const { error: insertError } = await supabase.from('solicitudes').insert([
      {
        descripcion,
        estado: 'pendiente',
        cliente_id: user.id,
      },
    ]);

    setEnviando(false);

    if (insertError) {
      setError('Hubo un error al enviar tu solicitud.');
      return;
    }

    navigate('/cliente');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Crear nueva solicitud
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe tu problema o solicitud..."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            {enviando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearSolicitud;
