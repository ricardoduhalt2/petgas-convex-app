/**
 * Script para analizar todas las tablas de la base de datos WordPress remota,
 * buscar columnas que puedan contener nombre, email y mensaje, y exportar los resultados.
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

  // Obtener todas las tablas
  const [tables] = await conn.query('SHOW TABLES');
  const tableNames = tables.map(row => Object.values(row)[0]);

  const candidates = [];

  for (const table of tableNames) {
    // Obtener columnas de la tabla
    const [columns] = await conn.query(`SHOW COLUMNS FROM \`${table}\``);
    const colNames = columns.map(col => col.Field);

    // Buscar posibles combinaciones de nombre, email y mensaje
    const hasName = colNames.some(c => /name|nombre/i.test(c));
    const hasEmail = colNames.some(c => /email|correo/i.test(c));
    const hasMsg = colNames.some(c => /message|mensaje|comment|content|body|text/i.test(c));

    if ((hasName || hasEmail) && hasMsg) {
      // Extraer hasta 10 ejemplos
      const selectCols = colNames.filter(c => /name|nombre|email|correo|message|mensaje|comment|content|body|text/i.test(c));
      const [rows] = await conn.query(
        `SELECT ${selectCols.map(c => `\`${c}\``).join(', ')} FROM \`${table}\` LIMIT 10`
      );
      candidates.push({
        table,
        columns: selectCols,
        examples: rows
      });
    }
  }

  fs.writeFileSync('wp_message_candidates.json', JSON.stringify(candidates, null, 2));
  console.log('Análisis completado. Resultados en wp_message_candidates.json');
  await conn.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
