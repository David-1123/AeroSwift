# Despliegue en Vercel

La app ya está lista para producción: `next build` pasa limpio y `postinstall`
regenera el cliente Prisma en cada build de Vercel. La base de datos Neon ya
está migrada.

## Variables de entorno (configúralas en Vercel)

En Vercel → tu proyecto → **Settings → Environment Variables**, agrega:

| Nombre | Valor | Notas |
|---|---|---|
| `DATABASE_URL` | *(connection string **pooled** de Neon)* | Usa el endpoint **con `-pooler`** para serverless. |
| `SESSION_SECRET` | *(cadena aleatoria de 64 hex)* | Genérala con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `593961215149` | Número del negocio, formato internacional sin `+`. |

Marca las tres para **Production** (y Preview/Development si quieres probar ramas).

## Opción A — GitHub + Vercel (recomendada, con auto-deploy)

1. Crea un repositorio vacío en GitHub (privado).
2. Conéctalo y sube el código:
   ```bash
   git remote add origin https://github.com/<usuario>/aeroswift.git
   git branch -M main
   git push -u origin main
   ```
3. En [vercel.com/new](https://vercel.com/new) → **Import** el repo.
4. Framework: **Next.js** (autodetectado). No cambies el build command.
5. Agrega las variables de entorno de arriba → **Deploy**.
6. Cada `git push` a `main` desplegará automáticamente.

## Opción B — Vercel CLI (despliegue directo, sin GitHub)

```bash
npm i -g vercel
vercel login
vercel            # primer deploy (preview)
vercel --prod     # deploy a producción
```
Configura las variables con `vercel env add` o desde el dashboard.

## Migraciones de base de datos

La BD ya está migrada. Si cambias el esquema (`prisma/schema.prisma`) más
adelante:

```bash
# localmente, con el endpoint DIRECTO de Neon (sin -pooler) en tu .env
npm run db:migrate
git commit -am "db: <cambio>" && git push
```

Vercel **no** corre migraciones automáticamente; se aplican al ejecutar
`db:migrate` contra Neon (el endpoint directo es necesario para DDL).

## Notas

- `.env` está en `.gitignore`: los secretos nunca se suben al repo.
- El acceso admin por defecto es `admin@aeroswift.ec` / `aeroswift123`.
  **Cámbialo en producción** (crea un admin nuevo y borra el de ejemplo).
