import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

function CrearSolicitud() {
  const [categoria, setCategoria] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [urgencia, setUrgencia] = useState('Normal');
  const [planPago, setPlanPago] = useState('Pago único');
  const [paraOtro, setParaOtro] = useState(false);
  const [notificar, setNotificar] = useState(false);
  const [contactoTercero, setContactoTercero] = useState('');
  const [notificarA, setNotificarA] = useState('');
  const [soloMujeres, setSoloMujeres] = useState(false);
  const [creditos, setCreditos] = useState(1500);
  const [puntos, setPuntos] = useState(80);
  const [clienteId, setClienteId] = useState(null);

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
      if (user) setClienteId(user.id);
    };
    fetchUser();
  }, []);

  const getPrecioServicio = () => {
    const servicioSeleccionado = serviciosDisponibles[categoria]?.find(s => s.nombre === servicio);
    return servicioSeleccionado ? servicioSeleccionado.precio : 0;
  };

  const calcularCostos = () => {
    const base = getPrecioServicio();
    const incremento = urgenciaMultiplicadores[urgencia] || 0;
    const total = base + (base * incremento);
    const inicial = total * 0.25;
    const cuotas = planPago !== 'Pago único' ? planesPago[planPago] - 1 : 0;
    const cuota = cuotas > 0 ? (total - inicial) / cuotas : 0;
    return { base, incremento: base * incremento, total, inicial, cuotas, cuota };
  };

  const { base, incremento, total, inicial, cuotas, cuota } = calcularCostos();

  const enviarSolicitud = async () => {
    if (!clienteId || !categoria || !servicio || !fecha || !hora) {
      alert('Por favor completa todos los campos.');
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
        pago_inicial: inicial,
        estado: 'pendiente',
        para_otro: paraOtro,
        notificar_a: notificarA || null,
        solo_tecnicas: soloMujeres,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Hubo un problema al enviar la solicitud');
    } else {
      alert('✅ Solicitud enviada con éxito');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Crear Solicitud</h1>

      <div className="flex justify-between text-sm mb-4 text-gray-700">
        <span>⭐ Puntos: {puntos}</span>
        <span>💰 Crédito disponible: ${creditos.toFixed(2)}</span>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); enviarSolicitud(); }}>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Seleccione categoría</option>
          {Object.keys(serviciosDisponibles).map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Seleccione servicio</option>
          {(serviciosDisponibles[categoria] || []).map(s => (
            <option key={s.nombre}>{s.nombre} - ${s.precio}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="p-2 border rounded" />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="p-2 border rounded" />
          <select value={planPago} onChange={(e) => setPlanPago(e.target.value)} className="p-2 border rounded">
            {Object.keys(planesPago).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="w-full p-2 border rounded">
          {Object.keys(urgenciaMultiplicadores).map(u => (
            <option key={u}>{u}</option>
          ))}
        </select>

        <div className="space-y-2 text-sm text-gray-700">
          <label className="flex items-center">
            <input type="checkbox" checked={paraOtro} onChange={() => setParaOtro(!paraOtro)} className="mr-2" />
            ¿Solicitar para otra persona?
          </label>
          {paraOtro && (
            <input
              type="text"
              value={contactoTercero}
              onChange={(e) => setContactoTercero(e.target.value)}
              placeholder="Correo o número de teléfono"
              className="w-full p-2 border rounded"
            />
          )}

          <label className="flex items-center">
            <input type="checkbox" checked={notificar} onChange={() => setNotificar(!notificar)} className="mr-2" />
            ¿Deseas notificar a alguien por seguridad?
          </label>
          {notificar && (
            <input
              type="text"
              value={notificarA}
              onChange={(e) => setNotificarA(e.target.value)}
              placeholder="Correo o número a notificar"
              className="w-full p-2 border rounded"
            />
          )}

          <label className="flex items-center">
            <input type="checkbox" checked={soloMujeres} onChange={() => setSoloMujeres(!soloMujeres)} className="mr-2" />
            Solo técnicos confiables para mujeres 👩
          </label>
        </div>

        <div className="bg-gray-100 rounded p-4 text-sm">
          <p><strong>Costo del servicio:</strong> ${base.toFixed(2)}</p>
          <p><strong>Incremento por urgencia:</strong> ${incremento.toFixed(2)}</p>
          <p><strong>Total a pagar:</strong> ${total.toFixed(2)}</p>
          <p><strong>Pago inicial obligatorio (25%):</strong> ${inicial.toFixed(2)}</p>
          {cuotas > 0 && (
            <p><strong>Cuotas restantes:</strong> {cuotas} de ${cuota.toFixed(2)} cada una</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded mt-4"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

export default CrearSolicitud;
