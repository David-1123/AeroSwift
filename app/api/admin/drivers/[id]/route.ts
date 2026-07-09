import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

// "Elimina" un conductor desactivándolo (active=false). No se borra de la BD
// para no romper la referencia de viajes históricos que tuviera asignados; deja
// de aparecer en la lista de conductores disponibles.
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 });

  await prisma.driver.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
