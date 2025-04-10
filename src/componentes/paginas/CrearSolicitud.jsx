import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

function CrearSolicitud() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    categoria: '',
  });
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviado(false);

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      setError('Usuario no autenticado');
      return;
    }

    const { error: insertError } = await supabase.from('solicitudes').insert([
      {
        cliente_id: user.user.id,
        titulo: form.titulo,
        descripcion: form.descripcion,
        prioridad: form.prioridad,
        categoria: form.categoria,
        estado: 'pendiente',
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setEnviado(true);
      setTimeout(() => navigate('/cliente'), 1500);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.titulo}>📝 Crear nueva solicitud</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="titulo"
          type="text"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción detallada"
          value={form.descripcion}
          onChange={handleChange}
          required
          style={{ ...styles.input, height: '100px' }}
        />
        <select
          name="prioridad"
          value={form.prioridad}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="alta">Alta 🔥</option>
          <option value="media">Media 🟡</option>
          <option value="baja">Baja 🧊</option>
        </select>
        <input
          name="categoria"
          type="text"
          placeholder="Categoría (ej: Eléctrico, Plomería)"
          value={form.categoria}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.boton}>Enviar Solicitud</button>
        {error && <p style={styles.error}>❌ {error}</p>}
        {enviado && <p style={styles.exito}>✅ Solicitud enviada con éxito</p>}
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
  },
  titulo: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#1f2937',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#f3f4f6',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  boton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '0.8rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
  },
  exito: {
    color: '#16a34a',
    textAlign: 'center',
  },
};

export default CrearSolicitud;
