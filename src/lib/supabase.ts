import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis definidas em 'define' são substituídas por strings literais durante o build.
// Usamos fallbacks para evitar erros de 'undefined' que quebram o código.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("AVISO: Credenciais do Supabase não encontradas no ambiente do frontend.");
  console.info("Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no seu .env");
}

// Inicializamos com strings vazias se necessário para evitar erro de 'required' no construtor
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
