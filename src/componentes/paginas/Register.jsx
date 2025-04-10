import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./lib/supabaseClient";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMensaje("Error al registrar: " + error.message);
    } else {
      setMensaje("Registro exitoso. Revisa tu correo para confirmar.");
      setTimeout(() => navigate("/"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Registro</h2>
        {mensaje && <p className="text-sm mb-2 text-center text-blue-600">{mensaje}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
