// Script para forzar el valor de metadata.body de un lead específico en Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const leadId = 'b27359bc-65c4-4cd7-a545-2b5b329e9ade';
const testText = 'MENSAJE LIMPIO DE PRUEBA';

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

  if (lead && lead.metadata) {
    const newMetadata = { ...lead.metadata, body: testText };
    const { error: updateError } = await supabase
      .from('petgas_leads')
      .update({ metadata: newMetadata })
      .eq('id', leadId);
    if (!updateError) {
      console.log(`Lead ${leadId} actualizado con texto de prueba.`);
    } else {
      console.error('Error al actualizar el lead:', updateError.message);
    }
  } else {
    console.log('No se encontró el lead o no tiene metadata.');
  }
}

main();
