import express from "express";
import cors from "cors";
import { classifyLead } from "./gemini_classifier.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para clasificación AI de leads bajo demanda
app.post("/classify-lead", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Falta el texto a clasificar" });
    }
    const category_ai = await classifyLead(text);
    res.json({ category_ai });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ...otros endpoints existentes...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Import server running on port ${PORT}`);
});
