import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import ws from "ws";

// Cambia el correo y/o la contraseña de la administradora.
//   npm run admin:set -- <correo> <contraseña> [nombre]
// - Si ya existe un admin con ese correo, solo actualiza su contraseña.
// - Si no, toma el admin existente (el de ejemplo) y lo renombra al nuevo
//   correo con la nueva contraseña. Así queda un único admin con tus datos.

neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const [emailArg, password, ...nameParts] = process.argv.slice(2);
  const email = (emailArg ?? "").trim().toLowerCase();
  const fullName = nameParts.join(" ").trim() || "Administración AeroSwift";

  if (!email || !password) {
    console.error('Uso: npm run admin:set -- <correo> <contraseña> ["Nombre"]');
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("El correo no es válido.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("La contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const byEmail = await prisma.adminUser.findUnique({ where: { email } });
  if (byEmail) {
    await prisma.adminUser.update({ where: { id: byEmail.id }, data: { passwordHash, fullName } });
    console.log(`✓ Contraseña actualizada para ${email}`);
    return;
  }

  const current = await prisma.adminUser.findFirst({ orderBy: { createdAt: "asc" } });
  if (current) {
    await prisma.adminUser.update({
      where: { id: current.id },
      data: { email, passwordHash, fullName },
    });
    console.log(`✓ Admin actualizado: ${current.email} → ${email}`);
  } else {
    await prisma.adminUser.create({ data: { email, passwordHash, fullName } });
    console.log(`✓ Admin creado: ${email}`);
  }
  console.log("Ya puedes iniciar sesión con las nuevas credenciales.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
