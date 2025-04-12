/**
 * Orquestador para ejecutar todo el flujo de extracción e importación de leads.
 * Ejecuta en orden:
 * 1. extract_wp_users.js
 * 2. import_users_to_convex.js
 * 3. extract_email_leads.js
 * 4. import_email_leads_to_convex.js
 * 
 * Requiere: node >=18
 */

const { execSync } = require('child_process');

function runScript(script) {
  console.log(`\n--- Ejecutando: ${script} ---`);
  try {
    execSync(`node ${script}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error ejecutando ${script}:`, err);
    process.exit(1);
  }
}

function main() {
  runScript('extract_wp_users.js');
  runScript('import_users_to_convex.js');
  runScript('extract_email_leads.js');
  runScript('import_email_leads_to_convex.js');
  console.log('\n--- Flujo de integración completado ---');
}

main();
