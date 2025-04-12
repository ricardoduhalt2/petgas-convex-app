/**
 * Script para importar leads de email_leads_export.json a Convex como leads.
 * Requiere: node >=18 (fetch global), archivo email_leads_export.json, y deploy key Convex.
 */

const fs = require('fs');
const path = require('path');

const CONVEX_URL = process.env.CONVEX_SITE_URL + '/import-leads';
const CONVEX_DEPLOY_KEY = 'dev:frugal-pony-197|eyJ2MiI6ImYwM2ZlNDFjODg4MjRkYTA5YzRhYThjYmExMWYwNjQ2In0=';

function extractEmail(from) {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from;
}

async function importEmailLeads() {
  const leadsPath = path.join(__dirname, 'email_leads_export.json');
  if (!fs.existsSync(leadsPath)) {
    console.error('No se encontró email_leads_export.json');
    process.exit(1);
  }
  const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));

  for (const lead of leads) {
    // Construir el payload para la mutation de Convex
    const payload = {
      email: extractEmail(lead.from),
      name: lead.from.split('<')[0].trim() || 'Desconocido',
      source: "email",
      category: "lead",
      status: "new",
      metadata: {
        subject: lead.subject || "",
        date: lead.date || "",
        body: lead.body || ""
      }
    };

    // Llamar a la mutation create de leads
    const res = await fetch(CONVEX_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONVEX_DEPLOY_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`Error importando lead de email:`, await res.text());
    } else {
      console.log(`Importado lead de email: ${lead.from} (${lead.subject})`);
    }
  }
}

importEmailLeads().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
