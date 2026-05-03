import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis definidas em 'define' são substituídas por strings literais no build.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase configuration missing. Auth and database features will fail.");
}

// Ensure the URL is valid by providing a fallback only to prevent constructor crash
const finalUrl = SUPABASE_URL || "https://missing-url.supabase.co";
const finalKey = SUPABASE_ANON_KEY || "missing-key";

export const supabase = createClient(finalUrl, finalKey);
