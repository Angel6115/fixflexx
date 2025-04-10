import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../componentes/Header'
import { estiloEstado } from '../utils/estiloEstado'

function SolicitudesCliente() {
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
      .eq('cliente_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje('Error al cargar: ' + error.message)
    } else {
      setSolicitudes(data)
    }
  }

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h2>Mis solicitudes</h2>
        {mensaje && <p>{mensaje}</p>}

        {solicitudes.length === 0 ? (
          <p>Aún no has creado solicitudes.</p>
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
                  <strong>Estado:</strong> {sol.estado}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SolicitudesCliente
