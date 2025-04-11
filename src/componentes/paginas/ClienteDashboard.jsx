import React, { useEffect, useState } from 'react';
import supabase from './lib/supabaseClient';

function ClienteDashboard() {
  const [user, setUser] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchUserAndSolicitudes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('solicitudes')
          .select('*')
          .eq('cliente_id', user.id);

        if (!error) setSolicitudes(data);
      }
    };

    fetchUserAndSolicitudes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Bienvenido, {user?.email}
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-center text-purple-700 mb-2">
          Tus Solicitudes
        </h3>

        {solicitudes.length === 0 ? (
          <p className="text-center text-gray-500">No tienes solicitudes registradas.</p>
        ) : (
          <ul className="space-y-3">
            {solicitudes.map((solicitud) => (
              <li
                key={solicitud.id}
                className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{solicitud.descripcion}</p>
                  <p className="text-sm text-gray-600">{solicitud.estado}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClienteDashboard;
