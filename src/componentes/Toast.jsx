import React, { useEffect } from 'react'

function Toast({ mensaje, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), 4000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: visible ? '1rem' : '-400px',
      background: '#4F46E5',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      transition: 'right 0.5s ease',
      zIndex: 2000,
      fontSize: '1rem'
    }}>
      🔔 {mensaje}
    </div>
  )
}

export default Toast
