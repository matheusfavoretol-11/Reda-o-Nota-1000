import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis definidas em 'define' são substituídas por strings literais no build.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
  (window as any)._SUPABASE_DEBUG = {
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 10)}...` : "UNDEFINED",
    key: SUPABASE_ANON_KEY ? "DEFINED" : "UNDEFINED"
  };
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase configuration missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Environment Variables settings.");
}

// Ensure the URL is valid by providing a fallback only to prevent constructor crash
const finalUrl = SUPABASE_URL || "https://missing-url.supabase.co";
const finalKey = SUPABASE_ANON_KEY || "missing-key";

export const supabase = createClient(finalUrl, finalKey);
