import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ALLOWED_STATUS_TRANSITIONS, STATUS_LABELS } from "@/lib/rides";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("assign"), driverId: z.string().min(1) }),
  z.object({
    action: z.literal("status"),
    status: z.enum(["PENDIENTE", "ASIGNADO", "EN_RUTA", "COMPLETADO", "CANCELADO"]),
  }),
  z.object({ action: z.literal("note"), note: z.string().min(1).max(1000) }),
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const ride = await prisma.ride.findUnique({ where: { id } });
  if (!ride) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 });

  const input = parsed.data;

  if (input.action === "note") {
    const updated = await prisma.ride.update({ where: { id }, data: { notes: input.note } });
    await prisma.rideEvent.create({
      data: { rideId: id, type: "NOTA", detail: input.note, createdById: admin.id },
    });
    return NextResponse.json({ ride: updated });
  }

  if (input.action === "assign") {
    const driver = await prisma.driver.findUnique({ where: { id: input.driverId } });
    if (!driver || !driver.active) {
      return NextResponse.json({ error: "Conductor no disponible" }, { status: 404 });
    }
    if (ride.status === "COMPLETADO" || ride.status === "CANCELADO") {
      return NextResponse.json(
        { error: "No se puede asignar un conductor a un viaje cerrado" },
        { status: 409 }
      );
    }
    // Asignar conductor: si estaba pendiente, pasa automáticamente a "asignado".
    const nextStatus = ride.status === "PENDIENTE" ? "ASIGNADO" : ride.status;
    const updated = await prisma.ride.update({
      where: { id },
      data: { driverId: driver.id, status: nextStatus },
      include: { driver: true },
    });
    await prisma.rideEvent.create({
      data: {
        rideId: id,
        type: "ASIGNADO",
        detail: `Conductor asignado: ${driver.fullName}`,
        createdById: admin.id,
      },
    });
    return NextResponse.json({ ride: updated });
  }

  // input.action === "status"
  const allowed = ALLOWED_STATUS_TRANSITIONS[ride.status] ?? [];
  if (!allowed.includes(input.status)) {
    return NextResponse.json(
      { error: `No se puede pasar de ${STATUS_LABELS[ride.status]} a ${STATUS_LABELS[input.status]}` },
      { status: 409 }
    );
  }
  if (input.status === "ASIGNADO" && !ride.driverId) {
    return NextResponse.json(
      { error: "Asigna primero un conductor antes de marcar el viaje como asignado" },
      { status: 409 }
    );
  }

  const updated = await prisma.ride.update({
    where: { id },
    data: { status: input.status },
    include: { driver: true },
  });
  await prisma.rideEvent.create({
    data: {
      rideId: id,
      type: "ESTADO",
      detail: `Estado: ${STATUS_LABELS[input.status]}`,
      createdById: admin.id,
    },
  });
  return NextResponse.json({ ride: updated });
}

// Elimina definitivamente un viaje que no se concretó (y su bitácora de eventos).
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const ride = await prisma.ride.findUnique({ where: { id } });
  if (!ride) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 });

  await prisma.rideEvent.deleteMany({ where: { rideId: id } });
  await prisma.ride.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
