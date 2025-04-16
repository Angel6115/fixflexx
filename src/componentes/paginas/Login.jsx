import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './lib/supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mostrar mensaje de espera
    setMensaje('Verificando credenciales...');

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMensaje('Credenciales inválidas');
        console.error('Error de autenticación:', error.message);
      } else {
        setMensaje('Inicio de sesión exitoso ✅');
        console.log('Usuario autenticado:', data);

        // Redirigir al dashboard del cliente si la autenticación es exitosa
        navigate('/cliente');
      }
    } catch (error) {
      setMensaje('Hubo un error al iniciar sesión');
      console.error('Error inesperado:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        {mensaje && (
          <p className="text-center mb-4 text-red-600 font-medium">{mensaje}</p>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
