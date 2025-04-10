import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@supabase/auth-helpers-react';

function RutaPrivada({ children }) {
  const user = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutaPrivada;
