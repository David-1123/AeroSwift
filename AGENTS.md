# This is NOT the Next.js you know

This project runs **Next.js 16.2.10** (App Router). APIs, conventions and file
structure may differ from older training data. Before writing framework code,
read the relevant guide under `node_modules/next/dist/docs/`. Heed deprecation
notices. Notable in this version:

- Route handler `params` are **async** (`{ params: Promise<{ id: string }> }`) —
  you must `await params`.
- `cookies()` / `headers()` from `next/headers` are **async** — `await` them.

# Project: AeroSwift

Plataforma de reservas de traslados privados al aeropuerto (Quito ↔ Tababela).

- **Stack:** Next.js 16 · React 19 · Tailwind v4 · Prisma 7 + Neon (Postgres) ·
  auth propia (JWT httpOnly + bcrypt) · zod.
- **Sin cuentas de cliente:** los clientes reservan como invitados
  (nombre/teléfono/WhatsApp). La única cuenta es la de la administradora.
- **Precio SIEMPRE se calcula en el backend** (`lib/pricing.ts`): $25 sector Sur,
  $20 el resto. Nunca confíes en un precio enviado por el cliente.
- **Número de vuelo es opcional** (si se agrega, se usa para monitorear el vuelo).
- **Ubicación de recogida:** NO se pide dirección ni mapa en la reserva. Basta el
  `sector` (define la tarifa); la dirección exacta se coordina por WhatsApp.
- **Idioma/tono:** español neutro (forma "tú"), nunca voseo argentino.
- **Diseño "Executive Transit":** onyx/charcoal (#1A202C) + dorado champán
  (#BD9D69) sobre fondo "bone" (#F8F3EA). Playfair Display (titulares) + Inter
  (UI/datos). Referencia en `design_reference/`.
