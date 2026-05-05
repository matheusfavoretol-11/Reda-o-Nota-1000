import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
let supabaseUrl = (
  process.env.VITE_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  ""
).trim().replace(/^["']|["']$/g, "");

const supabaseAnonKey = (
  process.env.VITE_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  ""
).trim().replace(/^["']|["']$/g, "");

const supabaseServiceKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  ""
).trim().replace(/^["']|["']$/g, "") || supabaseAnonKey;

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
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.error("CRITICAL: Supabase credentials missing in server.");
}

// Gemini Setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  console.log("--- SERVER INITIALIZATION ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("VITE_SUPABASE_URL present:", !!process.env.VITE_SUPABASE_URL);
  console.log("VITE_SUPABASE_ANON_KEY present:", !!process.env.VITE_SUPABASE_ANON_KEY);
  console.log("-----------------------------");

  // AI Correction Endpoint (Proxied for security)
  app.post("/api/correct", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
      const systemInstruction = `Você é a Malu, uma especialista em correção de redação do ENEM.
Seu estilo é ÚNICO: você é extremamente engraçada, descontraída, usa gírias modernas, mas na hora de corrigir, você é CIRÚRGICA e CORRETA.  

Diretrizes:
1. Analise o texto com base nas 5 competências do ENEM.
2. Dê uma nota aproximada (0-1000).
3. Faça apontamentos sobre erros de gramática, tese fraca, falta de repertório ou conclusão incompleta.
4. Use um tom de "melhor amiga sincerona" ou "professora gente boa que não aguenta mais ver erro bobo".
5. Seja motivadora no final, mas não passe a mão na cabeça se o texto estiver ruim.

Formato da resposta:
- Comece com uma reação inicial engraçada ao texto.
- Use seções claras (mas com nomes divertidos) para cada competência.
- Termine com um "Veredito da Malu" (Nota e Plano de Ação).`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemInstruction}\n\nTexto para correção:\n${text}`,
      });

      res.json({ feedback: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Erro ao processar a correção pela Malu." });
    }
  });

  // Kiwify Webhook Endpoint
  app.post("/api/kiwify-webhook", async (req, res) => {
    const { order_status, customer, order_id } = req.body;

    console.log("Kiwify Webhook received:", req.body);

    if (order_status === "paid" || order_status === "approved" || order_status === "completed") {
      if (customer && customer.email) {
        const email = customer.email.toLowerCase();
        
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
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
          } else {
            console.log(`Payment confirmed and saved for: ${email}`);
          }
        } catch (e) {
          console.error("Supabase Operation Failed:", e);
        }
      }
    }

    res.status(200).send("OK");
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

      const isPaid = !!data && (data.status === "paid" || data.status === "approved" || data.status === "completed");
      res.json({ isPaid });
    } catch (e) {
      res.json({ isPaid: false });
    }
  });

  // Dynamic Supabase Config for Client - AI Studio Fix
  app.get("/api/config/supabase", (req, res) => {
    res.json({
      url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
      key: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
