import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import ws from "ws";

// Crea o actualiza una administradora (se pueden tener varias).
//   npm run admin:set -- <correo> <contraseña> ["Nombre"]
// - Si el correo ya existe, actualiza su contraseña y nombre.
// - Si no existe, crea un admin nuevo.

neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const [emailArg, password, ...nameParts] = process.argv.slice(2);
  const email = (emailArg ?? "").trim().toLowerCase();
  const fullName = nameParts.join(" ").trim() || (email ? email.split("@")[0] : "");

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
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, fullName },
    create: { email, passwordHash, fullName },
  });
  console.log(`✓ Admin listo: ${email}`);

  const all = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  console.log("Admins actuales:", all.map((a) => a.email).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
