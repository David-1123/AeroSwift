import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const rides = await prisma.ride.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { driver: true },
  });
  return NextResponse.json({ rides });
}
