import React, { useEffect, useState } from "react";
import DashboardBase from "../DashboardBase";
import TarjetaResumen from "../TarjetaResumen";
import { supabase } from "./lib/supabaseClient";

function ClienteDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    completadas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const total = await supabase
        .from("solicitudes")
        .select("*", { count: "exact", head: true })
        .eq("cliente_id", user.id);

      const pendientes = await supabase
        .from("solicitudes")
        .select("*", { count: "exact", head: true })
        .eq("cliente_id", user.id)
        .eq("estado", "pendiente");

      const completadas = await supabase
        .from("solicitudes")
        .select("*", { count: "exact", head: true })
        .eq("cliente_id", user.id)
        .eq("estado", "completada");

      setStats({
        total: total.count,
        pendientes: pendientes.count,
        completadas: completadas.count,
      });
    };

    fetchStats();
  }, []);

  return (
    <DashboardBase>
      <h2>Panel del Cliente</h2>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
        <TarjetaResumen
          titulo="Total de solicitudes"
          valor={stats.total}
          icono="📋"
        />
        <TarjetaResumen
          titulo="Pendientes"
          valor={stats.pendientes}
          color="#f59e0b"
          icono="⏳"
        />
        <TarjetaResumen
          titulo="Completadas"
          valor={stats.completadas}
          color="#10b981"
          icono="✅"
        />
      </div>
    </DashboardBase>
  );
}

export default ClienteDashboard;
