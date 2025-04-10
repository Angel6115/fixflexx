import React, { useEffect, useState } from 'react'
import DashboardBase from '../componentes/DashboardBase'
import TarjetaResumen from '../componentes/TarjetaResumen'
import { supabase } from '../lib/supabaseClient'

function TecnicoDashboard() {
  const [stats, setStats] = useState({
    pendientesGlobal: 0,
    asignadas: 0,
    completadas: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const pendientesGlobal = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente')

      const asignadas = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'asignado')
        .eq('tecnico_id', user.id)

      const completadas = await supabase
        .from('solicitudes')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'completada')
        .eq('tecnico_id', user.id)

      setStats({
        pendientesGlobal: pendientesGlobal.count,
        asignadas: asignadas.count,
        completadas: completadas.count
      })
    }

    fetchStats()
  }, [])

  return (
    <DashboardBase>
      <h2>Panel del Técnico</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
        <TarjetaResumen titulo="Pendientes por aceptar" valor={stats.pendientesGlobal} icono="🕐" color="#f59e0b" />
        <TarjetaResumen titulo="Asignadas a ti" valor={stats.asignadas} icono="🛠️" />
        <TarjetaResumen titulo="Completadas por ti" valor={stats.completadas} icono="✅" color="#10b981" />
      </div>
    </DashboardBase>
  )
}

export default TecnicoDashboard
