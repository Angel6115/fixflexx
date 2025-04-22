import React, { useState } from 'react';

function ClienteDashboard() {
  const [servicio, setServicio] = useState('Normal');
  const [pagos, setPagos] = useState(1);

  const calcularCosto = () => {
    const base = 0;
    const incremento = 0;
    const total = base + incremento;
    const inicial = total * 0.25;
    const cuota = (total - inicial) / pagos;
    return { base, incremento, total, inicial, cuota };
  };

  const { base, incremento, total, inicial, cuota } = calcularCosto();

  const enviarSolicitud = (e) => {
    e.preventDefault();
    console.log("Solicitud enviada");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Bienvenido al Dashboard del Cliente</h2>
      <form onSubmit={enviarSolicitud} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Selecciona el servicio:</label>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Selecciona el número de pagos:</label>
          <select
            value={pagos}
            onChange={(e) => setPagos(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
          >
            <option value={1}>1 pago</option>
            <option value={2}>2 pagos</option>
            <option value={3}>3 pagos</option>
          </select>
        </div>

        <div className="bg-gray-100 p-4 rounded text-sm">
          <p><strong>Costo del servicio:</strong> ${base}</p>
          <p><strong>Incremento por urgencia:</strong> ${incremento}</p>
          <p><strong>Total a pagar:</strong> ${total}</p>
          <p><strong>Pago inicial obligatorio (25%):</strong> ${inicial}</p>
          <p><strong>Cuotas:</strong></p>
          {[...Array(pagos - 1)].map((_, i) => (
            <p key={i}>Mes {i + 1}: ${cuota}</p>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

export default ClienteDashboard;
