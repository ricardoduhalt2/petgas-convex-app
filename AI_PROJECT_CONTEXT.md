---

## Log de migración a Supabase (2025-12-04, actualizado 2025-04-13)

- Migración completa de la base de datos y backend de Convex a Supabase.
- Refactorización de todos los scripts de importación para usar la API de Supabase.
- Extracción y carga de leads y usuarios desde WordPress/MySQL y correo IMAP a Supabase.
- Limpieza automática de HTML, imágenes y caracteres extraños en los mensajes antes de importarlos.
- Importación incremental: si un lead ya existe (mismo email), los nuevos mensajes se agregan al historial (metadata.messages) en vez de crear duplicados.
- Panel de dashboard y tabla de leads alineados, con encabezados y columnas perfectamente coincidentes.
- Filtros y buscador funcionales en el dashboard.
- Panel de detalle de lead con área de metadata expandida y sección de notas/seguimiento editable.
- UI lista para persistencia de notas y cambios de estado/agente en Supabase.
- Copia de seguridad de la versión funcional guardada en `src/components/LeadsDashboard.bak.tsx`.
- Eliminación de dependencias y lógica de Convex en el frontend.
- Branding PETGAS aplicado en login, navbar, dashboard y paneles.
- Chatbot de WhatsApp funcional: registra leads en Supabase, evita duplicados y acumula mensajes.
- Botones de importación de leads de Email y MySQL en el dashboard, conectados a endpoints Express.
- Todos los cambios documentados en README y logs/petgas_migracion_supabase.log.

### Instrucciones rápidas

- Para importar leads de email o MySQL, usa los botones en el dashboard o ejecuta los scripts manualmente.
- El chatbot de WhatsApp registra leads en Supabase y acumula mensajes por email.
- Todos los mensajes se limpian automáticamente antes de guardarse.
- El dashboard muestra los leads y su historial de mensajes.
