import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API: Criar Sessão de Checkout do Stripe
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { items } = req.body;

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], 
        line_items: lineItems,
        mode: "payment",
        // TAXA DA PLATAFORMA (Exemplo: R$ 1,00 por pedido = 100 centavos)
        // No Stripe Connect, você usaria 'application_fee_amount'
        // Para este protótipo, vamos simular a lógica:
        payment_intent_data: {
          application_fee_amount: 100, // Sua comissão de R$ 1,00 em centavos
          // transfer_data: {
          //   destination: item.restaurant_stripe_id, // ID da conta do restaurante
          // },
        },
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/?success=true`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/?canceled=true`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Erro no Stripe:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware para desenvolvimento
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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
