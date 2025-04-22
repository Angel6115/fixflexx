import React, { useState, useEffect } from 'react';
import supabase from './lib/supabaseClient';

function CrearSolicitud() {
  const [categoria, setCategoria] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [urgencia, setUrgencia] = useState('Normal');
  const [planPago, setPlanPago] = useState('1 pago');
  const [paraOtro, setParaOtro] = useState(false);
  const [contactoTercero, setContactoTercero] = useState('');
  const [notificarA, setNotificarA] = useState('');
  const [notificar, setNotificar] = useState(false);
  const [soloTecnicas, setSoloTecnicas] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [creditos, setCreditos] = useState(1500);
  const [puntos, setPuntos] = useState(80);
  const [clienteId, setClienteId] = useState(null);

  const serviciosPorCategoria = {
    'Plomería': [
      { nombre: 'Destape de tubería', precio: 60 },
      { nombre: 'Cambio de grifo', precio: 40 }
    ],
    'Reparación de Auto': [
      { nombre: 'Cambio de frenos', precio: 90 },
      { nombre: 'Cambio de aceite', precio: 45 }
    ],
    'Electricidad': [
      { nombre: 'Instalación de lámpara', precio: 50 },
      { nombre: 'Reparación de toma corriente', precio: 35 }
    ],
    'Jardinería': [
      { nombre: 'Corte de césped', precio: 55 },
      { nombre: 'Poda de árboles', precio: 75 }
    ]
  };

  const obtenerPrecio = () => {
    const seleccionado = serviciosPorCategoria[categoria]?.find(s => s.nombre === servicio);
    return seleccionado ? seleccionado.precio : 0;
  };

  const calcularTotal = () => {
    let base = obtenerPrecio();
    let extra = urgencia === 'Servicio 24 horas (+20%)' ? base * 0.20
              : urgencia === 'Servicio el mismo día (+15%)' ? base * 0.15
              : 0;
    let total = base + extra;
    let inicial = total * 0.25;
    let comision = total * 0.10;
    let cuotas = planPago !== '1 pago' ? parseInt(planPago) - 1 : 0;
    let montoCuota = cuotas > 0 ? ((total - inicial) + comision) / cuotas : 0;
    return { base, extra, total, inicial, comision, cuotas, montoCuota };
  };

  const { base, extra, total, inicial, comision, cuotas, montoCuota } = calcularTotal();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setClienteId(user.id);
    };
    getUser();
  }, []);

  const enviarSolicitud = async () => {
    if (!clienteId || !categoria || !servicio || !fecha || !hora || !metodoPago) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const { error } = await supabase.from('solicitudes').insert([
      {
        cliente_id: clienteId,
        categoria,
        servicios: servicio,
        fecha,
        hora,
        urgencia,
        pagos: parseInt(planPago),
        metodo_pago: metodoPago,
        para_otro: paraOtro,
        email_otro: contactoTercero,
        notificar,
        solo_tecnicas: soloTecnicas,
        cuotas: cuotas.toString(),
        costo_total: total,
        pago_inicial: inicial,
        status: 'pendiente',
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      alert('❌ Error al guardar solicitud.');
      console.error(error);
    } else {
      alert('✅ Solicitud enviada con éxito');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-md text-sm">
      <div className="text-lg font-semibold text-purple-700 mb-4">En curso...</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-purple-600 h-2 rounded-full w-1/3" />
      </div>

      <div className="flex justify-between text-xs mb-2 text-gray-700">
        <div>⭐ Puntos acumulados: <strong>{puntos}</strong></div>
        <div>💳 Crédito disponible: <strong>${creditos}</strong></div>
      </div>

      <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full border rounded p-2 mb-3">
        <option value="">Selecciona una categoría</option>
        {Object.keys(serviciosPorCategoria).map(cat => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      {categoria && (
        <div className="mb-3">
          {serviciosPorCategoria[categoria].map((s, i) => (
            <label key={i} className="block text-gray-800">
              <input
                type="radio"
                name="servicio"
                value={s.nombre}
                checked={servicio === s.nombre}
                onChange={() => setServicio(s.nombre)}
                className="mr-2"
              />
              {s.nombre} – <span className="text-green-600 font-medium">${s.precio}</span>
            </label>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-700">Pagos mensuales (1 a 6):</label>
          <select value={planPago} onChange={e => setPlanPago(e.target.value)} className="w-full p-2 border rounded">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n}>{n} pago{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-700">Fecha del servicio:</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-gray-700">Hora:</label>
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="my-3">
        <label className="block font-medium">Urgencia:</label>
        {['Normal', 'Servicio el mismo día (+15%)', 'Servicio 24 horas (+20%)'].map((u) => (
          <label key={u} className="block text-gray-800">
            <input
              type="radio"
              name="urgencia"
              value={u}
              checked={urgencia === u}
              onChange={() => setUrgencia(u)}
              className="mr-2"
            />
            {u}
          </label>
        ))}
      </div>

      <label className="block font-medium">Selecciona método de pago:</label>
      <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">-- Selecciona --</option>
        <option value="Tarjeta débito">Tarjeta débito (****1234)</option>
        <option value="Cuenta bancaria">Cuenta bancaria (****5678)</option>
      </select>

      <label className="block my-2">
        <input type="checkbox" checked={paraOtro} onChange={() => setParaOtro(!paraOtro)} className="mr-2" />
        ¿Solicitar para otra persona?
      </label>
      {paraOtro && (
        <input
          type="text"
          placeholder="Correo o número del contacto"
          value={contactoTercero}
          onChange={e => setContactoTercero(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      )}

      <label className="block">
        <input type="checkbox" checked={notificar} onChange={() => setNotificar(!notificar)} className="mr-2" />
        ¿Deseas notificar a alguien por seguridad?
      </label>

      <label className="block my-2">
        <input type="checkbox" checked={soloTecnicas} onChange={() => setSoloTecnicas(!soloTecnicas)} className="mr-2" />
        Solo técnicas confiables para mujeres 👩‍🔧
      </label>

      <div className="bg-blue-50 border rounded p-4 text-sm text-gray-800 mt-3">
        <p><strong>Costo del servicio:</strong> ${base.toFixed(2)}</p>
        <p><strong>Incremento por urgencia:</strong> ${extra.toFixed(2)}</p>
        <p><strong>Total a pagar:</strong> ${total.toFixed(2)}</p>
        <p><strong>Pago inicial obligatorio (25%):</strong> ${inicial.toFixed(2)}</p>
        <p><strong>Comisión FixFlexx (10%):</strong> ${comision.toFixed(2)}</p>
        {cuotas > 0 && <p><strong>Cuotas mensuales:</strong><br />Mes 1: ${montoCuota.toFixed(2)}</p>}
      </div>

      <button
        onClick={enviarSolicitud}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        Enviar Solicitud
      </button>
    </div>
  );
}

export default CrearSolicitud;
