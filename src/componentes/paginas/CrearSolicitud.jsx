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
  const [puntos, setPuntos] = useState(120);
  const [credito, setCredito] = useState(1500);
  const [progreso, setProgreso] = useState(33);

  const listaServicios = {
    'Plomería': [
      { nombre: 'Destape de tubería', precio: 60 },
      { nombre: 'Cambio de grifo', precio: 40 },
    ],
    'Electricidad': [
      { nombre: 'Instalación de lámpara', precio: 100 },
      { nombre: 'Reparación de enchufe', precio: 80 },
    ],
  };

  const serviciosDisponibles = listaServicios[categoria] || [];

  const servicioBase = servicios.reduce((total, nombre) => {
    const encontrado = serviciosDisponibles.find(s => s.nombre === nombre);
    return encontrado ? total + encontrado.precio : total;
  }, 0);

  const incrementoUrgencia = urgencia === 'Servicio el mismo día (+15%)'
    ? servicioBase * 0.15
    : urgencia === 'Servicio 24 horas (+20%)'
    ? servicioBase * 0.20
    : 0;

  const total = servicioBase + incrementoUrgencia;
  const comision = total * 0.10;
  const pagoInicial = total * 0.25;
  const pagoMensual = cuotas > 1 ? (total / cuotas) : 0;
  const creditoRestante = credito - total;

  const enviarSolicitud = async () => {
    if (!categoria || servicios.length === 0 || !fecha || !hora || !metodoPago) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const user = await supabase.auth.getUser();
    const { id: cliente_id } = user.data.user;

    const { error } = await supabase.from('solicitudes').insert([{
      cliente_id,
      categoria,
      servicios: servicios.join(', '),
      fecha,
      hora,
      urgencia,
      metodo_pago: metodoPago,
      cuotas,
      costo_total: total,
      pago_inicial: pagoInicial,
      plan_pago: `${cuotas} pago`,
      solo_tecnicas: soloTecnicas,
      para_otro: paraOtro,
      email_otro: emailOtro || null,
      notificar: notificar ? contactoNotificar : null,
      contacto_notificar: contactoNotificar || '',
      status: 'pendiente',
      puntos,
      pagos: cuotas,
    }]);

    if (error) {
      console.error("❌ Error al enviar solicitud:", error);
      alert("Error al enviar solicitud. Intenta de nuevo.");
    } else {
      alert("✅ Solicitud enviada con éxito");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <div className="h-2 bg-green-500 rounded" style={{ width: `${progreso}%` }} />
      <div className="flex justify-between text-sm text-gray-600">
        <span>✨ Puntos acumulados: {puntos}</span>
        <span>💰 Crédito disponible: ${creditoRestante.toFixed(2)}</span>
      </div>

      <div>
        <label className="font-semibold">Selecciona una categoría:</label>
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full mt-1 border rounded p-2">
          <option value="">-- Selecciona --</option>
          {Object.keys(listaServicios).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {categoria && (
        <div>
          <label className="font-semibold">Selecciona servicios por categoría:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {serviciosDisponibles.map(servicio => (
              <label key={servicio.nombre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={servicios.includes(servicio.nombre)}
                  onChange={() => {
                    if (servicios.includes(servicio.nombre)) {
                      setServicios(servicios.filter(s => s !== servicio.nombre));
                    } else {
                      setServicios([...servicios, servicio.nombre]);
                    }
                  }}
                />
                {servicio.nombre} – ${servicio.precio}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Pagos mensuales (1 a 6):</label>
          <select value={cuotas} onChange={e => setCuotas(parseInt(e.target.value))} className="w-full border rounded p-2">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} pago</option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha del servicio:</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label>Hora:</label>
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label>Urgencia:</label>
          <div className="flex flex-col gap-1">
            {['Normal', 'Servicio el mismo día (+15%)', 'Servicio 24 horas (+20%)'].map(op => (
              <label key={op} className="flex items-center gap-2">
                <input type="radio" name="urgencia" value={op} checked={urgencia === op} onChange={() => setUrgencia(op)} />
                {op}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label>Método de pago:</label>
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} className="w-full border rounded p-2 mt-1">
          <option value="">-- Selecciona --</option>
          <option value="Tarjeta débito (****1234)">Tarjeta débito (****1234)</option>
          <option value="Cuenta bancaria (****5678)">Cuenta bancaria (****5678)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={paraOtro} onChange={e => setParaOtro(e.target.checked)} />
          ¿Solicitar para otra persona?
        </label>
        {paraOtro && (
          <input
            type="text"
            placeholder="Correo de la otra persona"
            value={emailOtro}
            onChange={e => setEmailOtro(e.target.value)}
            className="w-full border rounded p-2"
          />
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notificar} onChange={e => setNotificar(e.target.checked)} />
          ¿Deseas notificar a alguien por seguridad?
        </label>
        {notificar && (
          <input
            type="text"
            placeholder="Correo o número del contacto"
            value={contactoNotificar}
            onChange={e => setContactoNotificar(e.target.value)}
            className="w-full border rounded p-2"
          />
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={soloTecnicas} onChange={e => setSoloTecnicas(e.target.checked)} />
          Solo técnicas confiables para mujeres 👩🏻
        </label>
      </div>

      <div className="bg-gray-100 p-4 rounded mt-4 text-sm text-gray-700">
        <p><strong>Servicio base:</strong> ${servicioBase.toFixed(0)}</p>
        <p><strong>Incremento por urgencia:</strong> ${incrementoUrgencia.toFixed(2)}</p>
        <p><strong>Comisión FixFlexx (10%):</strong> ${comision.toFixed(2)}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <p><strong>Pago inicial obligatorio (25%):</strong> ${pagoInicial.toFixed(2)}</p>
        {cuotas > 1 && (
          <p><strong>Cuotas mensuales:</strong> {Array.from({ length: cuotas }, (_, i) => `Mes ${i + 1}: $${pagoMensual.toFixed(2)}`).join(', ')}</p>
        )}
      </div>

      <button onClick={enviarSolicitud} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        Enviar Solicitud
      </button>
    </div>
  );
}

export default CrearSolicitud;
