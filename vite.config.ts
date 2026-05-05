import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('--- VITE CONFIG DEBUG ---');
  console.log('Mode:', mode);
  console.log('Keys in LoadEnv:', Object.keys(env).filter(k => k.startsWith('VITE_')));
  console.log('Keys in ProcessEnv:', Object.keys(process.env).filter(k => k.startsWith('VITE_')));
  console.log('-------------------------');
  
  // Garantir que as variÃ¡veis do Supabase estejam presentes e sejam strings
  // Verificamos tanto com VITE_ prefixo quanto sem, para maior flexibilidade
  let supabaseUrl = (
    env.VITE_SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL || 
    env.SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    ""
  ).trim().replace(/^["']|["']$/g, "");

  let supabaseAnonKey = (
    env.VITE_SUPABASE_ANON_KEY || 
    process.env.VITE_SUPABASE_ANON_KEY || 
    env.SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    ""
  ).trim().replace(/^["']|["']$/g, "");

  // Limpar a URL para garantir que contenha apenas o domínio base (ex: https://xyz.supabase.co)
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      supabaseUrl = url.origin;
    } catch (e) {
      // Se não for uma URL válida, removemos apenas a barra final se existir
      if (supabaseUrl.endsWith('/')) {
        supabaseUrl = supabaseUrl.slice(0, -1);
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
