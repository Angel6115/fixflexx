import React from "react"
import { Navigate } from "react-router-dom"

function RutaPrivada({ children }) {
  const session = localStorage.getItem("session")
  return session ? children : <Navigate to="/login" />
}

export default RutaPrivada
