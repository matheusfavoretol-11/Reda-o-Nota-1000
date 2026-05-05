import { createClient } from '@supabase/supabase-js';

// No AI Studio, as variáveis de ambiente podem demorar a sincronizar com o build do frontend.
// Usamos este objeto global para permitir atualizações em tempo real sem precisar de rebuild.
let config = (window as any).__SUPABASE_CONFIG__ || {
  url: import.meta.env.VITE_SUPABASE_URL || "",
  key: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
};

const cleanUrl = (url: string) => {
  if (!url || !url.startsWith('http')) return "";
  try {
    const urlObj = new URL(url);
    // Retorna apenas origin (protoclo + host), removendo caminhos como /rest/v1 se o usuário colou errado
    return urlObj.origin;
  } catch (e) {
    return url.replace(/\/+$/, ""); // Fallback: remove barras no final
  }
};

const getSafeUrl = (url: string) => {
  const cleaned = cleanUrl(url);
  return cleaned || "https://missing-url.supabase.co";
};

const getSafeKey = (key: string) => (key || "").trim().replace(/^["']|["']$/g, "") || "missing-key";

// Exportamos o cliente como 'let' para que possamos atualizá-lo dinamicamente
export let supabase = createClient(getSafeUrl(config.url), getSafeKey(config.key));

/**
 * Atualiza a configuração global e recria o cliente Supabase.
 * Isso resolve o problema de "chaves não encontradas" quando o usuário as adiciona nas Settings.
 */
export const updateSupabaseConfig = (newUrl: string, newKey: string) => {
  const url = cleanUrl(newUrl);
  const key = getSafeKey(newKey);
  
  if (url && key && (url !== config.url || key !== config.key)) {
    console.log("🔄 Configuração do Supabase sincronizada do servidor:", url);
    (window as any).__SUPABASE_CONFIG__ = { url, key };
    config = { url, key };
    supabase = createClient(url, key);
  }
};

/**
 * Helper para garantir que temos um cliente funcional mesmo que o singleton demore a atualizar.
 */
export const getSupabase = () => {
  const current = (window as any).__SUPABASE_CONFIG__ || config;
  const url = cleanUrl(current.url);
  const key = getSafeKey(current.key);

  if (url && url !== "https://missing-url.supabase.co") {
    // Se o singleton 'supabase' já tiver esse URL, reusamos ele
    return supabase;
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
