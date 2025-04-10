import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function RegistrarTecnico() {
  const [nombre, setNombre] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensaje('Debe iniciar sesión')
      return
    }

    const { error } = await supabase.from('tecnicos').insert([
      {
        id: user.id,
        nombre,
        especialidad,
        ubicacion,
        disponible,
      },
    ])

    if (error) {
      setMensaje('Error al guardar: ' + error.message)
    } else {
      setMensaje('Perfil guardado con éxito')
      setTimeout(() => navigate('/tecnico'), 1500)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registrar perfil de técnico</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        /><br /><br />

        <input
          type="text"
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          required
        /><br /><br />

        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        /><br /><br />

        <label>
          ¿Disponible?{' '}
          <input
            type="checkbox"
            checked={disponible}
            onChange={() => setDisponible(!disponible)}
          />
        </label><br /><br />

        <button type="submit">Guardar perfil</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default RegistrarTecnico
