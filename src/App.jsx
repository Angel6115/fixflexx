import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Login from "./componentes/paginas/Login"
import Register from "./componentes/paginas/Register"
import ClienteDashboard from "./componentes/paginas/ClienteDashboard"
import RutaPrivada from "./componentes/RutaPrivada"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta pública para registro */}
        <Route path="/registro" element={<Register />} />

        {/* Ruta protegida para dashboard del cliente */}
        <Route
          path="/cliente"
          element={
            <RutaPrivada>
              <ClienteDashboard />
            </RutaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
