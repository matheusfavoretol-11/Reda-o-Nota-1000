import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas!");
  console.warn("Verifique se o seu arquivo .env ou o painel de Secrets contém VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
