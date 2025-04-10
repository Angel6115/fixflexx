import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function CrearSolicitud() {
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('electricidad')
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMensaje('Debes iniciar sesión para crear una solicitud.')
      return
    }

    const { error } = await supabase.from('solicitudes').insert([{
      cliente_id: user.id,
      descripcion,
      categoria,
      estado: 'pendiente',
      created_at: new Date().toISOString()
    }])

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('Solicitud enviada con éxito.')
      setTimeout(() => navigate('/cliente'), 1500)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Crear nueva solicitud</h2>
      <form onSubmit={handleSubmit}>
        <label>Descripción del problema:</label><br />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows="4"
          cols="50"
        /><br /><br />

        <label>Categoría:</label><br />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="electricidad">Electricidad</option>
          <option value="plomeria">Plomería</option>
          <option value="pintura">Pintura</option>
          <option value="tecnologia">Tecnología</option>
        </select><br /><br />

        <button type="submit">Enviar solicitud</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default CrearSolicitud
