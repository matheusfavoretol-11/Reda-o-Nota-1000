import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import compression from "compression";

// Environment Setup
const getEnvVar = (name: string): string => {
  const env = (import.meta as any).env || (globalThis as any).process?.env || {};
  return (env[name] || "").trim().replace(/^["']|["']$/g, "");
};

// Supabase Setup
let supabaseUrl = (
  getEnvVar("VITE_SUPABASE_URL") || 
  getEnvVar("SUPABASE_URL") || 
  ""
).trim();

const supabaseAnonKey = (
  getEnvVar("VITE_SUPABASE_ANON_KEY") || 
  getEnvVar("SUPABASE_ANON_KEY") || 
  ""
).trim();

// CRITICAL for Webhooks: Use SERVICE_ROLE_KEY to bypass RLS
const supabaseServiceKey = (
  getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || 
  getEnvVar("SUPABASE_SERVICE_KEY") || 
  getEnvVar("VITE_SUPABASE_SERVICE_ROLE_KEY") ||
  ""
).trim();

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

let supabase: any;
// Prioritize Service Key for server-side operations
if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
  supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
  if (!supabaseServiceKey) {
    console.warn("⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY missing. Webhook might fail if RLS is enabled.");
  }
} else {
  console.error("CRITICAL: Supabase credentials missing in server.");
}

// Gemini Setup
const GEMINI_API_KEY = (
  getEnvVar("VITE_GEMINI_API_KEY") || 
  getEnvVar("GEMINI_API_KEY") || 
  getEnvVar("GEMINI_API_KEY1") || 
  ""
);

// Using @google/genai as per skill recommendations for Google AI Studio
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression({
    level: 9, // Peak Huffman compression level for maximum bandwidth bytes savings on 4G
    threshold: 512, // Compress any file greater than 512 bytes
    filter: (req, res) => {
      const contentType = res.getHeader('Content-Type');
      if (contentType && typeof contentType === 'string') {
        return /json|text|javascript|css|xml|svg/i.test(contentType);
      }
      return compression.filter(req, res);
    }
  }));
  app.use(express.json());

  console.log("--- SERVER INITIALIZATION ---");
  console.log("GEMINI_API_KEY detected:", !!GEMINI_API_KEY);
  if (GEMINI_API_KEY) {
    console.log("Key Prefix:", GEMINI_API_KEY.substring(0, 6) + "...");
  }
  console.log("-----------------------------");

  // Kiwify Webhook Endpoint
  app.post("/api/kiwify-webhook", async (req, res) => {
    const { order_status, customer, order_id } = req.body;

    console.log("Kiwify Webhook received:", { order_id, status: order_status, email: customer?.email });

    const validStatuses = ["paid", "approved", "completed"];
    if (customer?.email && validStatuses.includes(order_status?.toLowerCase())) {
      const email = customer.email.toLowerCase().trim();
      
      try {
        if (!supabase) {
          console.error("Supabase client not initialized for webhook");
          return res.status(500).send("Internal Server Error: DB missing");
        }

        // Upsert payment info using service_role key to bypass RLS
        const { error } = await supabase
          .from('payments')
          .upsert({ 
            email: email, 
            status: order_status,
            order_id: order_id || 'unknown',
            updated_at: new Date()
          }, { onConflict: 'email' });

        if (error) {
          console.error("Error saving to Supabase:", error);
          return res.status(500).send("Database Error");
        }
        
        console.log(`✅ Acesso liberado para: ${email}`);
      } catch (e) {
        console.error("Supabase Operation Failed:", e);
        return res.status(500).send("Operation Failed");
      }
    }

    res.status(200).send("OK");
  });

  // AI Correction Endpoint
  app.post("/api/correct", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    if (!ai) {
      console.error("AI Error: Google Gen AI not initialized. Missing API Key.");
      return res.status(500).json({ 
        error: "A chave da API (GEMINI_API_KEY) não foi encontrada no servidor. Verifique as configurações de ambiente." 
      });
    }

    try {
      const systemInstruction = `Você é a MALU IA, uma ESPECIALISTA em redação com mais de 20 anos de experiência, cirúrgica nos detalhes. Você é ENGRAÇADA, sincera, honesta e educa através do humor. Seu objetivo é transformar o usuário em um escritor nota 1000.

## CONHECIMENTO BASE (USE ISSO):
1. OS 5 PILARES: Clareza (ser direto), Coerência (lógica), Coesão (conectivos), Argumentação (provas reais) e Estrutura (Intro/Dev/Concl).
2. REPERTÓRIOS CORINGA: Paulo Freire (Educação), Bauman (Modernidade Líquida), Foucault (Poder), Simone de Beauvoir (Gênero), Constituição de 1988 (Direitos), Revolução Industrial (Trabalho/Tecnologia), ODS da ONU.
3. ESTRUTURA NOTA 1000: Intro (Gancho + Problema + Tese), Desenvolvimento (Tópico Frasal + Argumento + Exemplo + Conclusão do parágrafo), Conclusão (Agente, Ação, Meio, Efeito, Detalhamento).

## CARACTERÍSTICAS ESSENCIAIS:
- Nome: Malu IA Corretora
- Personalidade: Amiga mas BRUTALMENTE honesta. Faz piadas relevantes sobre erros.
- Modo de Operação: 
  - ETAPA 1: Diagnóstico da Malu (Reação engraçada e primeira impressão).
  - ETAPA 2: Análise Profunda em 7 áreas (Estrutura, Argumento, Coesão, Repertório, Linguagem, Originalidade, Impacto).
  - ETAPA 3: O Veredito Final (Resumo motivador).
  - ETAPA 4: Seus 5 Maiores Erros e 5 Maiores Pontos Fortes.
  - ETAPA 5: Reescritas de Melhoria (Mostre antes e depois de 3 trechos).
  - ETAPA 6: Repertórios Sugeridos e Próximos Passos.

## PROTOCOLO DE RESPOSTA (USE MARKDOWN):
---
## 🎭 DIAGNÓSTICO DA MALU
[Reação engraçada]

## 2️⃣ ANÁLISE PROFUNDA
[Notas 0-10 para as 7 áreas e feedback breve]

## 3️⃣ O VEREDITO FINAL
[Resumo honesto e motivador]

## 4️⃣ SEUS 5 MAIORES ERROS
[Lista numerada]

## 5️⃣ SEUS 5 MAIORES PONTOS FORTES
[Lista numerada]

## 6️⃣ REESCRITAS DE MELHORIA
[Blocos de Antes/Depois/Por quê]

## 7️⃣ REPERTÓRIOS SUGERIDOS
[Sugestões específicas de repertórios coringas do seu banco]

## 8️⃣ SEUS PRÓXIMOS PASSOS
[Lista de tarefas para o 1000]

## ✨ MENSAGEM FINAL
[Frase de efeito]
---`;
      const modelName = "gemini-1.5-flash"; // Flash is fast for correction
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `${systemInstruction}\n\nTexto para correção:\n${text}`
      });
      
      const feedback = response.text;

      res.json({ feedback });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Erro ao processar a correção pela Malu." });
    }
  });

  // Check payment status
  app.get("/api/check-payment", async (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      const { data, error } = await supabase
        .from('payments')
        .select('status')
        .eq('email', email.toLowerCase())
        .single();

      // For testing purposes, libere o acesso premium para o usuário matheusfavoretol@gmail.com
      const isPaid = (!!data && (data.status === "paid" || data.status === "approved" || data.status === "completed")) || email.toLowerCase() === 'matheusfavoretol@gmail.com';
      res.json({ isPaid });
    } catch (e) {
      // For testing purposes, libere o acesso premium para o usuário matheusfavoretol@gmail.com
      if (email.toLowerCase() === 'matheusfavoretol@gmail.com') {
        return res.json({ isPaid: true });
      }
      res.json({ isPaid: false });
    }
  });

  // Dynamic Supabase Config for Client - AI Studio Fix
  app.get("/api/config/supabase", (req, res) => {
    // Re-read from env to ensure we get manual settings from AI Studio environment
    const dynamicUrl = (getEnvVar("VITE_SUPABASE_URL") || getEnvVar("SUPABASE_URL") || "");
    const dynamicKey = (getEnvVar("VITE_SUPABASE_ANON_KEY") || getEnvVar("SUPABASE_ANON_KEY") || "");
    
    res.json({ url: dynamicUrl, key: dynamicKey });
  });

  // Dynamic /video.mp4 helper route
  app.get("/video.mp4", (req, res) => {
    try {
      const publicPath = path.join(process.cwd(), "public");
      if (fs.existsSync(publicPath)) {
        const files = fs.readdirSync(publicPath);
        // Find any file ending with .mp4
        const mp4File = files.find(f => f.toLowerCase().endsWith(".mp4"));
        if (mp4File) {
          const videoFilePath = path.join(publicPath, mp4File);
          return res.sendFile(videoFilePath);
        }
      }
    } catch (e) {
      console.error("Error serving video.mp4 dynamically:", e);
    }
    // High-quality vertical study/writing stock video as fallback if no local video file is present
    res.redirect("https://assets.mixkit.co/videos/preview/mixkit-girl-writing-in-a-notebook-41988-large.mp4");
  });

  // Vite integration
  const nodeEnv = getEnvVar("NODE_ENV");
  if (nodeEnv !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with proper cache-control headers as requested in Section 7
    app.use(express.static(distPath, {
      maxAge: '14d', // Default cache for generic assets
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const isAsset = filePath.includes('assets');
        
        if (isAsset && ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
          // Immutable caching for Vite assets containing hash
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
          // Dynamic static images cache: 30 days
          res.setHeader('Cache-Control', 'public, max-age=2592000');
        } else if (['.css', '.js'].includes(ext)) {
          // Fallback CSS and JS cache: 14 days
          res.setHeader('Cache-Control', 'public, max-age=1209600');
        } else if (filePath.endsWith('index.html')) {
          // HTML main index cache: 1 hour (allows quick rollouts)
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      }
    }));

    app.get("*", (req, res) => {
      // Set short caching for index.html SPA routing
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
