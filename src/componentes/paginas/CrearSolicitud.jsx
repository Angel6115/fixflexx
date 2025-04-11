import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './lib/supabaseClient';

function CrearSolicitud() {
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [urgencia, setUrgencia] = useState('normal');
  const [credito, setCredito] = useState(150);
  const [puntos, setPuntos] = useState(80);
  const [otroUsuario, setOtroUsuario] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [planPago, setPlanPago] = useState('1');

  const categorias = {
    'Jardinería': {
      'Corte de césped': 120,
      'Poda de árboles': 150,
      'Mantenimiento general': 100,
    },
    'Plomería': {
      'Cambio de fregadero': 200,
      'Destape de tubería sanitaria': 160,
      'Reparación de fuga de agua': 180,
    },
    'Electricidad': {
      'Instalación de lámpara': 100,
      'Reparación eléctrica básica': 180,
      'Cambio de toma corriente': 90,
    },
    'Automotriz': {
      'Cambio de batería': 150,
      'Revisión general': 200,
      'Cambio de aceite': 130,
    }
  };

  const disponibilidad = {
    '2025-04-11': ['09:00', '11:00', '14:00'],
    '2025-04-12': ['10:00', '13:00', '15:30'],
    '2025-04-13': ['08:00', '12:00'],
  };

  const calcularCosto = () => {
    const base = categorias[categoria]?.[servicio] || 0;
    let total = base;
    if (urgencia === 'urgente') total *= 1.3;
    else if (urgencia === '24h') total *= 1.15;
    return total;
  };

  const calcularPagoInicial = () => calcularCosto() * 0.15;

  const calcularCuotas = () => {
    const total = calcularCosto();
    const restante = total - calcularPagoInicial();
    const cuotas = parseInt(planPago);
    return cuotas > 1 ? (restante / (cuotas - 1)).toFixed(2) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const costo = calcularCosto();
    const pagoInicial = calcularPagoInicial();

    const { data, error } = await supabase.from('solicitudes').insert([
      {
        categoria,
        servicio,
        fecha,
        hora,
        urgencia,
        costo,
        plan_pago: planPago,
        pago_inicial: pagoInicial,
        para_otra_persona: otroUsuario,
        correo_usuario: correoUsuario || null,
      },
    ]);

    if (!error) navigate('/cliente');
    else console.error('Error:', error);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700 flex items-center justify-center gap-2">
        <img src="/logoFixFlexx.jpg" alt="logo" className="w-12 h-12" /> FixFlexx - Crear Solicitud
      </h1>

      <div className="mb-6 p-4 bg-gray-100 rounded flex justify-between">
        <p>⭐ Puntos: <strong>{puntos}</strong></p>
        <p>💰 Crédito disponible: <strong>${credito.toFixed(2)}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría</label>
          <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setServicio(''); }} required className="w-full border p-2 rounded shadow-sm">
            <option value="">Seleccione categoría...</option>
            {Object.keys(categorias).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {categoria && (
          <div>
            <label className="block text-sm font-semibold mb-1">Tipo de servicio</label>
            <select value={servicio} onChange={(e) => setServicio(e.target.value)} required className="w-full border p-2 rounded shadow-sm">
              <option value="">Seleccione...</option>
              {Object.keys(categorias[categoria]).map((tipo) => (
                <option key={tipo} value={tipo}>{tipo} - ${categorias[categoria][tipo]}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Fecha disponible</label>
            <select value={fecha} onChange={(e) => { setFecha(e.target.value); setHora(''); }} required className="w-full border p-2 rounded shadow-sm">
              <option value="">Seleccione fecha...</option>
              {Object.keys(disponibilidad).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hora disponible</label>
            <select value={hora} onChange={(e) => setHora(e.target.value)} required className="w-full border p-2 rounded shadow-sm">
              <option value="">Seleccione hora...</option>
              {fecha && disponibilidad[fecha].map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nivel de urgencia</label>
          <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="w-full border p-2 rounded shadow-sm">
            <option value="normal">Normal</option>
            <option value="24h">Servicio en 24 horas (+15%)</option>
            <option value="urgente">Urgente (+30%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Plan de pago</label>
          <select value={planPago} onChange={(e) => setPlanPago(e.target.value)} className="w-full border p-2 rounded shadow-sm">
            <option value="1">Pago único</option>
            <option value="2">2 pagos (quincenales)</option>
            <option value="3">3 pagos mensuales</option>
            <option value="4">4 pagos mensuales</option>
            <option value="6">6 pagos mensuales</option>
          </select>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={otroUsuario} onChange={(e) => setOtroUsuario(e.target.checked)} className="mr-2" />
            ¿Solicitar para otra persona?
          </label>
          {otroUsuario && (
            <input
              type="email"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
              placeholder="Correo electrónico del usuario"
              className="w-full border p-2 rounded mt-2 shadow-sm"
              required
            />
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded text-blue-900 border border-blue-300">
          <p><strong>Costo total:</strong> ${calcularCosto().toFixed(2)}</p>
          <p><strong>Pago inicial obligatorio (15%):</strong> ${calcularPagoInicial().toFixed(2)}</p>
          {parseInt(planPago) > 1 && (
            <p><strong>Pagos restantes ({parseInt(planPago) - 1}):</strong> ${calcularCuotas()} c/u</p>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition text-lg font-medium">
          Enviar solicitud
        </button>
      </form>
    </div>
  );
}

export default CrearSolicitud;
