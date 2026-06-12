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
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'preload-css',
        enforce: 'post',
        transformIndexHtml(html) {
          // Dynamic CSS preload transformation to eliminate render-blocking CSS warning in PageSpeed Insights
          return html.replace(
            /<link\s+rel=["']stylesheet["']\s+([^>]*href=["'][^"']+\.css["'][^>]*)>/gi,
            '<link rel="preload" $1 as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" $1></noscript>'
          ).replace(
            /<link\s+([^>]*href=["'][^"']+\.css["'])\s+rel=["']stylesheet["']([^>]*)>/gi,
            '<link rel="preload" $1 as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" $1 $2></noscript>'
          );
        }
      },
      {
        name: 'minify-html',
        enforce: 'post',
        transformIndexHtml(html) {
          return html
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
        }
      }
    ],
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
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2,
        },
        mangle: true,
        format: {
          comments: false,
        }
      },
      cssMinify: true,
      cssCodeSplit: true,
      reportCompressedSize: false,
      assetsInlineLimit: 8192, // Inline icons and images <= 8KB to completely eliminate HTTP handshakes
      chunkSizeWarningLimit: 1400,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
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
