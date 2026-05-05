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
  // Se já temos uma instância válida (não fallback), retornamos ela
  if (supabaseInstance && supabaseInstance.supabaseUrl !== FALLBACK_URL) {
    return supabaseInstance;
  }

  const rawUrl = (window as any).__SUPABASE_CONFIG__?.url || import.meta.env.VITE_SUPABASE_URL;
  const rawKey = (window as any).__SUPABASE_CONFIG__?.key || import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = cleanUrl(rawUrl || "");
  const key = cleanKey(rawKey || "");

  // Diagnóstico amigável para o desenvolvedor (Exibido apenas uma vez ou na recriação)
  if (typeof window !== 'undefined') {
    console.log("[Supabase Singleton Diagnostic]", {
      hasUrl: !!url && url !== FALLBACK_URL,
      urlPrefix: url ? url.substring(0, 15) + "..." : "N/A",
      hasKey: !!key && key.length > 20,
      source: (window as any).__SUPABASE_CONFIG__ ? "Dynamic API" : "Environment Vars"
    });
  }

  if (!url || url === FALLBACK_URL) {
    console.error("❌ ERRO: VITE_SUPABASE_URL não configurada ou inválida nas Settings.");
    return createClient(FALLBACK_URL, "missing-key");
  }

  if (!key || key.length < 20) {
    console.warn("⚠️ AVISO: VITE_SUPABASE_ANON_KEY parece estar vazia ou incorreta.");
  }

  console.log("🚀 Inicializando instância única do Supabase");
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return supabaseInstance;
};

// Exportamos o singleton para uso imediato
export const supabase = getSupabase();

/**
 * Permite forçar uma nova configuração (útil apenas se as chaves mudarem em runtime no AI Studio)
 */
export const updateSupabaseConfig = (newUrl: string, newKey: string) => {
  const url = cleanUrl(newUrl);
  const key = cleanKey(newKey);
  
  if (url && key && url !== FALLBACK_URL) {
    (window as any).__SUPABASE_CONFIG__ = { url, key };
    // Re-inicializamos a instância para garantir que o cliente use as novas chaves imediatamente
    supabaseInstance = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    console.log("✅ Supabase reconfigurado com chaves dinâmicas.");
  }
};
