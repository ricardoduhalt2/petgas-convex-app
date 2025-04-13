// Script para limpiar el campo metadata.body de un lead específico por id en Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const leadId = 'b27359bc-65c4-4cd7-a545-2b5b329e9ade';

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
  const { data: lead, error } = await supabase
    .from('petgas_leads')
    .select('id, metadata')
    .eq('id', leadId)
    .single();

  if (error) {
    console.error('Error al obtener el lead:', error.message);
    return;
  }

  if (lead && lead.metadata && lead.metadata.body) {
    const cleaned = cleanText(lead.metadata.body);
    if (cleaned !== lead.metadata.body) {
      const newMetadata = { ...lead.metadata, body: cleaned };
      const { error: updateError } = await supabase
        .from('petgas_leads')
        .update({ metadata: newMetadata })
        .eq('id', leadId);
      if (!updateError) {
        console.log(`Lead ${leadId} limpiado y actualizado.`);
      } else {
        console.error('Error al actualizar el lead:', updateError.message);
      }
    } else {
      console.log('El mensaje ya está limpio.');
    }
  } else {
    console.log('No se encontró el lead o no tiene metadata.body.');
  }
}

main();
