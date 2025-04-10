import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../componentes/Header'
import Toast from '../componentes/Toast'
import { estiloEstado } from '../utils/estiloEstado'

function SolicitudesPendientes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMensaje, setToastMensaje] = useState('')

  useEffect(() => {
    obtenerSolicitudes()

    const canal = supabase
      .channel('solicitudes-pendientes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'solicitudes',
          filter: 'estado=eq.pendiente'
        },
        (payload) => {
          const nueva = payload.new
          setSolicitudes((prev) => [nueva, ...prev])
          setToastMensaje('Nueva solicitud recibida')
          setToastVisible(true)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  const obtenerSolicitudes = async () => {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false })

    if (!error) setSolicitudes(data)
  }

  const aceptarSolicitud = async (idSolicitud) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('solicitudes')
      .update({
        estado: 'asignado',
        tecnico_id: user.id
      })
      .eq('id', idSolicitud)

    if (!error) {
      obtenerSolicitudes()
    }
  }

  return (
    <div>
      <Toast
        mensaje={toastMensaje}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <Header />
      <div style={{ padding: '2rem' }}>
        <h2>Solicitudes pendientes</h2>
        {solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes en este momento.</p>
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
                  <button onClick={() => aceptarSolicitud(sol.id)} style={{
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                    Aceptar solicitud
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

export default SolicitudesPendientes
