// import_email_leads_to_supabase.js
// Script para importar leads desde email_leads_export.json a Supabase

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
  const leads = JSON.parse(fs.readFileSync('email_leads_export.json', 'utf8'));
  let success = 0, fail = 0;

  for (const lead of leads) {
    const cleanedBody = cleanText(lead.body || "");
    const email = extractEmail(lead.from);
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
      // Si ya existe, agregar el nuevo mensaje al array metadata.messages
      const { data: existingLead, error: getError } = await supabase
        .from('petgas_leads')
        .select('metadata')
        .eq('id', existing.id)
        .single();

      if (getError) {
        console.error('Error al obtener metadata existente:', getError.message, email);
        fail++;
        continue;
      }

      // Acumular mensajes en metadata.messages (array)
      const prevMeta = existingLead?.metadata || {};
      const prevMessages = Array.isArray(prevMeta.messages) ? prevMeta.messages : [];
      const newMsg = {
        body: cleanedBody,
        subject: lead.subject || '',
        date: new Date().toISOString(),
        ...lead.metadata
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
        console.error('Error al actualizar lead existente:', updateError.message, email);
        fail++;
      } else {
        console.log('Mensaje agregado a lead existente:', email);
        success++;
      }
      continue;
    }

    const { data, error } = await supabase
      .from('petgas_leads')
      .insert([{
        name: lead.name || lead.from || 'Sin nombre',
        email,
        phone: lead.phone || null,
        source: 'email',
        category: lead.category || null,
        metadata: {
          body: cleanedBody,
          subject: lead.subject || '',
          messages: [
            {
              body: cleanedBody,
              subject: lead.subject || '',
              date: new Date().toISOString(),
              ...lead.metadata
            }
          ],
          ...lead.metadata
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

function extractEmail(fromField) {
  if (!fromField) return null;
  // Extrae el email de un campo tipo "Nombre <email@dominio.com>"
  const match = fromField.match(/<([^>]+)>/);
  if (match) return match[1];
  // Si no hay <>, intenta devolver el string si parece un email
  if (fromField.includes('@')) return fromField.trim();
  return null;
}

main();
