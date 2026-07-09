import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const drivers = await prisma.driver.findMany({
    where: { active: true },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json({ drivers });
}

const schema = z.object({
  fullName: z.string().min(3, "Ingresa el nombre del conductor"),
  phone: z.string().min(7, "Ingresa un teléfono válido"),
  vehicle: z.string().optional(),
  plate: z.string().optional(),
});

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const phone = normalizePhone(parsed.data.phone) ?? parsed.data.phone;

  const driver = await prisma.driver.create({
    data: {
      fullName: parsed.data.fullName,
      phone,
      vehicle: parsed.data.vehicle || undefined,
      plate: parsed.data.plate || undefined,
    },
  });
  return NextResponse.json({ driver });
}
