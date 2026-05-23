import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Função para validar se o valor não é um placeholder
  const isReal = (val: string) => val && !val.includes('YOUR_') && !val.includes('MY_') && val !== "missing-url" && val !== "missing-key";

  // Buscar a melhor URL disponível
  const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || env.VITE_SUPABASE_URL || env.SUPABASE_URL || "";
  let supabaseUrl = isReal(rawUrl) ? rawUrl.trim().replace(/^["']|["']$/g, "") : "";

  // Buscar a melhor Key disponível
  const rawKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || "";
  let supabaseAnonKey = isReal(rawKey) ? rawKey.trim().replace(/^["']|["']$/g, "") : "";

  // Limpar a URL para garantir que contenha apenas o domínio base
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      supabaseUrl = url.origin;
    } catch (e) {
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
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
    },
    server: {
      host: true,
      port: 3000,
      hmr: {
        clientPort: 443
      },
    },
  };
});
