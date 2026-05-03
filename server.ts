import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for demonstration purposes
  // In a real app, use a database (Firebase, SQLite, PostgreSQL)
  const paidEmails = new Set<string>();

  // Kiwify Webhook Endpoint
  app.post("/api/kiwify-webhook", (req, res) => {
    const { order_status, customer } = req.body;

    console.log("Kiwify Webhook received:", req.body);

    if (order_status === "paid" || order_status === "approved" || order_status === "completed") {
      if (customer && customer.email) {
        paidEmails.add(customer.email.toLowerCase());
        console.log(`Payment confirmed for: ${customer.email}`);
      }
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).send("OK");
  });

  // Check payment status
  app.get("/api/check-payment", (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const isPaid = paidEmails.has(email.toLowerCase());
    res.json({ isPaid });
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
