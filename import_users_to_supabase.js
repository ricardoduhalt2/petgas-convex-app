// import_users_to_supabase.js
// Script para importar usuarios desde wp_users_export.json a Supabase

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const users = JSON.parse(fs.readFileSync('wp_users_export.json', 'utf8'));
  let success = 0, fail = 0;

  for (const user of users) {
    const { data, error } = await supabase
      .from('petgas_users')
      .insert([{
        name: user.display_name || user.user_login || 'Sin nombre',
        email: user.user_email,
        phone: user.phone || null,
        role: user.role || 'user',
        source: 'wordpress'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error:', error.message, user.user_email);
      fail++;
    } else {
      console.log('Insertado:', data.email);
      success++;
    }
  }
  console.log(`Importación finalizada. Éxitos: ${success}, Fallos: ${fail}`);
}

main();
