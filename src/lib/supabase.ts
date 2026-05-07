import { createClient } from '@supabase/supabase-js';

/**
 * Utilitário de limpeza para garantir que a URL seja apenas o origin.
 * Evita o erro "Invalid path" se o usuário colar o sufixo /rest/v1 ou caminhos extras.
 */
const cleanUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return "";
  let target = url.trim().replace(/^["']|["']$/g, ""); // Remove aspas extras
  
  // Se não começar com http, assume https
  if (target.length > 0 && !target.startsWith('http')) {
    target = `https://${target}`;
  }

  try {
    const urlObj = new URL(target);
    return urlObj.origin; // Retorna apenas https://ID.supabase.co
  } catch (e) {
    return target.replace(/\/+$/, "");
  }
};

/**
 * Limpeza da Anon Key (remove espaços e aspas)
 */
const cleanKey = (key: string): string => {
  return (key || "").trim().replace(/^["']|["']$/g, "");
};

const FALLBACK_URL = "https://missing-url.supabase.co";

// Cliente singleton privado para controle interno
let supabaseInstance: any = null;

/**
 * Retorna a instância única do cliente Supabase.
 * Implementa o padrão Singleton para evitar o erro "Multiple GoTrueClient instances".
 */
export const getSupabase = () => {
  // Configuração prioritária (Dynamic > Build time)
  const dynamicConfig = (window as any).__SUPABASE_DYNAMIC_CONFIG__;
  const rawUrl = dynamicConfig?.url || import.meta.env.VITE_SUPABASE_URL;
  const rawKey = dynamicConfig?.key || import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = cleanUrl(rawUrl || "");
  const key = cleanKey(rawKey || "");

  // Se já temos uma instância ativa com a MESMA URL que detectamos agora, usamos ela
  if (supabaseInstance && (supabaseInstance as any).supabaseUrl === url && url !== FALLBACK_URL) {
    return supabaseInstance;
  }

  // Diagnóstico detalhado para o desenvolvedor
  if (typeof window !== 'undefined') {
    const isPlaceholder = (url && url.includes("your-project-id")) || (key && key.includes("your-anon-public-key"));
    const isFallback = !url || url === FALLBACK_URL;
    
    if (isFallback || isPlaceholder) {
      console.warn("⚠️ Supabase Client em modo degradado/fallback. URL:", url || "EMPTY");
    }
  }

  if (!url || url === FALLBACK_URL) {
    // Se não temos nada, retornamos um cliente fallback mas não salvamos no singleton para permitir recriação
    return createClient(FALLBACK_URL, "missing-key");
  }

  console.log("🚀 Inicializando/Atualizando instância do Supabase com URL:", url);
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return supabaseInstance;
};

// singleton para uso imediato em hooks ou componentes.
// Usamos um Proxy para que 'supabase' sempre aponte para a instância atual, 
// mesmo que ela seja recriada via updateSupabaseConfig.
// IMPORTANTE: Garantimos que funções sejam bindadas à instância original para manter o contexto 'this'.
export const supabase: any = new Proxy({} as any, {
  get: (_target, prop) => {
    const instance = getSupabase();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

/**
 * Permite forçar uma nova configuração (útil apenas se as chaves mudarem em runtime no AI Studio)
 */
export const updateSupabaseConfig = (newUrl: string, newKey: string) => {
  const url = cleanUrl(newUrl);
  const key = cleanKey(newKey);
  
  if (url && key && url !== FALLBACK_URL) {
    const current = (window as any).__SUPABASE_DYNAMIC_CONFIG__;
    if (current?.url === url && current?.key === key) return;

    (window as any).__SUPABASE_DYNAMIC_CONFIG__ = { url, key };
    
    console.log("🔄 Configuração do Supabase atualizada dinamicamente.");
    
    // Invalidamos a instância atual para que o próximo acesso via Proxy ou getSupabase crie uma nova
    supabaseInstance = null;
  }
};
