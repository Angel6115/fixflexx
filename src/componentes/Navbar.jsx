import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [rol, setRol] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const obtenerRol = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single()
        setRol(data?.rol)
      }
    }

    obtenerRol()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={menuButtonStyle}
      >
        ☰
      </button>

      <nav style={{
        position: 'fixed',
        top: 0,
        left: open ? 0 : '-100%',
        width: '260px',
        height: '100%',
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        transition: 'left 0.3s ease',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#22C55E', marginBottom: '2rem' }}>FixFlexx</h2>

        {rol === 'cliente' && (
          <>
            <Link to="/cliente" style={linkStyle}>🏠 Dashboard</Link>
            <Link to="/cliente/crear" style={linkStyle}>📝 Nueva Solicitud</Link>
            <Link to="/cliente/solicitudes" style={linkStyle}>📋 Mis Solicitudes</Link>
          </>
        )}

        {rol === 'tecnico' && (
          <>
            <Link to="/tecnico" style={linkStyle}>🏠 Dashboard</Link>
            <Link to="/tecnico/pendientes" style={linkStyle}>🕐 Pendientes</Link>
            <Link to="/tecnico/asignadas" style={linkStyle}>🛠️ Asignadas</Link>
            <Link to="/tecnico/completadas" style={linkStyle}>✅ Completadas</Link>
          </>
        )}

        <Link to="/perfil" style={linkStyle}>👤 Mi perfil</Link>
        <button onClick={logout} style={{
          ...linkStyle,
          background: '#DC2626',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          marginTop: '2rem',
          borderRadius: '6px',
          padding: '0.5rem 1rem'
        }}>
          🚪 Cerrar sesión
        </button>
      </nav>
    </>
  )
}

const linkStyle = {
  display: 'block',
  marginBottom: '1rem',
  color: 'white',
  textDecoration: 'none',
  fontSize: '1rem',
  padding: '0.5rem',
  borderRadius: '6px',
  backgroundColor: '#1F2937'
}

const menuButtonStyle = {
  position: 'fixed',
  top: 20,
  left: 20,
  zIndex: 1001,
  background: '#4F46E5',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1.2rem'
}

export default Navbar
