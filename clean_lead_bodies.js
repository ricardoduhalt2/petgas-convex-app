// Script para limpiar el campo metadata.body de petgas_leads en Supabase, dejando solo texto plano, procesando en lotes

import { createClient } from '@supabase/supabase-js';

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
  const pageSize = 100;
  let page = 0;
  let totalUpdated = 0;
  while (true) {
    let { data: leads, error } = await supabase
      .from('petgas_leads')
      .select('id, metadata')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('Error al obtener leads:', error.message);
      break;
    }
    if (!leads || leads.length === 0) break;

    let updated = 0;
    for (const lead of leads) {
      if (lead.metadata && lead.metadata.body) {
        const cleaned = cleanText(lead.metadata.body);
        if (cleaned !== lead.metadata.body) {
          const newMetadata = { ...lead.metadata, body: cleaned };
          const { error: updateError } = await supabase
            .from('petgas_leads')
            .update({ metadata: newMetadata })
            .eq('id', lead.id);
          if (!updateError) updated++;
        }
      }
    }
    totalUpdated += updated;
    console.log(`Página ${page + 1}: mensajes limpiados y actualizados: ${updated}`);
    if (leads.length < pageSize) break;
    page++;
  }
  console.log(`Total de mensajes limpiados y actualizados: ${totalUpdated}`);
}

main();
