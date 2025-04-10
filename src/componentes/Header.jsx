import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Header() {
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#4F46E5',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logoFixFlexx.png" alt="FixFlexx" style={{ width: '40px', marginRight: '1rem' }} />
        <h3 style={{ margin: 0 }}>FixFlexx</h3>
      </div>
      <button onClick={logout} style={{
        backgroundColor: '#22C55E',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer'
      }}>
        Cerrar sesión
      </button>
    </header>
  )
}

export default Header
