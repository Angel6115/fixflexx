import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

function ClienteDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    completadas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: user } = await supabase.auth.getUser();

      const total = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('cliente_id', user?.user?.id);

      const pendientes = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('cliente_id', user?.user?.id)
        .eq('estado', 'pendiente');

      const completadas = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('cliente_id', user?.user?.id)
        .eq('estado', 'completada');

      setStats({
        total: total.count || 0,
        pendientes: pendientes.count || 0,
        completadas: completadas.count || 0,
      });
    };

    fetchStats();
  }, []);

  const handleNuevaSolicitud = () => {
    navigate('/crear-solicitud');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📊 Panel del Cliente</h1>

      <button onClick={handleNuevaSolicitud} style={styles.boton}>
        ✍️ Crear nueva solicitud
      </button>

      <div style={styles.cardGrid}>
        <StatCard title="Total de solicitudes" value={stats.total} color="#2563EB" emoji="📋" />
        <StatCard title="Pendientes" value={stats.pendientes} color="#F59E0B" emoji="⏳" />
        <StatCard title="Completadas" value={stats.completadas} color="#10B981" emoji="✅" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color, emoji }) {
  return (
    <div style={{ ...styles.card, borderColor: color }}>
      <span style={styles.emoji}>{emoji}</span>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
    background: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#111827',
  },
  boton: {
    backgroundColor: '#2563EB',
    color: '#fff',
    padding: '0.8rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    transition: 'all 0.2s ease-in-out',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
  },
  card: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '1.5rem',
    minWidth: '250px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
  emoji: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: '#374151',
    marginBottom: '0.3rem',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
};

export default ClienteDashboard;
