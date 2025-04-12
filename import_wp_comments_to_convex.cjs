/**
 * Script para importar comentarios de WordPress (wp_comments) a Convex como leads tipo "comment".
 * Requiere: npm install mysql2 node-fetch@2
 */

const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const fs = require('fs');

const config = {
  host: 'p3plzcpnl489472.prod.phx3.secureserver.net',
  user: 'ricardoduhalt',
  password: 'R1712admin2019!',
  database: 'i9280431_wp2',
  port: 3306
};

const CONVEX_URL = process.env.CONVEX_SITE_URL + '/import-leads';
const CONVEX_DEPLOY_KEY = 'dev:frugal-pony-197|eyJ2MiI6ImYwM2ZlNDFjODg4MjRkYTA5YzRhYThjYmExMWYwNjQ2In0=';

async function main() {
  const conn = await mysql.createConnection(config);

  // Extraer comentarios aprobados con email y contenido no vacío
  const [rows] = await conn.query(`
    SELECT comment_author, comment_author_email, comment_content, comment_date
    FROM wp_comments
    WHERE comment_approved = '1'
      AND comment_author_email != ''
      AND comment_content != ''
    LIMIT 200
  `);

  for (const row of rows) {
    const payload = {
      email: row.comment_author_email,
      name: row.comment_author,
      source: "wp_comment",
      category: "comment",
      status: "new",
      metadata: {
        body: row.comment_content,
        date: row.comment_date
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
      console.error(`Error importando comentario:`, await res.text());
    } else {
      console.log(`Importado comentario de: ${row.comment_author} (${row.comment_author_email})`);
    }
  }

  await conn.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
