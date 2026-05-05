import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis definidas em 'define' são substituídas por strings literais no build.
// Tentamos buscar de várias fontes para garantir que funcione no AI Studio
const config = (window as any).__SUPABASE_CONFIG__ || {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
};

const SUPABASE_URL = config.url;
const SUPABASE_ANON_KEY = config.key;

if (typeof window !== 'undefined') {
  (window as any)._SUPABASE_DEBUG = {
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : "MISSING",
    key: SUPABASE_ANON_KEY ? "PRESENT" : "MISSING",
    source: (window as any).__SUPABASE_CONFIG__ ? "GLOBAL_CONFIG" : "ENV"
  };
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase configuration missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Environment Variables settings.");
}

// Ensure the URL is valid by providing a fallback only to prevent constructor crash
const finalUrl = SUPABASE_URL || "https://missing-url.supabase.co";
const finalKey = SUPABASE_ANON_KEY || "missing-key";

export const supabase = createClient(finalUrl, finalKey);
