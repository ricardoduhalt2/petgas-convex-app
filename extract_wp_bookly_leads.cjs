/**
 * Extrae leads de la tabla wp_bookly_notifications (nombre, email, teléfono, mensaje) y exporta a JSON.
 * Requiere: npm install mysql2
 */

const mysql = require('mysql2/promise');
const fs = require('fs');

const config = {
  host: 'p3plzcpnl489472.prod.phx3.secureserver.net',
  user: 'ricardoduhalt',
  password: 'R1712admin2019!',
  database: 'i9280431_wp2',
  port: 3306
};

async function main() {
  const conn = await mysql.createConnection(config);

  // Extraer todos los registros de wp_bookly_notifications
  const [rows] = await conn.query(
    "SELECT name, message FROM wp_bookly_notifications"
  );

  // Procesar y extraer información de la plantilla del mensaje
  const leads = rows.map(row => {
    // Intentar extraer nombre, email y teléfono usando regex
    const nameMatch = row.message.match(/Nombre del cliente: ([^\\n]+)/);
    const phoneMatch = row.message.match(/Teléfono del cliente: ([^\\n]+)/);
    const emailMatch = row.message.match(/Correo electrónico del cliente: ([^\\n]+)/);

    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      email: emailMatch ? emailMatch[1].trim() : null,
      phone: phoneMatch ? phoneMatch[1].trim() : null,
      message: row.message,
      notification_name: row.name
    };
  });

  fs.writeFileSync('wp_bookly_leads_export.json', JSON.stringify(leads, null, 2));
  console.log('Leads exportados a wp_bookly_leads_export.json:', leads.length);
  await conn.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
