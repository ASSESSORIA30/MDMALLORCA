# ModularDom — Mallorca Private Residences

Primera versión funcional de una experiencia editorial inmobiliaria. Next.js App Router, React, TypeScript, CSS propio, React Three Fiber / Drei, Photo Sphere Viewer y MapLibre. Despliegue compatible con Vercel.

## Ejecutar

Node.js 24 LTS y npm 11 (probados). Desde la raíz del repositorio:

```sh
npm ci
npm run dev
```

La raíz redirige a `/en`. `NEXT_PUBLIC_DEFAULT_LOCALE` permite elegir `en`, `es` o `ca`. Para producción: `npm run build` y `npm start`. Copia `.env.example` a `.env.local` para configurar integraciones; no subas valores privados a Git. Se usa el checkout existente; no se necesita un worktree.

```sh
npm run typecheck
npm test
npx playwright test
```

La configuración de Playwright usa `/usr/bin/chromium` en este entorno. En otra máquina, usa Chromium de Playwright (`npx playwright install chromium`) y elimina `executablePath`. Arranca la aplicación en el puerto 3000 antes de las pruebas de navegador.

## Estado del contenido

Son Oliva y Can Alba son nombres conceptuales. Las imágenes son visualizaciones de arquitectura generadas con IA y están identificadas como tales. No hay parcelas, precios, prestaciones ni ubicaciones verificadas. La fotografía de terreno, vídeo de transformación, GLB, panorámicas y planos aún no se han proporcionado. Los módulos muestran estados pendientes, sin simular contenido real. El comparador demuestra el deslizador con el mismo concepto en dos tratamientos; no representa una construcción antes y después.

La aplicación no utiliza analítica ni publicidad. Fuentes Google Fonts alojadas localmente, con licencias OFL en `public/fonts`. Las imágenes conceptuales están en `public/images`; sustituirlas por recursos autorizados del proyecto.

## Añadir propiedades sin reprogramar componentes

Editar `content/residences.json`, duplicando un registro. Mantener `slug` único y descripciones `en`, `es`, `ca`. Es contenido editable, no un panel CMS terminado. El tipo `Residence` en `src/lib/content.ts` define los campos disponibles. Las traducciones de interfaz se encuentran en el mismo módulo.

Carpetas por proyecto:

```
public/projects/<slug>/terrain/
public/projects/<slug>/renders/
public/projects/<slug>/videos/
public/projects/<slug>/models/
public/projects/<slug>/panoramas/
public/projects/<slug>/plans/
```

Los archivos se referencian desde `/projects/...`, sin `public`. Campos opcionales:

- `gallery`: lista de `{src, category, caption?}` con categorías `exterior`, `interior`, `architecture`, `lifestyle`, `construction`. Admite varias imágenes por categoría.
- `terrain` y `render`: imágenes con perspectiva idéntica. Al disponer de ambas, el comparador pasa al modo antes/después.
- `video`: MP4 H.264, controles nativos, reproducción manual en showroom. `NEXT_PUBLIC_HERO_VIDEO`: vídeo de fondo opcional (silenciado, con póster, omitido para movimiento reducido o ahorro de datos). No hay reproducción controlada por scroll que interfiera con el usuario.
- `model`: GLB/GLTF profesional. Se carga únicamente al abrir la pestaña 3D, con órbita, zoom y pantalla completa. Iluminación neutra inicial y sombras. Campos opcionales `modelViews` (nombre localizado, posición de cámara y target), `modelHotspots` (id, posición, etiqueta y descripción localizadas), `modelFloors` (nombre localizado y URL de GLB por planta), `environment` (HDRI diurno) y `nightEnvironment` (HDRI nocturno) activan controles solo cuando hay recursos. Las coordenadas usan el sistema original del modelo, sin inventar una distribución. El fotorrealismo requiere preparar el modelo, materiales PBR y la dirección de iluminación específica. No se inventa una distribución.
- `viewerHtml`: visor HTML **de confianza** alojado en un origen separado. El iframe permite scripts y fullscreen. No alojar HTML subido por usuarios en el origen público: es contenido activo y requiere auditoría. No hay un cargador público de archivos.
- `panoramas`: `[{"id":"living","name":"Living room","url":"/projects/slug/panoramas/living.jpg","links":["terrace"]}, ...]`. Panorámicas equirectangulares reales 2:1. Photo Sphere Viewer permite esfera, navegación táctil, zoom, hotspots entre escenas y fullscreen. No usar fotografía plana.
- `plans`: lista de imágenes de planos; visor en pantalla completa con zoom y desplazamiento. Convertir PDFs a imágenes antes de incorporarlos.
- `coordinates`: `[longitud, latitud]`, solo tras verificación; `approximate: true` para ubicación aproximada. Mapa interactivo MapLibre, atribución OpenStreetMap, zoom, fullscreen y enlace a Google Maps. `satelliteStyle`: URL de estilo con proveedor satélite autorizado; la vista satélite aparece únicamente si se configura. No exponer tokens privados. Permitir los dominios del proveedor en el entorno. Respetar condiciones/licencias y valorar consentimiento de terceros.
- `verified`: solo `true` con datos y derechos aprobados. Los campos `plot`, `built`, `beds`, `baths`, `price` y `status` se muestran en la ficha únicamente con `verified: true`. Las cifras ausentes no se inventan. Revisar los datos comerciales antes de activar la verificación.

