// clean_email_lead_text.js
// Limpia un archivo de texto eliminando cabeceras MIME, límites, Base64, entidades HTML corruptas/no estándar y fragmentos binarios/no imprimibles.
// Conserva solo letras, números, puntuación básica (. , ; : ! ?), espacios y saltos de línea normales.

import fs from 'fs';

/**
 * Limpia texto de email eliminando cabeceras MIME, base64, entidades HTML corruptas y binarios.
 * @param {string} input
 * @returns {string}
 */
export function cleanText(input) {
  let text = input;

  // 0. Eliminar etiquetas HTML
  text = text.replace(/<[^>]+>/g, ' ');

  // 0.1 Decodificar entidades HTML básicas
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&/gi, '&')
    .replace(/</gi, '<')
    .replace(/>/gi, '>')
    .replace(/"/gi, '"')
    .replace(/&#39;/gi, "'");

  // 1. Eliminar cabeceras MIME y límites (líneas que empiezan con -=__NextPart o contienen Content-Type, Content-Transfer-Encoding, etc.)
  text = text.replace(/^[-=]{2,}.*$/gmi, '');
  text = text.replace(/^Content-(Type|Transfer-Encoding|Disposition).*$/gmi, '');

  // 2. Eliminar cadenas Base64 (líneas largas de letras mayúsculas/minúsculas, números, +, /, =, típicamente >40 caracteres sin espacios)
  text = text.replace(/^[A-Za-z0-9+/=]{40,}$/gm, '');

  // 3. Eliminar entidades HTML corruptas o no estándar (ej: <, >, &eacute;, =0D=0A, etc.)
  // a) Entidades HTML
  text = text.replace(/&[a-zA-Z0-9#]+;/g, '');
  // b) Secuencias tipo =0D=0A (quoted-printable)
  text = text.replace(/(=[A-F0-9]{2})+/gi, '');

  // 4. Eliminar fragmentos binarios o no imprimibles (líneas con muchos caracteres no ASCII o hexadecimales tipo 0x00, 0xFF)
  text = text.replace(/0x[0-9A-Fa-f]{2,}/g, '');
  // Eliminar líneas con más del 30% de caracteres no imprimibles
  text = text.split('\n').filter(line => {
    const nonPrintable = (line.match(/[^ -~\n\r\t]/g) || []).length;
    return line.length === 0 || (nonPrintable / line.length) < 0.3;
  }).join('\n');

  // 5. Conservar solo letras, números, puntuación básica, espacios y saltos de línea normales
  text = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:!?\s]/g, '');

  // 6. Limpiar espacios y saltos de línea redundantes
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/^\s+|\s+$/gm, '');

  // 7. Eliminar líneas vacías redundantes
  text = text.replace(/^\s*[\r\n]/gm, '');

  return text.trim();
}

// CLI support
if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.length < 3) {
    console.error('Uso: node clean_email_lead_text.js <archivo_entrada> [archivo_salida]');
    process.exit(1);
  }
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];

  const input = fs.readFileSync(inputFile, 'utf8');
  const cleaned = cleanText(input);

  if (outputFile) {
    fs.writeFileSync(outputFile, cleaned, 'utf8');
    console.log(`Archivo limpio guardado en: ${outputFile}`);
  } else {
    console.log(cleaned);
  }
}

export default cleanText;
