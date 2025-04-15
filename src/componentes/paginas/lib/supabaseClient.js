import { createClient } from '@supabase/supabase-js';

// Usando variables de entorno para la clave y URL (deberías configurar estas variables en tu archivo .env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno para la URL y la clave de Supabase");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
