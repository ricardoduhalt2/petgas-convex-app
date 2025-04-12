# AI Project Context — PETGAS Ecosystem Manager

## Resumen técnico y de decisiones para agentes AI

### Estructura y objetivo
- CRM para leads de reciclaje/planta de pirólisis.
- Stack: React, Convex (backend serverless y base de datos), TailwindCSS.
- Leads pueden venir de WordPress, WhatsApp, redes sociales, emails, o manualmente.
- Integración con WordPress: extracción de usuarios desde MySQL.
- Integración con correo: extracción de leads desde IMAP.

---

## Cambios y scripts realizados

### Extracción de usuarios de WordPress
- Script: `extract_wp_users.js`
  - Conecta a MySQL remoto, extrae usuarios de `wp_users` y metadatos, exporta a `wp_users_export.json`.

### Importación de usuarios a Convex
- Script: `import_users_to_convex.js`
  - Lee `wp_users_export.json` y usa la mutation `leads:create` para insertar cada usuario como lead en Convex.

### Extracción de leads desde correo electrónico
- Script: `extract_email_leads.js`
  - Conecta vía IMAP, extrae remitente, asunto, fecha y cuerpo, exporta a `email_leads_export.json`.

### Importación de leads de correo a Convex
- Script: `import_email_leads_to_convex.js`
  - Lee `email_leads_export.json` y usa la mutation `leads:create` para insertar cada lead en Convex.

---

## Checklist técnico y de integración

### Completado
- [x] Extracción de usuarios de WordPress vía MySQL remoto.
- [x] Importación de usuarios de WordPress a Convex.
- [x] Extracción de leads desde correo IMAP.
- [x] Importación de leads de correo a Convex.
- [x] Instalación y uso del CLI de Convex localmente.

### Pendiente / Siguiente pasos
- [ ] Automatizar ejecución periódica de scripts (cron o similar).
- [ ] Mejorar parsing de roles y metadatos de usuarios de WordPress.
- [ ] Enriquecer parsing de correos para leads (extraer teléfono, nombre, etc.).
- [ ] Unificar lógica de deduplicación de leads.
- [ ] Integrar otras fuentes (WhatsApp, redes sociales).
- [ ] Mejorar UI para visualizar leads importados.
- [ ] Documentar endpoints y scripts para onboarding de nuevos agentes AI/humanos.

---

## Decisiones y contexto relevante

- El deployment Convex activo es: `frugal-pony-197`
- Deploy key: `dev:frugal-pony-197|eyJ2MiI6IjEwMWFlYzhiYzVhYjQ1MTE4Y2U5MmY3YzM0N2QyOTc0In0=`
- Mutations principales: `leads:create`, `importFromWordpress`
- Scripts clave: `extract_wp_users.js`, `import_users_to_convex.js`, `extract_email_leads.js`, `import_email_leads_to_convex.js`
- Correo IMAP: `enlace@petgas.com.mx` (host: mail.petgas.com.mx, puerto: 993, SSL)
- MySQL remoto: host `p3plzcpnl489472.prod.phx3.secureserver.net`, usuario `ricardoduhalt`, base `i9280431_wp2`

---

## Cómo continuar (para agentes AI/humanos)

1. Leer este archivo para entender el estado y los scripts disponibles.
2. Revisar y actualizar scripts según nuevas fuentes o cambios de estructura.
3. Usar el CLI de Convex para administrar funciones y datos.
4. Mantener este archivo actualizado tras cada cambio relevante.
