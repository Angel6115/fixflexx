import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './lib/supabaseClient';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error al registrar:', error.message);
      setMensaje('Error al registrar usuario');
    } else {
      console.log('Registro exitoso:', data);
      setMensaje('Registro exitoso ✅');
      setTimeout(() => navigate('/'), 2000); // Redirige al login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h2>

        {mensaje && (
          <p className="text-center mb-4 text-green-600 font-medium">
            {mensaje}
          </p>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Correo electrónico</span>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Contraseña</span>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
