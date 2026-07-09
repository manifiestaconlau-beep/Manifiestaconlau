# Manifiesta con Lau 🌙✨

App de ritual diario de manifestación: fase lunar real, afirmaciones curadas (96 en 8 categorías),
diario guiado, racha con insignias, meditaciones y comunidad. Suscripción mensual vía Hotmart.

Stack 100% gratuito: **Next.js 14 + Supabase + Vercel**.

---

## 1. Crear el proyecto en Supabase (gratis)

1. Andá a [supabase.com](https://supabase.com) → crear cuenta → **New Project**.
2. Guardá la contraseña de la base de datos en un lugar seguro.
3. Cuando el proyecto esté listo, andá a **Project Settings → API** y copiá:
   - `Project URL` → va en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → va en `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → va en `SUPABASE_SERVICE_ROLE_KEY` (¡nunca la expongas en el frontend!)

## 2. Correr el schema de base de datos

En Supabase, andá a **SQL Editor** y corré, en este orden:

1. `supabase/schema.sql` — crea todas las tablas, políticas de seguridad y funciones
2. `supabase/seed_afirmaciones.sql` — carga las 96 afirmaciones reales
3. `supabase/seed_meditaciones_y_ritual.sql` — carga las meditaciones y el ritual mensual
4. `supabase/seed_comunidad.sql` — carga 5 posts de ejemplo para que la Comunidad no se vea
   vacía el día del lanzamiento (podés borrarlos después desde el Table Editor)

## 3. Subir los audios a Supabase Storage

1. En Supabase, andá a **Storage** → **New Bucket** → nombralo `meditaciones` → marcalo como **público**.
2. Adentro del bucket, creá dos carpetas: `meditaciones/` y `despertador/`.
3. Subí cada archivo con el mismo nombre que está en `seed_meditaciones_y_ritual.sql`, por ejemplo:
   - `meditaciones/gratitud.m4a` (el archivo `MEDITACION GRATITUD.m4a` que me pasaste)
   - `meditaciones/prosperidad-y-abundancia.m4a`
   - `meditaciones/soy-feliz.m4a`
   - `meditaciones/sanando-nino-interior.m4a`
   - `meditaciones/atencion-plena.m4a`
   - `meditaciones/heridas-del-pasado.m4a`
   - `meditaciones/liberar-el-miedo.m4a`
   - `meditaciones/para-descansar.m4a`
   - `despertador/audio-despertador-1.wav`
   - `musica-de-fondo.mp3` (el archivo `danamusic-soothing-meditation-without-voice-315921.mp3` que me pasaste — va suelto en la raíz del bucket, no en una subcarpeta)

   (Podés renombrarlos al subirlos, o ajustar el `audio_url` en la tabla `meditations` si preferís otros nombres.)

   **Sobre la música de fondo:** suena automáticamente en loop, bajo volumen, en toda la app, con
   un botón flotante (🎵/🔇) abajo a la derecha para apagarla. Algunos navegadores bloquean el
   autoplay con sonido hasta que la usuaria interactúa una vez con la página — en ese caso el botón
   va a decir "Prender música" y con un toque arranca.

   **Sobre el audio despertador:** lo puse bien arriba en la página principal (Ritual del Día), como
   la primera tarjeta después de la racha, para que sea lo primero que la usuaria vea y escuche cada
   mañana.

## 4. Configurar variables de entorno

Copiá `.env.example` a `.env.local` y completá con tus valores reales de Supabase (paso 1) y el
`HOTMART_HOTTOK` (paso 6).

## 5. Instalar dependencias y correr localmente

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000` — te va a redirigir a `/login`.

## 6. Configurar el webhook de Hotmart

Esta es la parte que conecta el pago con el acceso a la app:

1. En Hotmart, andá a tu producto → **Herramientas** → **Webhooks (Postback)**.
2. Agregá la URL: `https://tu-dominio.vercel.app/api/hotmart-webhook`
3. Copiá el **Hottok** (token de seguridad) que te da Hotmart y ponelo en `HOTMART_HOTTOK`.
4. Seleccioná los eventos: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `SUBSCRIPTION_RENEWAL`,
   `PURCHASE_CANCELED`, `PURCHASE_REFUNDED`, `SUBSCRIPTION_CANCELLATION`, `PURCHASE_EXPIRED`,
   `PURCHASE_CHARGEBACK`.

**Importante:** la usuaria debe registrarse en la app con el **mismo email** que usó para comprar en
Hotmart — así el webhook la encuentra y le activa el acceso automáticamente.

## 7. Deploy en Vercel (gratis)

1. Subí este proyecto a un repo de GitHub.
2. Andá a [vercel.com](https://vercel.com) → **New Project** → importá el repo.
3. En **Environment Variables**, cargá las 4 variables de `.env.local`.
4. Deploy. Listo — ese es el dominio que ponés en el webhook de Hotmart (paso 6).

---

## Cómo sigue creciendo esto (roadmap sugerido)

- **Fase 2:** pulir el reproductor de meditaciones (guardar progreso, marcar como escuchada).
- **Fase 3:** moderación de comunidad (ocultar/reportar posts), notificaciones push de racha.
- **Nice to have:** login con contraseña además del magic link, recordatorio diario por email/WhatsApp
  si la usuaria no hizo su check-in.

## Estructura del proyecto

```
app/
  dashboard/        → Ritual del día (luna + día + ritual mensual + afirmación + racha)
  afirmaciones/      → Buscador de afirmaciones con favoritos
  diario/            → Diario guiado + medidor de vibración
  meditaciones/       → Reproductor de audios
  comunidad/          → Feed de comunidad
  login/              → Login sin contraseña (magic link)
  suscripcion-vencida/ → Página para quien no tiene acceso activo
  api/hotmart-webhook/ → Recibe eventos de pago de Hotmart
lib/
  moonPhase.ts        → Cálculo de fase lunar real (sin API externa)
  supabaseClient.ts    → Clientes de Supabase (browser/server/service)
supabase/
  schema.sql                        → Todas las tablas y seguridad
  seed_afirmaciones.sql              → Las 96 afirmaciones reales
  seed_meditaciones_y_ritual.sql      → Meditaciones + ritual mensual
middleware.ts          → Protege rutas: sin sesión → login, sin suscripción activa → gate
```
actualizado
