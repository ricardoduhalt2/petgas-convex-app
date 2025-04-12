# PETGAS Ecosystem Manager

## Descripción general

Plataforma para captación, segmentación y optimización de leads para reciclaje y venta de plantas de pirólisis. Centraliza leads provenientes de WordPress, correo electrónico y otras fuentes, integrando todo en Convex para su gestión, visualización y automatización inteligente.

### Meta del proyecto (visión AI-first)
- Construir embudos automáticos que clasifiquen y prioricen leads de múltiples fuentes (WordPress, email, etc.).
- Analizar el cuerpo, asunto y metadatos de los correos para separar:
  - Leads con intención real de inversión/compra.
  - Leads interesados en participar voluntariamente.
  - Leads que solo buscan información o no aportan valor.
  - Leads que desean entregar desechos plásticos.
- Automatizar respuestas: 
  - Enviar documentación a interesados reales.
  - Delegar tareas a voluntarios.
  - Filtrar y responder automáticamente a curiosos o spam.
- Reducir la carga operativa y permitir que la AI gestione, depure y priorice la atención humana solo a los leads de alto valor.

---

## Estado actual y flujo de integración

- Extracción de usuarios de WordPress vía MySQL remoto (`extract_wp_users.js`).
- Importación de usuarios de WordPress a Convex (`import_users_to_convex.js`).
- Extracción de leads desde correo IMAP (`extract_email_leads.js`).
- Importación de leads de correo a Convex (`import_email_leads_to_convex.js`), usando endpoint HTTP `/import-leads` y autenticación con deploy key.
- Configuración unificada de deployment Convex (`frugal-pony-197`) y variables de entorno.
- CLI de Convex instalado y operativo para administración y despliegue.

---

## Checklist de integración

### Completado
- [x] Extracción de usuarios de WordPress vía MySQL remoto.
- [x] Importación de usuarios de WordPress a Convex.
- [x] Extracción de leads desde correo IMAP.
- [x] Limpieza de la tabla de leads para evitar duplicados y garantizar integridad de datos.
- [x] Importación de usuarios registrados y leads de email con diferenciación clara en el campo `source` (`user` para registrados, `email` para leads de correo).
- [x] El cuerpo de los correos ahora se almacena en texto plano limpio en `metadata.body`, optimizado para análisis de IA y cumpliendo límites de tamaño de Convex.
- [x] Proceso de importación validado: solo se almacenan leads que cumplen el límite de 1 MiB por documento.
- [x] Extracción y análisis automático de todas las tablas de WordPress para identificar fuentes útiles de nombre, email y mensaje.
- [x] Importación de comentarios públicos de WordPress (`wp_comments`) como leads con source `wp_comment` y diferenciación clara en Convex.
- [x] Integración de canal WhatsApp web con componente `WhatsAppLeadDialog.tsx`: diálogo tipo chatbot que capta información antes de abrir WhatsApp y la envía a Convex como lead con source `whatsapp_web`.
- [x] Unificación de deployment y variables de entorno (`frugal-pony-197`).
- [x] Instalación y uso del CLI de Convex localmente.
- [x] Configuración de autenticación en Convex
- [x] Validación de esquema para usuarios y leads
- [x] Tipado seguro para operaciones

### Pendiente / Siguiente pasos
- [ ] Automatizar ejecución periódica de scripts.
- [ ] Mejorar parsing de roles y metadatos de usuarios de WordPress.
- [ ] Enriquecer parsing de correos para leads (extraer teléfono, nombre, etc.).
- [ ] Unificar lógica de deduplicación de leads.
- [ ] Integrar otras fuentes (WhatsApp, redes sociales).
- [ ] Mejorar UI para visualizar leads importados.
- [ ] Documentar endpoints y scripts para onboarding de nuevos agentes.
- [x] App desplegada en Render.com: [https://petgas-convex-app.onrender.com/](https://petgas-convex-app.onrender.com/)
- [ ] Probar importación masiva de usuarios
- [ ] Desarrollar lógica de IA para analizar el cuerpo de los correos y categorizar leads automáticamente según intención, urgencia y valor potencial.
- [ ] Automatizar respuestas y documentación según categoría de lead.
- [ ] Medir y optimizar la reducción de carga operativa humana.

---

## Scripts clave

- `extract_wp_users.js`: Extrae usuarios de WordPress desde MySQL y exporta a JSON.
- `import_users_to_convex.js`: Importa usuarios a Convex como leads.
- `extract_email_leads.js`: Extrae leads desde correos IMAP y exporta a JSON.
- `import_email_leads_to_convex.js`: Importa leads de correo a Convex.

---

## Datos técnicos relevantes

- Deployment Convex: `frugal-pony-197`
- CONVEX_URL: https://frugal-pony-197.convex.cloud
- CONVEX_SITE_URL: https://frugal-pony-197.convex.site
- Deploy key: (ver AI_PROJECT_CONTEXT.md)

### User Migration
Para importar usuarios desde WordPress:
```bash
cd ../petgas_scripts
CONVEX_SITE_URL=https://frugal-pony-197.convex.site node import_users_to_convex.js
```

### Email Leads Import
Para importar leads desde correos:
```bash
CONVEX_SITE_URL=https://frugal-pony-197.convex.site node import_email_leads_to_convex.cjs
```

Requisitos:
- Archivo wp_users_export.json o email_leads_export.json en el mismo directorio correspondiente
- Deploy key válida configurada en el script
- Deployment Convex activo (`frugal-pony-197`)

Logs detallados disponibles ejecutando:
```bash
CONVEX_DEPLOYMENT=frugal-pony-197 npx convex logs
```
- Correo IMAP: enlace@petgas.com.mx (mail.petgas.com.mx:993)
- MySQL remoto: p3plzcpnl489472.prod.phx3.secureserver.net, usuario ricardoduhalt, base i9280431_wp2

---

## Para desarrolladores y agentes AI

Consulta el archivo `AI_PROJECT_CONTEXT.md` para un historial exhaustivo, contexto técnico, decisiones y pasos detallados para continuar el desarrollo o integración.
