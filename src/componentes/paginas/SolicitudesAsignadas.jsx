import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../componentes/Header'
import { estiloEstado } from '../utils/estiloEstado'

function SolicitudesAsignadas() {
  const [solicitudes, setSolicitudes] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    obtenerSolicitudes()
  }, [])

  const obtenerSolicitudes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('estado', 'asignado')
      .eq('tecnico_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setSolicitudes(data)
    }
  }

  const marcarCompletada = async (idSolicitud) => {
    const { error } = await supabase
      .from('solicitudes')
      .update({ estado: 'completada' })
      .eq('id', idSolicitud)

    if (error) {
      setMensaje('Error al completar: ' + error.message)
    } else {
      setMensaje('Solicitud completada ✅')
      obtenerSolicitudes()
    }
  }

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h2>Mis solicitudes asignadas</h2>
        {mensaje && <p>{mensaje}</p>}

        {solicitudes.length === 0 ? (
          <p>No tienes solicitudes asignadas aún.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {solicitudes.map((sol) => {
              const estilo = estiloEstado(sol.estado)
              return (
                <li key={sol.id} style={{
                  background: estilo.fondo,
                  color: estilo.color,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <strong>{estilo.icono} Categoría:</strong> {sol.categoria}<br />
                  <strong>Descripción:</strong> {sol.descripcion}<br />
                  <strong>Fecha:</strong> {new Date(sol.created_at).toLocaleString()}<br />
                  <strong>Estado:</strong> {sol.estado}<br /><br />
                  <button onClick={() => marcarCompletada(sol.id)} style={{
                    backgroundColor: '#22C55E',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                    Marcar como completada
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SolicitudesAsignadas
