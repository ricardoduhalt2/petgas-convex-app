/**
 * Script para extraer usuarios de WordPress desde MySQL y exportar a JSON.
 * Requiere: npm install mysql2
 */

const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  // DATOS DE CONEXIÓN: AJUSTA ESTOS VALORES
  const connection = await mysql.createConnection({
    host: 'p3plzcpnl489472.prod.phx3.secureserver.net',
    user: 'ricardoduhalt', // Cambia por el usuario real de la base de datos MySQL
    password: 'R1712admin2019!', // Cambia por la contraseña real de la base de datos MySQL
    database: 'i9280431_wp2',
    port: 3306,
    // Si usas SSL, puedes agregar: ssl: { rejectUnauthorized: false }
  });

  // Consulta básica de usuarios
  const [users] = await connection.execute('SELECT ID, user_login, user_email, user_registered, display_name FROM wp_users');

  // Puedes extraer más datos de wp_usermeta si lo necesitas
  // Ejemplo: obtener el rol de usuario
  const userIds = users.map(u => u.ID);
  const [usermeta] = await connection.query(
    `SELECT user_id, meta_key, meta_value FROM wp_usermeta WHERE user_id IN (${userIds.join(',')})`
  );

  // Mapear metadatos por usuario
  const metaByUser = {};
  for (const meta of usermeta) {
    if (!metaByUser[meta.user_id]) metaByUser[meta.user_id] = {};
    metaByUser[meta.user_id][meta.meta_key] = meta.meta_value;
  }

  // Construir objetos de usuario enriquecidos
  const enrichedUsers = users.map(u => ({
    id: u.ID,
    username: u.user_login,
    email: u.user_email,
    registered: u.user_registered,
    displayName: u.display_name,
    role: metaByUser[u.ID]?.['wp_capabilities'] || '',
    // Puedes agregar más campos de usermeta aquí si lo necesitas
  }));

  // Guardar a archivo JSON
  fs.writeFileSync('wp_users_export.json', JSON.stringify(enrichedUsers, null, 2));
  console.log(`Exportados ${enrichedUsers.length} usuarios a wp_users_export.json`);

  await connection.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
