import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Kiwify Webhook Endpoint
  app.post("/api/kiwify-webhook", async (req, res) => {
    const { order_status, customer, order_id } = req.body;

    console.log("Kiwify Webhook received:", req.body);

    if (order_status === "paid" || order_status === "approved" || order_status === "completed") {
      if (customer && customer.email) {
        const email = customer.email.toLowerCase();
        
        try {
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
