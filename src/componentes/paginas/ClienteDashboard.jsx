import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function ClienteDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('cliente_id', user.id);

      if (!error) setSolicitudes(data);
    };

    obtenerSolicitudes();
  }, [navigate]);

  const total = solicitudes.length;
  const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
  const completadas = solicitudes.filter(s => s.estado === 'completada').length;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <h2>Panel del Cliente</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
          <h3>Total de solicitudes</h3>
          <p>{total}</p>
        </div>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
          <h3>Pendientes</h3>
          <p>{pendientes}</p>
        </div>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
          <h3>Completadas</h3>
          <p>{completadas}</p>
        </div>
      </div>
    </div>
  );
}

export default ClienteDashboard;
