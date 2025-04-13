// import_wp_bookly_leads_to_supabase.js
// Script para importar leads desde wp_bookly_leads_export.json a Supabase

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const leads = JSON.parse(fs.readFileSync('wp_bookly_leads_export.json', 'utf8'));
  let success = 0, fail = 0;

  for (const lead of leads) {
    const { data, error } = await supabase
      .from('petgas_leads')
      .insert([{
        name: lead.name || 'Sin nombre',
        email: lead.email || null,
        phone: lead.phone || null,
        source: 'wp_bookly',
        category: null,
        metadata: {
          body: lead.message || '',
          notification_name: lead.notification_name || null
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error:', error.message, lead.email);
      fail++;
    } else {
      console.log('Insertado:', data.email);
      success++;
    }
  }
  console.log(`Importación finalizada. Éxitos: ${success}, Fallos: ${fail}`);
}

main();
