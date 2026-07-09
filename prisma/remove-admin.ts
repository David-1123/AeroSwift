import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Elimina una administradora por correo.
//   npm run admin:remove -- <correo>
// Nunca borra el último admin (siempre debe quedar al menos uno).

neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = (process.argv[2] ?? "").trim().toLowerCase();
  if (!email) {
    console.error("Uso: npm run admin:remove -- <correo>");
    process.exit(1);
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    console.error(`No existe un admin con el correo ${email}.`);
    process.exit(1);
  }
  const total = await prisma.adminUser.count();
  if (total <= 1) {
    console.error("No se puede eliminar: debe quedar al menos un administrador.");
    process.exit(1);
  }

  // Desvincula la bitácora que hubiera creado este admin antes de borrarlo.
  await prisma.rideEvent.updateMany({ where: { createdById: admin.id }, data: { createdById: null } });
  await prisma.adminUser.delete({ where: { id: admin.id } });
  console.log(`✓ Eliminado: ${email}`);

  const all = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  console.log("Admins actuales:", all.map((a) => a.email).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
