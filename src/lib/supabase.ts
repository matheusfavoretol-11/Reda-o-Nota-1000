import { createClient } from '@supabase/supabase-js';

// No AI Studio, as variáveis de ambiente podem demorar a sincronizar com o build do frontend.
// Usamos este objeto global para permitir atualizações em tempo real sem precisar de rebuild.
let config = (window as any).__SUPABASE_CONFIG__ || {
  url: import.meta.env.VITE_SUPABASE_URL || "",
  key: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
};

const cleanUrl = (url: string) => {
  if (!url || typeof url !== 'string') return "";
  let target = url.trim().replace(/^["']|["']$/g, "");
  
  if (target.length > 100) {
     console.error("ERRO: O URL do Supabase parece ser uma chave (muito longo). Verifique as Settings.");
     return "";
  }

  if (!target.startsWith('http') && target.length > 0) {
    target = `https://${target}`;
  }
  
  try {
    const urlObj = new URL(target);
    if (!urlObj.hostname.endsWith('supabase.co') && !urlObj.hostname.includes('127.0.0.1')) {
       console.warn("AVISO: O URL do Supabase não termina em .supabase.co Host:", urlObj.hostname);
    }
    return urlObj.origin;
  } catch (e) {
    return target.replace(/\/+$/, "");
  }
};

const getSafeUrl = (url: string) => {
  const cleaned = cleanUrl(url);
  return (cleaned && cleaned.startsWith('http')) ? cleaned : "https://missing-url.supabase.co";
};

const getSafeKey = (key: string) => {
  const cleaned = (key || "").trim().replace(/^["']|["']$/g, "");
  if (cleaned.startsWith('http')) {
     console.error("ERRO: A Anon Key do Supabase parece ser uma URL. Verifique as Settings.");
  }
  return cleaned || "missing-key";
};

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
    const maskedUrl = url.length > 10 ? `${url.substring(0, 15)}...` : url;
    console.log(`🔄 Configuração do Supabase sincronizada do servidor. URL: ${maskedUrl}`);
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
    // Diagnostic log para o desenvolvedor
    console.debug(`[Supabase Init] URL: ${url.substring(0, 15)}... | Key: ${key.substring(0, 10)}...`);
    
    return createClient(url, key, {
      global: {
        fetch: (u, ...args) => {
          console.debug(`[Supabase Req] ${u}`);
          return fetch(u, ...args);
        }
      }
    });
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
