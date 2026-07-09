import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import ws from "ws";
import { priceForSector } from "../lib/pricing";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function at(daysFromNow: number, hour: number, minute = 0): Date {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" });
  const base = new Date(`${today}T00:00:00-05:00`);
  base.setDate(base.getDate() + daysFromNow);
  base.setHours(base.getHours() + hour);
  base.setMinutes(minute);
  return base;
}

async function main() {
  // --- Administradora ---
  const email = "admin@aeroswift.ec";
  const passwordHash = await bcrypt.hash("aeroswift123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, fullName: "Administración AeroSwift" },
  });
  console.log(`✓ Admin: ${admin.email} (contraseña: aeroswift123)`);

  // --- Conductores ---
  const driversData = [
    { fullName: "Carlos Naranjo", phone: "+593987000001", vehicle: "Chevrolet Aveo gris", plate: "PBA-1234" },
    { fullName: "Diego Salazar", phone: "+593987000002", vehicle: "Kia Cerato negro", plate: "PCX-5678" },
    { fullName: "Andrea Terán", phone: "+593987000003", vehicle: "Toyota Corolla plata", plate: "PDY-9012" },
  ];
  const drivers = [];
  for (const d of driversData) {
    const driver = await prisma.driver.create({ data: d });
    drivers.push(driver);
  }
  console.log(`✓ ${drivers.length} conductores`);

  // --- Viajes de ejemplo ---
  const demo = [
    { clientName: "María López", clientPhone: "+593991111111", sector: "NORTE" as const, direction: "AL_AEROPUERTO" as const, flight: "LA1435", pax: 2, bags: 2, when: at(0, 9), status: "PENDIENTE" as const, driver: null },
    { clientName: "Jorge Andrade", clientPhone: "+593992222222", sector: "SUR" as const, direction: "AL_AEROPUERTO" as const, flight: "AV0918", pax: 1, bags: 1, when: at(0, 14), status: "ASIGNADO" as const, driver: 0 },
    { clientName: "Paola Cevallos", clientPhone: "+593993333333", sector: "VALLES" as const, direction: "DESDE_AEROPUERTO" as const, flight: "KL0755", pax: 3, bags: 3, when: at(0, 18, 30), status: "EN_RUTA" as const, driver: 1 },
    { clientName: "Luis Herrera", clientPhone: "+593994444444", sector: "CENTRO" as const, direction: "AL_AEROPUERTO" as const, flight: "CM0421", pax: 2, bags: 1, when: at(-1, 6), status: "COMPLETADO" as const, driver: 2 },
    { clientName: "Ana Vaca", clientPhone: "+593995555555", sector: "NORTE" as const, direction: "AL_AEROPUERTO" as const, flight: "LA1512", pax: 4, bags: 3, when: at(1, 5, 15), status: "PENDIENTE" as const, driver: null },
  ];

  for (const r of demo) {
    await prisma.ride.create({
      data: {
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        scheduledAt: r.when,
        direction: r.direction,
        sector: r.sector,
        numPassengers: r.pax,
        numBags: r.bags,
        flightNumber: r.flight,
        price: priceForSector(r.sector),
        paymentMethod: "TRANSFERENCIA",
        status: r.status,
        driverId: r.driver !== null ? drivers[r.driver].id : null,
      },
    });
  }
  console.log(`✓ ${demo.length} viajes de ejemplo`);
}

main()
  .then(() => console.log("Seed completado."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
