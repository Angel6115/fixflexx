import React, { useState, useEffect } from 'react';

const CrearSolicitud = () => {
  const [creditoDisponible, setCreditoDisponible] = useState(1500);
  const [montoTotal, setMontoTotal] = useState(0);
  const [servicioSeleccionado, setServicioSeleccionado] = useState({});
  const [pagosSeleccionados, setPagosSeleccionados] = useState(1);
  const [cuotasMeses, setCuotasMeses] = useState([]);
  const [esMujer, setEsMujer] = useState(false);
  const [estadoTrabajo, setEstadoTrabajo] = useState('Pendiente');
  
  const verificarCredito = () => {
    if (creditoDisponible < montoTotal) {
      const respuesta = window.confirm("Tu crédito disponible es bajo. ¿Te gustaría solicitar más crédito?");
      if (respuesta) {
        alert("Tu solicitud de crédito está en proceso.");
        setCreditoDisponible(creditoDisponible + 500); // Ejemplo de aumento de crédito
      }
    }
  };

  const manejarServicioUrgente = () => {
    if (servicioSeleccionado.tipo === "Urgente") {
      setFechaServicio(new Date()); // Fecha actual
      alert("Servicio urgente seleccionado. El técnico te indicará la hora aproximada.");
    }
  };

  const calcularCuotas = () => {
    const cantidadCuotas = pagosSeleccionados;
    const cuota = montoTotal / cantidadCuotas;
    setCuotasMeses(Array.from({ length: cantidadCuotas }, (_, index) => ({
      mes: `Mes ${index + 1}`,
      monto: cuota
    })));
  };

  const notificacionSeguridad = () => {
    if (esMujer) {
      const respuesta = prompt("¿A quién te gustaría notificar sobre este servicio?");
      alert(`Notificación enviada a ${respuesta}. ¡Es una medida de seguridad!`);
    }
  };

  const enviarRecordatorio = () => {
    alert("Recuerda que puedes comunicarte con el técnico por texto o llamada. ¡El trabajo está por comenzar!");
  };

  const mostrarNotificacionSeguridad = () => {
    if (esMujer) {
      return (
        <div className="notificacion-seguridad">
          <span role="img" aria-label="seguridad">🛡️</span> ¡Notificación de seguridad activa!
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    verificarCredito();
  }, [montoTotal]);

  useEffect(() => {
    manejarServicioUrgente();
  }, [servicioSeleccionado]);

  useEffect(() => {
    calcularCuotas();
  }, [pagosSeleccionados, montoTotal]);

  useEffect(() => {
    notificacionSeguridad();
  }, [esMujer]);

  useEffect(() => {
    if (estadoTrabajo === "Iniciado") {
      enviarRecordatorio();
    }
  }, [estadoTrabajo]);

  return (
    <div>
      {mostrarNotificacionSeguridad()}
      <form>
        <div>
          <label>Selecciona el servicio:</label>
          <select
            onChange={(e) => setServicioSeleccionado({ tipo: e.target.value })}
          >
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente (24 horas)</option>
          </select>
        </div>

        <div>
          <label>Selecciona el número de pagos:</label>
          <select onChange={(e) => setPagosSeleccionados(e.target.value)}>
            <option value="1">1 pago</option>
            <option value="2">2 pagos</option>
            <option value="3">3 pagos</option>
            <option value="6">6 pagos</option>
          </select>
        </div>

        <div>
          <button type="submit">Enviar Solicitud</button>
        </div>
      </form>

      <div>
        <p>Costo del servicio: ${montoTotal}</p>
        <p>Pago inicial obligatorio (25%): ${montoTotal * 0.25}</p>
        <p>Cuotas: {cuotasMeses.map((cuota) => (
          <div key={cuota.mes}>{cuota.mes}: ${cuota.monto}</div>
        ))}</p>
      </div>
    </div>
  );
};

export default CrearSolicitud;
