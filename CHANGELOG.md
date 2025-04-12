# Changelog

## [1.8.0] - 2025-11-04
### Added
- Componente `WhatsAppLeadDialog.tsx`: diálogo tipo chatbot que capta información del usuario antes de abrir WhatsApp y la envía a Convex como lead con source `whatsapp_web`.
- El historial del diálogo se almacena en `metadata.dialog` y el mensaje final en `metadata.body`, integrando WhatsApp al embudo de leads y permitiendo lógica de IA sobre la conversación.
- El componente WhatsAppLeadDialog está listo para ser integrado en petgas.com.mx

### Pendiente
- Integrar el componente WhatsAppLeadDialog en la página web petgas.com.mx
- Probar el bot de WhatsApp para asegurar la correcta captura e importación de datos

## [1.7.0] - 2025-11-04
### Added
- Importación exitosa de comentarios públicos de WordPress (`wp_comments`) como leads diferenciados en Convex (`source: wp_comment`).
- Checklist actualizado: sistema con usuarios registrados, leads de email y comentarios públicos, todos diferenciados y listos para embudos automáticos y análisis IA.
- Proceso validado: todos los datos relevantes están en Convex y listos para el siguiente paso del checklist.

## [1.6.0] - 2025-11-04
### Added
- Extracción y análisis automático de todas las tablas de WordPress para identificar fuentes útiles de nombre, email y mensaje.
- Importación de comentarios públicos de WordPress (`wp_comments`) como leads con source `wp_comment` y diferenciación clara en Convex.
- Ahora el sistema integra usuarios registrados, leads de email y comentarios públicos, todos listos para embudos y clasificación IA.

## [1.5.0] - 2025-11-04
### Changed
- Validación final de importación: usuarios y leads diferenciados por `source`, sin duplicados, y cuerpo de correos en texto plano.
- Listo para análisis de IA y clasificación automática.
- Próximo paso: análisis de tablas remotas en MySQL de WordPress para buscar otras fuentes de nombre, email y mensaje útiles para el embudo.

## [1.4.0] - 2025-11-04
### Changed
- Limpieza de la tabla de leads para evitar duplicados y garantizar integridad de datos.
- Importación de usuarios registrados y leads de email con diferenciación clara en el campo `source` (`user` para registrados, `email` para leads de correo).
- El cuerpo de los correos ahora se almacena en texto plano limpio en `metadata.body`, optimizado para análisis de IA y cumpliendo límites de tamaño de Convex.
- Proceso de importación validado: solo se almacenan leads que cumplen el límite de 1 MiB por documento.

## [1.3.0] - 2025-11-04
### Changed
- Actualización de la meta del proyecto: enfoque AI-first para crear embudos automáticos, analizar cuerpo de correos y categorizar leads según intención, urgencia y valor.
- El script de importación de leads ahora almacena cuerpo, asunto y fecha de cada correo en el campo `metadata` de Convex.
- Preparación para el desarrollo de lógica de IA que automatice respuestas, delegue tareas y depure leads no valiosos.

## [1.2.0] - 2025-11-04
### Added
- Importación masiva exitosa de leads desde correos a Convex usando endpoint HTTP `/import-leads` y script `import_email_leads_to_convex.cjs`.
- Unificación de configuración de deployment a `frugal-pony-197` y actualización de variables de entorno.
- Ajuste de payload y autenticación para HTTP Actions en Convex.
- Validación de integración end-to-end con logs de éxito por cada lead importado.

## [1.1.0] - 2025-11-04
### Added
- Migración de usuarios desde WordPress a Convex
- Configuración del deployment youthful-bear-90
- Endpoint HTTP para importación de leads
- Script de importación automática de usuarios (import_users_to_convex.js)
- Registro de logs detallados para importación

## [0.1.0] - 2025-11-05

### Added
- Basic lead capture form and dashboard.
- Authentication system.
- Animated PETGAS logo marquee.
- Type-safe Convex API configuration
- Schema validation for users and leads

### Changed
- Visual redesign to match PETGAS brand.
- Updated LeadsDashboard UI: white background, dark text, and 3D hover effect on cards.
- Improved authentication flow
- Updated Convex dependencies to latest versions

### Fixed
- Type generation issues in Convex
- Authentication errors in lead creation
- Schema validation errors

### Planning
- Automate periodic script execution
- Enhance WordPress user metadata parsing
- Improve email lead parsing (phone, name extraction)
- Unify lead deduplication logic
