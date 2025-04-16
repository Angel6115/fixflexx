import React, { useState, useEffect } from "react";

const CrearSolicitud = () => {
  const [servicio, setServicio] = useState(0);
  const [cuotas, setCuotas] = useState(1);
  const [solicitarOtraPersona, setSolicitarOtraPersona] = useState(false);
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [estadoSolicitud, setEstadoSolicitud] = useState('pendiente');
  const [puntos, setPuntos] = useState(80); // Inicializando con 80 puntos disponibles
  const [creditoDisponible, setCreditoDisponible] = useState(1500); // Crédito inicial
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [pagoInicial, setPagoInicial] = useState(0);
  const [cuota, setCuota] = useState(0);
  const [esMujer, setEsMujer] = useState(false); // Para verificar si es mujer

  // Calcular los pagos (total, pago inicial, cuota)
  const calcularPago = () => {
    const total = servicio * 1.15; // Aplicar fee si aplica
    const pagoInicial = total * 0.25; // Pago inicial del 25%
    const cuota = (total - pagoInicial) / cuotas;
    setTotalAPagar(total);
    setPagoInicial(pagoInicial);
    setCuota(cuota);
  };

  useEffect(() => {
    if (servicio > 0) {
      calcularPago();
    }
  }, [servicio, cuotas]);

  // Acumular puntos
  const acumularPuntos = () => {
    setPuntos(puntos + 10); // Por ejemplo, sumar 10 puntos por cada servicio solicitado
  };

  // Obtener el progreso de la solicitud
  const obtenerProgreso = () => {
    switch (estadoSolicitud) {
      case 'pendiente':
        return 0;
      case 'aceptado':
        return 50;
      case 'en_proceso':
        return 100;
      default:
        return 0;
    }
  };

  // Manejar el envío de la solicitud
  const handleEnviarSolicitud = () => {
    if (totalAPagar > creditoDisponible) {
      alert("No tienes suficiente crédito disponible.");
      return;
    }
    if (solicitarOtraPersona && !email) {
      alert("Por favor, ingresa un email para la otra persona.");
      return;
    }
    // Aquí se podría integrar una lógica para enviar la solicitud a la base de datos
    alert("Solicitud enviada con éxito!");
    acumularPuntos(); // Sumar puntos al enviar la solicitud
  };

  return (
    <div>
      <h2>🌟 Puntos: {puntos} | 💰 Crédito Disponible: ${creditoDisponible}</h2>
      <h3>Crear Solicitud</h3>

      {/* Selección de Servicio */}
      <label>Selección de Categoría:</label>
      <select onChange={(e) => setServicio(parseFloat(e.target.value))}>
        <option value="0">Reparación de Auto</option>
        <option value="90">Cambio de aceite</option>
        <option value="250">Cambio de frenos</option>
      </select>

      <label>Fecha de Servicio:</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <label>Hora de Servicio:</label>
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />

      <label>Cuotas:</label>
      <select onChange={(e) => setCuotas(parseInt(e.target.value))}>
        <option value="1">1 Pago</option>
        <option value="2">2 Pagos</option>
        <option value="3">3 Pagos</option>
        <option value="4">4 Pagos</option>
        <option value="5">5 Pagos</option>
        <option value="6">6 Pagos</option>
      </select>

      {/* Muestra de Cálculos */}
      <div>
        <label>Costo del servicio:</label> ${totalAPagar.toFixed(2)}
        <br />
        <label>Pago inicial obligatorio:</label> ${pagoInicial.toFixed(2)}
        <br />
        <label>Cuotas:</label> {cuotas} pagos de ${cuota.toFixed(2)}
      </div>

      {/* Solicitar para otra persona */}
      <label>Solicitar para otra persona:</label>
      <input
        type="checkbox"
        checked={solicitarOtraPersona}
        onChange={() => setSolicitarOtraPersona(!solicitarOtraPersona)}
      />
      {solicitarOtraPersona && (
        <input
          type="email"
          placeholder="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {/* Barra de Progreso */}
      <div style={{ width: `${obtenerProgreso()}%`, backgroundColor: 'green', height: '5px' }}></div>

      <br />
      <button onClick={handleEnviarSolicitud}>Enviar Solicitud</button>

      {/* Notificación de seguridad si la persona es mujer */}
      <label>¿Es mujer?</label>
      <input
        type="checkbox"
        checked={esMujer}
        onChange={() => setEsMujer(!esMujer)}
      />
      {esMujer && (
        <div>
          <strong>Notificación de seguridad:</strong> Alguien está realizando un trabajo en su hogar.
        </div>
      )}
    </div>
  );
};

export default CrearSolicitud;
