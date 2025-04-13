import express from 'express';
import { exec } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 4000;

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post('/import-email-leads', (req, res) => {
  exec('node import_email_leads_to_supabase.js', (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message, stderr });
      return;
    }
    res.json({ success: true, output: stdout });
  });
});

app.post('/import-wp-leads', (req, res) => {
  exec('node import_wp_leads_to_supabase.js', (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message, stderr });
      return;
    }
    res.json({ success: true, output: stdout });
  });
});

app.use(express.json());

app.post('/api/import-whatsapp-lead', async (req, res) => {
  try {
    const { name, email, source, category, metadata } = req.body;
    if (!email || !name) {
      res.status(400).json({ success: false, error: "Faltan campos obligatorios" });
      return;
    }

    // Limpieza de mensaje
    function cleanText(html) {
      if (!html) return "";
      let text = html.replace(/<img[^>]*>/gi, " ");
      text = text.replace(/<[^>]+>/g, " ");
      text = text.replace(/&nbsp;/gi, " ")
                 .replace(/&/gi, "&")
                 .replace(/</gi, "<")
                 .replace(/>/gi, ">")
                 .replace(/"/gi, '"')
                 .replace(/&#39;/gi, "'");
      text = text.replace(/[^\x20-\x7EáéíóúÁÉÍÓÚñÑüÜ¡¿]/g, " ");
      text = text.replace(/\s+/g, " ").trim();
      return text;
    }

    const cleanedBody = cleanText(metadata?.body || "");
    // Buscar lead existente
    const { data: existing, error: findError } = await supabase
      .from('petgas_leads')
      .select('id, metadata')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      res.status(500).json({ success: false, error: findError.message });
      return;
    }

    if (existing) {
      // Acumular mensajes en metadata.messages
      const prevMeta = existing.metadata || {};
      const prevMessages = Array.isArray(prevMeta.messages) ? prevMeta.messages : [];
      const newMsg = {
        body: cleanedBody,
        interest: metadata?.interest || "",
        date: new Date().toISOString(),
        ...metadata
      };
      const updatedMeta = {
        ...prevMeta,
        messages: [...prevMessages, newMsg]
      };
      const { error: updateError } = await supabase
        .from('petgas_leads')
        .update({ metadata: updatedMeta })
        .eq('id', existing.id);
      if (updateError) {
        res.status(500).json({ success: false, error: updateError.message });
        return;
      }
      res.json({ success: true, updated: true, id: existing.id });
      return;
    }

    // Insertar nuevo lead
    const { error: insertError } = await supabase
      .from('petgas_leads')
      .insert([{
        name,
        email,
        phone: null,
        source: source || "whatsapp_web",
        category: category || "whatsapp",
        metadata: {
          ...metadata,
          body: cleanedBody,
          messages: [
            {
              body: cleanedBody,
              interest: metadata?.interest || "",
              date: new Date().toISOString(),
              ...metadata
            }
          ]
        }
      }]);
    if (insertError) {
      res.status(500).json({ success: false, error: insertError.message });
      return;
    }
    res.json({ success: true, inserted: true });
  } catch (err) {
    console.error("Error en /api/import-whatsapp-lead:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Import server listening on http://localhost:${PORT}`);
});
