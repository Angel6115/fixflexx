import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ClienteDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [total, setTotal] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [completadas, setCompletadas] = useState(0);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("No se pudo obtener el usuario actual");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("solicitudes")
        .select("*")
        .eq("cliente_id", user.id);

      if (error) {
        setError("Error cargando solicitudes");
        setLoading(false);
        return;
      }

      setSolicitudes(data);
      setTotal(data.length);
      setPendientes(data.filter((s) => s.estado === "pendiente").length);
      setCompletadas(data.filter((s) => s.estado === "completada").length);
      setLoading(false);
    };

    fetchSolicitudes();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-xl mb-4">Panel del Cliente</h2>

      {loading ? (
        <p className="text-gray-600">Cargando solicitudes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold mb-1">📝 Total de solicitudes</h3>
            <p className="text-2xl font-bold text-yellow-600">{total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-orange-400">
            <h3 className="text-lg font-semibold mb-1">⏳ Pendientes</h3>
            <p className="text-2xl font-bold text-orange-600">{pendientes}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-1">✅ Completadas</h3>
            <p className="text-2xl font-bold text-green-600">{completadas}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClienteDashboard;
