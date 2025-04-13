// import_wp_leads_to_supabase.js
// Script para importar leads desde wp_leads_export.json a Supabase

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function main() {
  const leads = JSON.parse(fs.readFileSync('wp_leads_export.json', 'utf8'));
  let success = 0, fail = 0;

  for (const lead of leads) {
    const cleanedMessage = cleanText(lead.message || "");
    const email = lead.email || null;
    // Verificar si ya existe un lead con este email
    const { data: existing, error: findError } = await supabase
      .from('petgas_leads')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      console.error('Error al buscar duplicado:', findError.message, email);
      fail++;
      continue;
    }
    if (existing) {
      console.log('Duplicado, no insertado:', email);
      continue;
    }

    const { data, error } = await supabase
      .from('petgas_leads')
      .insert([{
        name: lead.name || 'Sin nombre',
        email,
        phone: lead.phone || null,
        source: 'wp_comment',
        category: null,
        metadata: {
          body: cleanedMessage,
          date: lead.date || null
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error:', error.message, email);
      fail++;
    } else {
      console.log('Insertado:', data.email);
      success++;
    }
  }
  console.log(`Importación finalizada. Éxitos: ${success}, Fallos: ${fail}`);
}

main();
