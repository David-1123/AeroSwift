# AeroSwift

Plataforma de reservas de traslados privados al aeropuerto (Quito ↔ Aeropuerto de
Tababela). Precio cerrado por zona, reserva como invitado y confirmación por
WhatsApp, con panel de control operacional para la administradora.

## Stack

- **Next.js 16** (App Router, React 19) · **Tailwind CSS v4**
- **Prisma 7 + Neon** (PostgreSQL serverless)
- Autenticación propia del admin (JWT httpOnly + bcrypt), rutas `/admin`
  protegidas por `proxy.ts` (el nuevo nombre del middleware en Next 16)
- Validación con **zod**

## Reglas de negocio

- **El precio se calcula SIEMPRE en el backend** (`lib/pricing.ts`): `$25` para el
  sector **Sur**, `$20` para el resto. El frontend solo muestra un estimado.
- Capacidad máxima por viaje: **4 pasajeros** y **3 maletas**. Si se excede, la
  reserva se rechaza y se sugiere contactar soporte por WhatsApp.
- El **número de vuelo es opcional**; si se indica, se usa para monitorear el vuelo.

## Puesta en marcha

1. **Base de datos.** Crea un proyecto en [Neon](https://neon.tech) y copia su
   connection string en `.env` (`DATABASE_URL`). ⚠️ Usa una base **propia** para
   AeroSwift, no la compartas con otros proyectos.

2. **Variables de entorno** (`.env`):
   - `DATABASE_URL` — cadena de conexión de Neon.
   - `SESSION_SECRET` — secreto para firmar las cookies de sesión del admin.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp del negocio (formato `593…`).

3. **Instalar, migrar y sembrar:**

   ```bash
   npm install
   npm run db:migrate      # crea las tablas en Neon
   npm run db:seed         # admin + conductores + viajes de ejemplo
   ```

4. **Arrancar:**

   ```bash
   npm run dev
   ```

## Acceso

- **Cliente:** `/reservar` (reserva) · `/dashboard` (consulta por WhatsApp).
- **Administración:** `/admin/login`
  - Correo: `admin@aeroswift.ec`
  - Contraseña: `aeroswift123` (cámbiala en producción).

## Estructura

- `app/` — páginas y route handlers (`app/api/**`).
- `components/` — UI (flujo de reserva, panel admin, etc.).
- `lib/` — dominio: `pricing`, `whatsapp`, `phone`, `auth`, `db`, `rides`.
- `prisma/` — `schema.prisma`, migraciones y `seed.ts`.
- `proxy.ts` — protección de rutas `/admin`.
- `design_reference/` — mockups de Stitch (sistema de diseño "Executive Transit").
