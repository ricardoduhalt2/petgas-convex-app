---

## Log de migración a Supabase (2025-12-04, actualizado 2025-04-13)

- Migración completa de la base de datos y backend de Convex a Supabase.
- Refactorización de todos los scripts de importación para usar la API de Supabase.
- Extracción y carga de leads y usuarios desde WordPress/MySQL y correo IMAP a Supabase.
- Limpieza avanzada de textos de email en el flujo de importación (eliminando cabeceras MIME, base64, entidades HTML corruptas y binarios, conservando solo texto legible).
- Unificación de los botones de importación en el dashboard: ahora un solo botón ejecuta ambos procesos (Email y MySQL) en secuencia.
- Mejor experiencia de deduplicación y trazabilidad en la importación de leads.
- Documentación, checklist y logs actualizados para reflejar los cambios recientes.
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
- [2025-04-13] Eliminado el script de importación de Bookly y referencias asociadas.
- [2025-04-13] Automatización diaria de scripts de importación vía cron.
- [2025-04-13] UI del dashboard mejorada: cards visuales para categorías de leads.
- [2025-04-13] Preparación para integración de autenticación con Firebase.

### Instrucciones rápidas

- Para importar leads de email o MySQL, usa los botones en el dashboard o ejecuta los scripts manualmente.
- El chatbot de WhatsApp registra leads en Supabase y acumula mensajes por email.
- Todos los mensajes se limpian automáticamente antes de guardarse.
- El dashboard muestra los leads y su historial de mensajes.

---

### Instrucción para agentes AI

> Si recibes una orden como "contexto" o "checklist", primero lee el README y actualiza el checklist antes de realizar cualquier otra acción. Así te aseguras de estar alineado con el estado y contexto actual del proyecto.

---

## Próximos pasos: Autenticación con Firebase

### Resumen técnico para integración

1. **Crear proyecto en Firebase Console**
   - Ir a https://console.firebase.google.com/
   - Crear un nuevo proyecto y registrar la app web.
2. **Instalar SDK**
   - `npm install firebase`
3. **Inicializar Firebase**
   - Crear un archivo `src/lib/firebase.ts` con la configuración del proyecto:
     ```ts
     // src/lib/firebase.ts
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       // ...otros datos
     };
     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     ```
4. **Implementar login**
   - Usar métodos de `firebase/auth` como `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, etc.
   - Ejemplo de login:
     ```ts
     import { signInWithEmailAndPassword } from "firebase/auth";
     import { auth } from "./firebase";
     signInWithEmailAndPassword(auth, email, password)
       .then(userCredential => { /* ... */ })
       .catch(error => { /* ... */ });
     ```
5. **Proteger rutas/componentes**
   - Usar el estado de autenticación para mostrar u ocultar componentes según el usuario autenticado.

**Referencia oficial:**  
https://firebase.google.com/docs/auth?hl=es-419

---
