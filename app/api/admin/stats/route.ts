import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Límites del "día de hoy" en horario de Ecuador (UTC-5, sin horario de verano).
function ecuadorTodayRange(): { start: Date; end: Date } {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" }); // YYYY-MM-DD
  const start = new Date(`${today}T00:00:00-05:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { start, end } = ecuadorTodayRange();

  const [ridesToday, pending, earningsAgg] = await Promise.all([
    prisma.ride.count({
      where: { scheduledAt: { gte: start, lt: end }, status: { not: "CANCELADO" } },
    }),
    prisma.ride.count({ where: { status: "PENDIENTE" } }),
    // Ganancias del día: suma de tarifas de viajes completados hoy.
    prisma.ride.aggregate({
      _sum: { price: true },
      where: { status: "COMPLETADO", scheduledAt: { gte: start, lt: end } },
    }),
  ]);

  return NextResponse.json({
    ridesToday,
    pending,
    earningsToday: earningsAgg._sum.price ?? 0,
  });
}
