import React, { useState, useEffect } from 'react';
import supabase from './lib/supabaseClient';

function CrearSolicitud() {
  const [categoria, setCategoria] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [urgencia, setUrgencia] = useState('Normal');
  const [planPago, setPlanPago] = useState('Pago único');
  const [paraOtro, setParaOtro] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [creditos, setCreditos] = useState(1500);
  const [puntos, setPuntos] = useState(80);

  const serviciosDisponibles = {
    'Plomería': [
      { nombre: 'Cambio de fregadero', precio: 200 },
      { nombre: 'Destape de tubería sanitaria', precio: 150 }
    ],
    'Electricidad': [
      { nombre: 'Instalación de lámpara', precio: 100 },
      { nombre: 'Reparación de enchufe', precio: 80 }
    ],
    'Jardinería': [
      { nombre: 'Corte de césped', precio: 120 },
      { nombre: 'Poda de árboles', precio: 180 }
    ],
    'Reparación de Auto': [
      { nombre: 'Cambio de aceite', precio: 90 },
      { nombre: 'Cambio de frenos', precio: 250 }
    ]
  };

  const urgenciaMultiplicadores = {
    'Normal': 0,
    'Servicio en 24 horas (+15%)': 0.15,
    'Urgente (+30%)': 0.30
  };

  const planesPago = {
    'Pago único': 1,
    '2 Pagos': 2,
    '4 Pagos': 4,
    '6 Pagos': 6
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setClienteId(user.id);
      }
    };
    fetchUser();
  }, []);

  const getPrecioServicio = () => {
    const servicioSeleccionado = serviciosDisponibles[categoria]?.find(s => s.nombre === servicio);
    return servicioSeleccionado ? servicioSeleccionado.precio : 0;
  };

  const calcularCostos = () => {
    const base = getPrecioServicio();
    const incremento = base * (urgenciaMultiplicadores[urgencia] || 0);
    const total = base + incremento;
    const pagoInicial = total * 0.25;
    const cuotas = planesPago[planPago] - 1;
    const valorCuota = cuotas > 0 ? (total - pagoInicial) / cuotas : 0;
    return { base, incremento, total, pagoInicial, cuotas, valorCuota };
  };

  const { base, incremento, total, pagoInicial, cuotas, valorCuota } = calcularCostos();

  const enviarSolicitud = async () => {
    if (!clienteId || !categoria || !servicio || !fecha || !hora) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const { error } = await supabase.from('solicitudes').insert([
      {
        cliente_id: clienteId,
        categoria,
        servicio,
        fecha,
        hora,
        urgencia,
        plan_pago: planPago,
        costo_total: total,
        pago_inicial: pagoInicial,
        estado: 'pendiente',
        para_otro: paraOtro
      }
    ]);

    if (error) {
      console.error('Error al enviar solicitud:', error.message);
      alert('Hubo un problema al enviar la solicitud');
    } else {
      alert('Solicitud enviada exitosamente 🎉');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Crear Solicitud</h2>

      <div className="text-sm text-gray-700 mb-4 flex justify-between">
        <span>⭐ Puntos: {puntos}</span>
        <span>💰 Crédito disponible: ${creditos.toFixed(2)}</span>
      </div>

      <div className="space-y-4">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Seleccione categoría...</option>
          {Object.keys(serviciosDisponibles).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Seleccione servicio...</option>
          {(serviciosDisponibles[categoria] || []).map(s => (
            <option key={s.nombre} value={s.nombre}>
              {s.nombre} - ${s.precio}
            </option>
          ))}
        </select>

        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full p-2 border rounded" />
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full p-2 border rounded" />

        <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="w-full p-2 border rounded">
          {Object.keys(urgenciaMultiplicadores).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <select value={planPago} onChange={(e) => setPlanPago(e.target.value)} className="w-full p-2 border rounded">
          {Object.keys(planesPago).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" checked={paraOtro} onChange={() => setParaOtro(!paraOtro)} />
          Solicitar para otra persona
        </label>

        <div className="bg-blue-50 p-4 rounded text-sm text-gray-800 border">
          <p><strong>Costo del servicio:</strong> ${base.toFixed(2)}</p>
          <p><strong>Fee por urgencia:</strong> ${incremento.toFixed(2)}</p>
          <p><strong>Total a pagar:</strong> ${total.toFixed(2)}</p>
          <p><strong>Pago inicial obligatorio (25%):</strong> ${pagoInicial.toFixed(2)}</p>
          {cuotas > 0 && (
            <p><strong>Cuotas:</strong> {cuotas} pagos de ${valorCuota.toFixed(2)}</p>
          )}
        </div>

        <button
          onClick={enviarSolicitud}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
        >
          Enviar Solicitud
        </button>
      </div>
    </div>
  );
}

export default CrearSolicitud;
