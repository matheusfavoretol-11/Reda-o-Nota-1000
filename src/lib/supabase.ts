import { createClient } from '@supabase/supabase-js';

// Configuração inicial (pode vir do build-time ou do objeto global)
let config = (window as any).__SUPABASE_CONFIG__ || {
  url: import.meta.env.VITE_SUPABASE_URL || "",
  key: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
};

// Fallbacks para evitar erro de constructor se estiver vazio (comum no primeiro load do AI Studio)
const getSafeUrl = (url: string) => (url && url.startsWith('http')) ? url : "https://missing-url.supabase.co";
const getSafeKey = (key: string) => key || "missing-key";

// Cliente Singleton Inicial
export let supabase = createClient(getSafeUrl(config.url), getSafeKey(config.key));

// Função para atualizar o cliente se as chaves forem buscadas via API (solução para build antigo no AI Studio)
export const updateSupabaseConfig = (newUrl: string, newKey: string) => {
  if (newUrl && newKey && (newUrl !== config.url || newKey !== config.key)) {
    console.log("Configuração do Supabase carregada dinamicamente via API.");
    (window as any).__SUPABASE_CONFIG__ = { url: newUrl, key: newKey };
    config = { url: newUrl, key: newKey };
    // Recriamos o singleton para novos usos que não chamarem getSupabase()
    supabase = createClient(newUrl, newKey);
  }
};

/**
 * Retorna uma instância do Supabase garantidamente atualizada.
 * Use isso em funções de ação (como handleAuth) para evitar problemas de cache.
 */
export const getSupabase = () => {
  const currentConfig = (window as any).__SUPABASE_CONFIG__ || config;
  const url = currentConfig.url || import.meta.env.VITE_SUPABASE_URL;
  const key = currentConfig.key || import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (url && url.startsWith('http') && url !== "https://missing-url.supabase.co") {
     return createClient(url, key);
  }
  return supabase;
};

// Debug helper
if (typeof window !== 'undefined') {
  (window as any)._SUPABASE_DEBUG = {
    url: config.url ? `${config.url.substring(0, 15)}...` : "MISSING",
    key: config.key ? "PRESENT" : "MISSING",
    source: (window as any).__SUPABASE_CONFIG__ ? "DYNAMIC_API" : "BUILD_ENV"
  };
}
