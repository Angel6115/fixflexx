import React from 'react'
import { useLocation } from 'react-router-dom'

function Breadcrumbs() {
  const location = useLocation()
  const partes = location.pathname.split('/').filter(Boolean)

  const construirRuta = (index) => {
    return '/' + partes.slice(0, index + 1).join('/')
  }

  return (
    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
      <span>🏠 </span>
      {partes.map((parte, i) => (
        <span key={i}>
          <span style={{ margin: '0 0.25rem' }}>/</span>
          <a href={construirRuta(i)} style={{ color: '#4F46E5', textDecoration: 'none' }}>
            {parte}
          </a>
        </span>
      ))}
    </div>
  )
}

export default Breadcrumbs
