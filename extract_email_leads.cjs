/**
 * Script para extraer leads desde correos IMAP y exportar a JSON.
 * Requiere: npm install imap-simple mailparser
 */

const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');

const config = {
  imap: {
    user: 'enlace@petgas.com.mx',
    password: 'T)6vwb}kRCvv',
    host: 'mail.petgas.com.mx',
    port: 143,
    tls: false,
    authTimeout: 10000
  },
  onauth: function() {
    console.log('Authenticated, upgrading to STARTTLS...');
  }
};

async function main() {
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');

  // Buscar los últimos 50 correos no eliminados
  const searchCriteria = ['ALL', ['SINCE', '01-Jan-2024']];
  const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

  const messages = await connection.search(searchCriteria, fetchOptions);

  const leads = [];
  for (const item of messages) {
    const all = item.parts.find(part => part.which === 'HEADER');
    const id = item.attributes.uid;
    const subject = all?.body.subject ? all.body.subject[0] : '';
    const from = all?.body.from ? all.body.from[0] : '';
    const date = all?.body.date ? all.body.date[0] : '';

    // Obtener el cuerpo del mensaje
    const bodyPart = item.parts.find(part => part.which === 'TEXT');
    let body = '';
    if (bodyPart) {
      try {
        const parsed = await simpleParser(bodyPart.body);
        // Limpiar HTML y dejar solo texto plano
        if (parsed.text) {
          body = parsed.text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        } else {
          body = bodyPart.body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        }
      } catch (e) {
        body = bodyPart.body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      }
    }

    leads.push({
      id,
      from,
      subject,
      date,
      body
    });
  }

  // Asegurar formato JSON válido con array y comas
  fs.writeFileSync('email_leads_export.json', '[\n' + 
    leads.map(lead => JSON.stringify(lead, null, 2)).join(',\n') + '\n]');
  console.log(`Exportados ${leads.length} leads de correo a email_leads_export.json`);

  await connection.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
