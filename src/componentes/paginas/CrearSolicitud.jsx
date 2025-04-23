import React, { useState, useEffect } from 'react';
import supabase from './lib/supabaseClient';

function CrearSolicitud() {
  const [categoria, setCategoria] = useState('');
  const [servicios, setServicios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [urgencia, setUrgencia] = useState('Normal');
  const [cuotas, setCuotas] = useState(1);
  const [metodoPago, setMetodoPago] = useState('');
  const [paraOtro, setParaOtro] = useState(false);
  const [emailOtro, setEmailOtro] = useState('');
  const [notificar, setNotificar] = useState(false);
  const [contactoNotificar, setContactoNotificar] = useState('');
  const [soloTecnicas, setSoloTecnicas] = useState(false);
  const [creditoDisponible, setCreditoDisponible] = useState(1500);
  const [puntos, setPuntos] = useState(120);
  const [clienteId, setClienteId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setClienteId(user.id);
    };
    getUser();
  }, []);

  const categorias = {
    'Plomería': [
      { nombre: 'Destape de tubería', precio: 60 },
      { nombre: 'Cambio de grifo', precio: 40 },
    ],
    'Electricidad': [
      { nombre: 'Instalación de lámpara', precio: 100 },
      { nombre: 'Reparación de enchufe', precio: 80 },
    ],
    'Reparación de Auto': [
      { nombre: 'Cambio de frenos', precio: 90 },
      { nombre: 'Cambio de aceite', precio: 45 },
    ],
  };

  const serviciosSeleccionados = categorias[categoria] || [];

  const calcularServicioBase = () =>
    servicios.reduce((acc, s) => acc + s.precio, 0).toFixed(2);

  const calcularUrgencia = () => {
    const base = parseFloat(calcularServicioBase());
    if (urgencia === 'Mismo día') return (base * 0.15).toFixed(2);
    if (urgencia === '24 horas') return (base * 0.20).toFixed(2);
    return (0).toFixed(2);
  };

  const calcularTotal = () =>
    (parseFloat(calcularServicioBase()) + parseFloat(calcularUrgencia())).toFixed(2);

  const calcularInicial = () =>
    (parseFloat(calcularTotal()) * 0.25).toFixed(2);

  const calcularCuotas = () => {
    const restante = calcularTotal() - calcularInicial();
    const porMes = (restante / cuotas).toFixed(2);
    return Array.from({ length: cuotas }, (_, i) => `Mes ${i + 1}: $${porMes}`);
  };

  const actualizarCredito = () => {
    const restante = creditoDisponible - calcularTotal();
    return restante.toFixed(2);
  };

  const enviarSolicitud = async () => {
    if (!categoria || servicios.length === 0 || !fecha || !hora || !metodoPago) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const { error } = await supabase.from('solicitudes').insert([{
      cliente_id: clienteId,
      categoria,
      servicios: servicios.map(s => s.nombre).join(', '),
      fecha,
      hora,
      urgencia,
      metodo_pago: metodoPago,
      para_otro: paraOtro,
      email_otro: paraOtro ? emailOtro : null,
      notificar: notificar ? 'Sí' : 'No',
      contacto_notificar: notificar ? contactoNotificar : null,
      solo_tecnicas: soloTecnicas,
      cuotas,
      costo_total: calcularTotal(),
      pago_inicial: calcularInicial(),
      plan_pago: `${cuotas} pago`,
      status: 'pendiente',
      pagos: cuotas,
    }]);

    if (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar solicitud. Intenta de nuevo.');
    } else {
      alert('✅ Solicitud enviada con éxito');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      {/* Barra de progreso (estática) */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="bg-green-500 h-full w-[35%]" />
      </div>

      {/* Título y puntos */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-600">Crear Solicitud</h2>
        <p>✨ Puntos acumulados: {puntos} &nbsp;&nbsp; 💰 Crédito disponible: ${creditoDisponible}</p>
      </div>

      <div className="space-y-4">
        {/* Categoría */}
        <select value={categoria} onChange={e => { setCategoria(e.target.value); setServicios([]); }} className="w-full p-2 border rounded">
          <option value="">Selecciona una categoría</option>
          {Object.keys(categorias).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Servicios */}
        {serviciosSeleccionados.map(servicio => (
          <div key={servicio.nombre} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={servicios.includes(servicio)}
              onChange={() =>
                setServicios(prev =>
                  prev.includes(servicio)
                    ? prev.filter(s => s !== servicio)
                    : [...prev, servicio]
                )
              }
            />
            <label>{servicio.nombre} – <span className="text-green-600">${servicio.precio}</span></label>
          </div>
        ))}

        {/* Pagos, fecha y hora */}
        <div className="flex space-x-2">
          <select value={cuotas} onChange={e => setCuotas(parseInt(e.target.value))} className="w-1/3 p-2 border rounded">
            {[...Array(6)].map((_, i) => <option key={i} value={i + 1}>{i + 1} pago</option>)}
          </select>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-1/3 p-2 border rounded" />
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="w-1/3 p-2 border rounded" />
        </div>

        {/* Urgencia */}
        <div className="flex flex-wrap gap-3">
          {['Normal', 'Mismo día', '24 horas'].map(option => (
            <label key={option} className="flex items-center space-x-1">
              <input type="radio" checked={urgencia === option} onChange={() => setUrgencia(option)} />
              <span>{option}{option === 'Mismo día' ? ' (+15%)' : option === '24 horas' ? ' (+20%)' : ''}</span>
            </label>
          ))}
        </div>

        {/* Método de pago */}
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Método de pago</option>
          <option value="Tarjeta débito (****1234)">Tarjeta débito (****1234)</option>
          <option value="Cuenta bancaria (****5678)">Cuenta bancaria (****5678)</option>
        </select>

        {/* Para otra persona */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={paraOtro} onChange={e => setParaOtro(e.target.checked)} />
          <label>¿Solicitar para otra persona?</label>
        </div>
        {paraOtro && (
          <input
            type="text"
            value={emailOtro}
            onChange={e => setEmailOtro(e.target.value)}
            placeholder="Correo de la otra persona"
            className="w-full p-2 border rounded"
          />
        )}

        {/* Notificación */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={notificar} onChange={e => setNotificar(e.target.checked)} />
          <label>¿Deseas notificar a alguien por seguridad?</label>
        </div>
        {notificar && (
          <input
            type="text"
            value={contactoNotificar}
            onChange={e => setContactoNotificar(e.target.value)}
            placeholder="Correo o número del contacto"
            className="w-full p-2 border rounded"
          />
        )}

        {/* Técnicas confiables */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={soloTecnicas} onChange={e => setSoloTecnicas(e.target.checked)} />
          <label>Solo técnicas confiables para mujeres 👩🏻‍🔧</label>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 border p-4 rounded text-sm text-gray-700">
          <p><strong>Servicio base:</strong> ${calcularServicioBase()}</p>
          <p><strong>Incremento por urgencia:</strong> ${calcularUrgencia()}</p>
          <p><strong>Comisión FixFlexx (10%):</strong> ${(calcularServicioBase() * 0.10).toFixed(2)}</p>
          <p><strong>Total:</strong> ${calcularTotal()}</p>
          <p><strong>Pago inicial obligatorio (25%):</strong> ${calcularInicial()}</p>
          <p><strong>Cuotas mensuales:</strong><br />{calcularCuotas().join(', ')}</p>
        </div>

        <button onClick={enviarSolicitud} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Enviar Solicitud
        </button>
      </div>
    </div>
  );
}

export default CrearSolicitud;
