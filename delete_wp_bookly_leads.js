// Script para eliminar todos los leads con source 'wp_bookly' en Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqngpaogpxagisbpmhrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { error, count } = await supabase
    .from('petgas_leads')
    .delete()
    .eq('source', 'wp_bookly');

  if (error) {
    console.error('Error al eliminar leads:', error.message);
  } else {
    console.log('Leads eliminados con source wp_bookly');
  }
}

main();
