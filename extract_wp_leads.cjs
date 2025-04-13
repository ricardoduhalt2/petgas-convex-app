/**
 * Extrae leads de la tabla wp_comments (nombre, email, mensaje, teléfono si se detecta) y exporta a JSON.
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

// Regex para detectar teléfonos en el mensaje
const phoneRegex = /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{7,}/g;

async function main() {
  const conn = await mysql.createConnection(config);

  // Extraer todos los comentarios aprobados y de tipo 'comment'
  const [rows] = await conn.query(
    "SELECT comment_author, comment_author_email, comment_content, comment_date FROM wp_comments WHERE comment_approved = '1' AND comment_type = 'comment'"
  );

  // Procesar y extraer teléfono si existe en el mensaje
  const leads = rows.map(row => {
    const phones = row.comment_content.match(phoneRegex);
    return {
      name: row.comment_author,
      email: row.comment_author_email,
      message: row.comment_content,
      phone: phones ? phones[0] : null,
      date: row.comment_date
    };
  });

  fs.writeFileSync('wp_leads_export.json', JSON.stringify(leads, null, 2));
  console.log('Leads exportados a wp_leads_export.json:', leads.length);
  await conn.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