Para imágenes: WebP/AVIF/JPEG optimizado, dimensiones suficientes y proporción original; galería y planos usan `contain`. Para GLB: texturas comprimidas y mallas razonables; validar modelos antes de cargarlos. El motor 3D, panorama y mapa se dividen en bundles independientes.

## Consultas privadas, Supabase y correo

La API **no finge un envío** si no está configurada. Responde 503 y el formulario informa de que no se ha enviado ni guardado nada. No guarda contactos en localStorage.

1. Crear proyecto Supabase en región y condiciones adecuadas. Ejecutar `supabase/schema.sql`. RLS impide el acceso público a contactos y notificaciones. Configurar acceso de editores en Supabase Studio con MFA y permisos; `/admin` público devuelve 404.
2. Completar aviso legal y privacidad reales (responsable, contacto, base jurídica, conservación, encargados, transferencias y derechos). Los textos actuales son borradores de desarrollo.
3. Crear widget Cloudflare Turnstile para el dominio de producción. Configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`.
4. Configurar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` **solo en servidor**. Activar `ENQUIRIES_ENABLED=true` y `NEXT_PUBLIC_ENQUIRIES_ENABLED=true` después de verificar todo. Ajustar `NEXT_PUBLIC_SITE_URL` al dominio real. Validación en cliente y servidor, límite de tamaño, control de origen y token Turnstile con hostname/action verificados.
5. Cada consulta se almacena en `enquiries` y el trigger crea una entrada en `notification_outbox` de forma atómica. Desplegar `supabase/functions/notify-enquiries` con secretos `RESEND_API_KEY`, `ENQUIRIES_FROM` (dominio remitente verificado), `ENQUIRIES_TO`, `NOTIFICATION_JOB_TOKEN`. El runtime Supabase proporciona URL y service role. Programar invocación POST autenticada al worker; solo un consumidor programado a la vez. Resend usa una clave de idempotencia por consulta. Reintentos leen las entradas sin `delivered_at`; supervisar fallos y respetar el plazo de idempotencia del proveedor.
6. Usar la misma cola para integrar un CRM mediante un worker autenticado. Nunca incluir service role, claves de correo o tokens de jobs en el frontend.
7. Probar una consulta real de extremo a extremo y confirmar fila, notificación y recepción antes de publicar. Las integraciones externas **no están verificadas** sin credenciales y recursos reales.

La tabla `residences` es una base de CMS con RLS, contenido JSON y bloqueo de publicación sin verificación. Supabase Studio proporciona el panel privado autenticado separado. El frontend actual utiliza el JSON versionado; conectar lectura CMS y establecer roles editoriales, historial y validación es un paso de integración posterior, no un panel terminado. También puede conectarse Sanity/Directus conservando el contrato `Residence`.

## Publicar en Vercel

Importar el repositorio en Vercel, preset Next.js, Node 24 y `npm run build`. Configurar variables en Settings, separando preview/production. No se ha publicado ni subido este proyecto automáticamente.

Por defecto hay `noindex`, robots bloqueado y sitemap vacío para no indexar contenido conceptual. Tras sustituir los conceptos y completar la revisión comercial/legal, establecer `SITE_PUBLISHED=true` y el dominio canónico. Sitemap y hreflang incluyen tres idiomas. No hay datos estructurados de ofertas sin propiedades verificadas. Revisar Open Graph y metadatos con contenido definitivo.

## Diseño y habilidades

Piedra `#F5F3EE`, negro mineral, verdes oliva discretos, bronce; Cormorant Garamond y Manrope. Narrativa: emoción → filosofía → colección → transformación → Mallorca → conversación. Navegación y showroom con teclado; menú móvil, galería modal con Escape/flechas/gestos, movimiento reducido y carga diferida.

Las habilidades `frontend-design`, `ui-ux-pro-max`, `emil-design-eng`, `impeccable` y `vercel-react-best-practices` no estaban instaladas. Para incorporarlas, descargar cada habilidad desde su repositorio oficial, revisar su `SKILL.md` y colocar su carpeta en el directorio de Skills configurado por el cliente (por ejemplo `$CODEX_HOME/skills/<nombre>/SKILL.md` en instalaciones compatibles); reiniciar la sesión. No se afirma haberlas utilizado ni se inventan comandos o URLs de repositorios no comprobados.
