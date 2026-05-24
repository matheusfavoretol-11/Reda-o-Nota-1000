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
    esbuild: {
      pure: ['console.log', 'console.info', 'console.debug'], // Removes debug logging to reduce main thread load on mobile
      legalComments: 'none',
      treeShaking: true
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: true,
      assetsInlineLimit: 5120, // Inline icons and images <= 5KB to reduce HTTP handshakes
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group React & rendering engine in main bundle or vendor-react for smooth loading page
              if (
                id.includes('react/') || 
                id.includes('react-dom/') || 
                id.includes('scheduler/')
              ) {
                return 'vendor-react';
              }
              if (id.includes('@supabase') || id.includes('supabase-js')) {
                return 'vendor-supabase';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Group remaining tools into a single utilities vendor to secure cache efficiency
              return 'vendor-utils';
            }
          }
        },
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: false, // Force aggressive dead code elimination on third-party libraries
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        }
      }
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
