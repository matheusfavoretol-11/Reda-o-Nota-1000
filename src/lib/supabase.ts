import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DEBUG LOGS - Remova em produção
console.log("Supabase URL carregada:", supabaseUrl ? "Presente ✅" : "Faltante ❌");
console.log("Supabase Anon Key carregada:", supabaseAnonKey ? "Presente ✅" : "Faltante ❌");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas!");
  console.warn("Verifique se o seu arquivo .env ou o painel de Secrets contém VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
