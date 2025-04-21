// gemini_classifier.js
// Utilidad para clasificar leads usando Gemini API

import fetch from 'node-fetch';

const GEMINI_API_KEY = "AIzaSyBMMaFEQBuZriY5mHWWWiOOYyLshp2XjE4";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Lista de categorías/embudos inteligentes
export const LEAD_CATEGORIES = [
  "Inversor",
  "Ciudadano",
  "Empresa",
  "Desea vender plástico",
  "Solo información",
  "Voluntario",
  "Spam"
];

/**
 * Clasifica un lead usando Gemini API.
 * @param {string} text - Texto del lead (cuerpo, asunto, etc).
 * @returns {Promise<string>} - Categoría sugerida.
 */
export async function classifyLead(text) {
  const prompt = `Clasifica este lead en una de las siguientes categorías: ${LEAD_CATEGORIES.join(", ")}. 
Devuelve solo la categoría más relevante. Texto del lead: """${text}"""`;

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  // Extraer la categoría de la respuesta
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  // Normalizar: devolver solo la categoría reconocida
  const found = LEAD_CATEGORIES.find(cat =>
    output.toLowerCase().includes(cat.toLowerCase())
  );
  return found || output || "Sin clasificar";
}
