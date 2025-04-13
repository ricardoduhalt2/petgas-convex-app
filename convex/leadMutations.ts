import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    source: v.string(),
    category: v.string(),
    status: v.string(),
    score: v.optional(v.number()),
    // Align metadata argument with the schema definition
    metadata: v.optional(v.object({
      date: v.optional(v.string()),
      body: v.optional(v.string()),
      subject: v.optional(v.string()),
      interest: v.optional(v.string()),
      dialog: v.optional(v.any()),
      comment_id: v.optional(v.number()),
      post_id: v.optional(v.number()),
      notes: v.optional(v.string()),
    }))
  },
  handler: async (ctx, args) => {
    // Add a check for existing lead by email before inserting
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingLead) {
      // Optionally update the existing lead instead of inserting a duplicate
      // For now, we'll just skip insertion if email exists to avoid duplicates
      console.log(`Lead with email ${args.email} already exists. Skipping insertion.`);
      return; // Or throw an error, or update logic
    }

    await ctx.db.insert("leads", {
      email: args.email,
      name: args.name,
      source: args.source,
      category: args.category,
      status: args.status,
      score: args.score || 0,
      metadata: args.metadata || {}
    });
  }
});

// Nueva mutación para clasificar leads con IA (Gemini)
export const classifyWithAI = mutation({
  args: {
    leadId: v.id("leads"),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    // Obtener el texto relevante para clasificar (ej: cuerpo del email o diálogo)
    const textToClassify = lead.metadata?.body || lead.metadata?.dialog || lead.name;
    if (!textToClassify) {
      console.log(`Lead ${args.leadId} has no text to classify.`);
      return; // O asignar categoría por defecto
    }

    // Obtener la API Key de Gemini desde las variables de entorno de Convex
    // IMPORTANTE: Configurar GEMINI_API_KEY en el dashboard de Convex
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set in Convex dashboard.");
    }

    // Preparar el prompt para Gemini
    const prompt = `
      Clasifica el siguiente lead para una empresa de transformacion de plásticos y venta de plantas de pirólisis.
      Categorías posibles: "Inversor/Empresa", "Participación Ciudadana", "Entrega de Desechos", "Información General", "Otro", "Spam".
      Analiza la intención, urgencia y potencial del lead.
      Devuelve solo la categoría más apropiada.

      Texto del lead:
      "${textToClassify}"

      Categoría:
    `;

    console.log(`Clasificando lead ${args.leadId} con Gemini...`);

    // --- INICIO: Lógica comentada para llamar a Gemini API ---
    /*
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      // Extraer la categoría de la respuesta de Gemini (ajustar según formato real)
      const category = result.candidates[0]?.content?.parts[0]?.text?.trim();

      if (category) {
        // Actualizar el lead en Convex con la categoría clasificada
        await ctx.db.patch(args.leadId, { category: category });
        console.log(`Lead ${args.leadId} clasificado como: ${category}`);
      } else {
        console.log(`No se pudo extraer la categoría de la respuesta de Gemini para el lead ${args.leadId}.`);
      }

    } catch (error) {
      console.error(`Error al clasificar lead ${args.leadId} con Gemini:`, error);
      // Opcional: reintentar o marcar el lead para revisión manual
    }
    */
    // --- FIN: Lógica comentada para llamar a Gemini API ---

    // Por ahora, solo logueamos que se intentaría clasificar
    console.log(`(Simulado) Clasificación AI para lead ${args.leadId} con texto: "${textToClassify.substring(0, 50)}..."`);
    // TODO: Descomentar y probar la llamada real a la API de Gemini cuando esté lista.
  }
});
