/**
 * Script para importar usuarios de wp_users_export.json a Convex como leads.
 * Requiere: node >=18 (fetch global), archivo wp_users_export.json, y deploy key Convex.
 */

const fs = require('fs');
const path = require('path');

const CONVEX_URL = 'https://frugal-pony-197.convex.cloud/api/importFromWordpress'; // Cambia por la mutation adecuada si es necesario
const CONVEX_DEPLOY_KEY = 'dev:frugal-pony-197|eyJ2MiI6IjEwMWFlYzhiYzVhYjQ1MTE4Y2U5MmY3YzM0N2QyOTc0In0=';

async function importUsers() {
  const usersPath = path.join(__dirname, 'wp_users_export.json');
  if (!fs.existsSync(usersPath)) {
    console.error('No se encontró wp_users_export.json');
    process.exit(1);
  }
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  for (const user of users) {
    // Construir el payload para la mutation de Convex
    const payload = {
      // Ajusta los campos según la mutation que uses en Convex
      source: 'wordpress',
      category: 'user',
      name: user.displayName || user.username,
      email: user.email,
      phone: undefined,
      metadata: {
        notes: `Importado de WordPress. ID: ${user.id}, username: ${user.username}, role: ${user.role}`,
      }
    };

    // Llamar a la mutation create de leads (ajusta el endpoint si tienes una mutation específica)
    const res = await fetch('https://frugal-pony-197.convex.cloud/api/functions/leads:create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONVEX_DEPLOY_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ args: payload })
    });

    if (!res.ok) {
      console.error(`Error importando usuario ${user.username}:`, await res.text());
    } else {
      console.log(`Importado usuario ${user.username} (${user.email})`);
    }
  }
}

importUsers().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
