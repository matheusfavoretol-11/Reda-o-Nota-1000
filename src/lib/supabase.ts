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

// Configuração atual (Lê do ambiente ou do objeto dinâmico do AI Studio)
const getRawUrl = () => (window as any).__SUPABASE_CONFIG__?.url || import.meta.env.VITE_SUPABASE_URL || "";
const getRawKey = () => (window as any).__SUPABASE_CONFIG__?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const FALLBACK_URL = "https://missing-url.supabase.co";

/**
 * Cria uma instância do cliente sempre validando as entradas atuais.
 */
export const getSupabase = () => {
  const rawUrl = getRawUrl();
  const rawKey = getRawKey();
  
  const url = cleanUrl(rawUrl);
  const key = cleanKey(rawKey);

  // Verificação básica de sanidade
  if (!url || url === FALLBACK_URL || !url.includes('supabase.co')) {
    console.warn("⚠️ Supabase URL não configurada ou inválida nas Settings.");
    return createClient(FALLBACK_URL, "missing-key");
  }

  if (key.length < 20) {
    console.warn("⚠️ Supabase Anon Key parece inválida ou curta demais.");
  }

  return createClient(url, key);
};

// Singleton para compatibilidade com códigos existentes
export const supabase = getSupabase();

/**
 * Função usada pelo App.tsx para injetar as chaves se o build estiver "atrasado" 
 * em relação às Settings do AI Studio.
 */
export const updateSupabaseConfig = (newUrl: string, newKey: string) => {
  const url = cleanUrl(newUrl);
  const key = cleanKey(newKey);
  
  if (url && key) {
    (window as any).__SUPABASE_CONFIG__ = { url, key };
    console.log("✅ Configuração do Supabase sincronizada dinamicamente.");
  }
};
