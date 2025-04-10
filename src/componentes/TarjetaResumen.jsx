import React from "react"

function TarjetaResumen({ titulo, valor, color = "#3b82f6", icono = "📊" }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        padding: "1rem",
        margin: "0.5rem",
        minWidth: "150px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "2rem" }}>{icono}</div>
      <h3 style={{ margin: "0.5rem 0" }}>{titulo}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{valor}</p>
    </div>
  )
}

export default TarjetaResumen
