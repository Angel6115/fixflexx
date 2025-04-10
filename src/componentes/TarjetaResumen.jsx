import React from 'react'

function TarjetaResumen({ titulo, valor, color = '#4F46E5', icono = '📦' }) {
  return (
    <div style={{
      background: color,
      color: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      flex: '1',
      margin: '0.5rem',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <div style={{ fontSize: '2rem' }}>{icono}</div>
      <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{titulo}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{valor}</div>
    </div>
  )
}

export default TarjetaResumen
