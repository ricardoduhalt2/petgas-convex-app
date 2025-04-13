# PETGAS Ecosystem Manager

## Descripción general

Plataforma para captación, segmentación y optimización de leads para transformacion y venta de plantas de pirólisis. Centraliza leads provenientes de WordPress, correo electrónico y otras fuentes, integrando todo en Supabase para su gestión, visualización y automatización inteligente.

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
- Extracción de usuarios de WordPress vía MySQL remoto (`extract_wp_users.js`).
- Extracción de leads desde correo IMAP (`extract_email_leads.js`).
- Integración con Supabase para la gestión de leads.
- CLI de Supabase instalado y operativo para administración y despliegue.

---

## Checklist de integración

### Completado
- [x] Extracción de usuarios de WordPress vía MySQL remoto.
- [x] Extracción de leads desde correo IMAP.
- [x] Limpieza de la tabla de leads para evitar duplicados y garantizar integridad de datos.
- [x] Importación incremental: si un lead ya existe (mismo email), los nuevos mensajes se agregan al historial (metadata.messages) en vez de crear duplicados.
- [x] Importación de usuarios registrados y leads de email con diferenciación clara en el campo `source` (`user` para registrados, `email` para leads de correo).
- [x] El cuerpo de los correos ahora se almacena en texto plano limpio en `metadata.body`, optimizado para análisis de IA y cumpliendo límites de tamaño de Supabase.
- [x] Proceso de importación validado: solo se almacenan leads que cumplen el límite de 1 MiB por documento.
- [x] Extracción y análisis automático de todas las tablas de WordPress para identificar fuentes útiles de nombre, email y mensaje.
- [x] Importación de comentarios públicos de WordPress (`wp_comments`) como leads con source `wp_comment` y diferenciación clara en Supabase.
- [x] Integración de canal WhatsApp web con componente `WhatsAppLeadDialog.tsx`: formulario compacto tipo chatbot que registra leads en Supabase, evita duplicados y acumula mensajes.
- [x] Widget flotante WhatsAppChatWidget listo para empotrar en cualquier sitio web: icono flotante, popup moderno, integración fácil.
- [x] Integración y despliegue exitoso del widget WhatsAppLeadDialog como chatbot embebible, funcional en producción y desarrollo local.
- [x] Botones de importación de leads de Email y MySQL en el dashboard, conectados a endpoints Express.
- [ ] Instalación y uso del CLI de Supabase localmente.
- [ ] Configuración de autenticación en Supabase
- [ ] Validación de esquema para usuarios y leads
- [ ] Tipado seguro para operaciones

### Pendiente / Siguiente pasos
- [ ] Automatizar ejecución periódica de scripts.
- [ ] Mejorar parsing de roles y metadatos de usuarios de WordPress.
- [ ] Enriquecer parsing de correos para leads (extraer teléfono, nombre, etc.).
- [ ] Integrar otras fuentes (WhatsApp, redes sociales).
- [ ] Mejorar UI para visualizar leads importados.
- [ ] Documentar endpoints y scripts para onboarding de nuevos agentes.
- [ ] Probar importación masiva de usuarios
- [ ] Desarrollar lógica de IA para analizar el cuerpo de los correos y categorizar leads automáticamente según intención, urgencia y valor potencial.
- [ ] Automatizar respuestas y documentación según categoría de lead.
- [ ] Medir y optimizar la reducción de carga operativa humana.
- [x] Migrar la base de datos a Supabase
- [x] Adaptar las funciones de Convex a Supabase
- [x] Importación de leads de email a Supabase funcional (ver logs: los emails se extraen del campo `from` y se parsean correctamente, aunque algunos casos pueden quedar como NULL si el formato no es estándar).
- [x] Log de importación: si el campo `from` es tipo "Nombre <email@dominio.com>", el email se extrae y el nombre queda como "Nombre <email@dominio.com>" en el campo `name`. Si no hay email, queda NULL.
- [x] Panel de detalle de lead con área de metadata expandida y sección de notas/seguimiento editable.
- [x] UI lista para persistencia de notas y cambios de estado/agente en Supabase.

---

## Scripts clave

- `extract_wp_users.js`: Extrae usuarios de WordPress desde MySQL y exporta a JSON.
- `extract_email_leads.js`: Extrae leads desde correos IMAP y exporta a JSON.

---

## Datos técnicos relevantes

- Supabase URL: https://eqngpaogpxagisbpmhrp.supabase.co
- Supabase ANON PUBLIC key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzMzOTUsImV4cCI6MjA1NDAwOTM5NX0.iVUpDPcMagHQUTkNxLOsDAfkb4QETuQJbEX6xW8TmpQ
- Supabase service_rolesecret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdwYW9ncHhhZ2lzYnBtaHJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQzMzM5NSwiZXhwIjoyMDU0MDA5Mzk1fQ.drRiCX2K6J9FOywBAmWSOvaD0Hl_asj6hZFMu4J5vlI

### User Migration
Para importar usuarios desde WordPress:
```bash
cd ../petgas_scripts
node extract_wp_users.js
```

### Email Leads Import
Para importar leads desde correos:
```bash
node extract_email_leads.js
```

Requisitos:
- Archivo wp_users_export.json o email_leads_export.json en el mismo directorio correspondiente

---

## Para desarrolladores y agentes AI

Consulta el archivo `AI_PROJECT_CONTEXT.md` para un historial exhaustivo, contexto técnico, decisiones y pasos detallados para continuar el desarrollo o integración.

---

## LOG DE MIGRACIÓN PETGAS A SUPABASE (2025-12-04)

- Migración completa de la base de datos y backend de Convex a Supabase.
- Refactorización de todos los scripts de importación para usar la API de Supabase.
- Extracción y carga de leads y usuarios desde WordPress/MySQL y correo IMAP a Supabase.
- Panel de dashboard y tabla de leads alineados, con encabezados y columnas perfectamente coincidentes.
- Filtros y buscador funcionales en el dashboard.
- Panel de detalle de lead con área de metadata expandida y sección de notas/seguimiento editable.
- UI lista para persistencia de notas y cambios de estado/agente en Supabase.
- Copia de seguridad de la versión funcional guardada en `src/components/LeadsDashboard.bak.tsx`.
- Eliminación de dependencias y lógica de Convex en el frontend.
- Branding PETGAS aplicado en login, navbar, dashboard y paneles.
- Todos los cambios documentados en README, logs/petgas_migracion_supabase.log y AI_PROJECT_CONTEXT.md.
