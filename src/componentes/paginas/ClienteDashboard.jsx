import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import DashboardLayout from "../DashboardLayout";

function ClienteDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }
      fetchSolicitudes(user.id);
    };

    getUser();
  }, []);

  const fetchSolicitudes = async (userId) => {
    const { data, error } = await supabase
      .from("solicitudes")
      .select("*")
      .eq("cliente_id", userId);

    if (error) console.error("Error:", error);
    else setSolicitudes(data);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Solicitudes Recientes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">#{s.id}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.descripcion}</p>
              <p className="text-xs text-gray-400 mt-1">Estado: {s.estado}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ClienteDashboard;
