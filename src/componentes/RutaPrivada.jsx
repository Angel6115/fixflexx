import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function RutaPrivada({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data } = await supabase.auth.getSession()
      setUsuario(data.session?.user || null)
      setCargando(false)
    }

    obtenerSesion()
  }, [])

  if (cargando) return <p>Cargando...</p>

  return usuario ? children : <Navigate to="/" />
}

export default RutaPrivada
