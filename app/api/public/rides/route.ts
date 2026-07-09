import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { priceForSector } from "@/lib/pricing";
import { MAX_PASSENGERS, MAX_BAGS } from "@/lib/rides";
import { buildWhatsappLink } from "@/lib/whatsapp";

const schema = z.object({
  clientName: z.string().min(3, "Ingresa tu nombre completo"),
  clientPhone: z.string().min(7, "Ingresa un teléfono válido (con WhatsApp)"),
  clientEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora"),
  direction: z.enum(["AL_AEROPUERTO", "DESDE_AEROPUERTO"]),
  sector: z.enum(["NORTE", "CENTRO", "VALLES", "SUR"]),
  numPassengers: z.coerce.number().int().min(1, "Debe viajar al menos 1 pasajero"),
  numBags: z.coerce.number().int().min(0, "Número de maletas inválido"),
  flightNumber: z.string().optional(),
  paymentMethod: z.enum(["TRANSFERENCIA", "DEUNA", "TARJETA", "EFECTIVO"]).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const d = parsed.data;

  // Validación de capacidad (regla de negocio): sedán ejecutivo hasta 4 pax / 3 maletas.
  if (d.numPassengers > MAX_PASSENGERS || d.numBags > MAX_BAGS) {
    return NextResponse.json(
      {
        error: `Nuestro sedán ejecutivo admite hasta ${MAX_PASSENGERS} pasajeros y ${MAX_BAGS} maletas. Para grupos más grandes escríbenos por WhatsApp y coordinamos un vehículo adicional.`,
        code: "CAPACITY_EXCEEDED",
      },
      { status: 422 }
    );
  }

  const clientPhone = normalizePhone(d.clientPhone);
  if (!clientPhone) {
    return NextResponse.json(
      { error: "Ingresa un número de WhatsApp válido, ej: 0987654321 o +593987654321" },
      { status: 400 }
    );
  }

  // Ecuador (America/Guayaquil) es UTC-5 todo el año; fijamos el offset para que
  // la hora que eligió el cliente se guarde correctamente sin depender del
  // huso horario del servidor.
  const scheduledAt = new Date(`${d.date}T${d.time}:00-05:00`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return NextResponse.json({ error: "Fecha u hora inválida" }, { status: 400 });
  }
  if (scheduledAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "La fecha y hora del viaje deben ser futuras" }, { status: 400 });
  }

  // ⚠️ El precio SIEMPRE se calcula en el backend a partir del sector.
  const price = priceForSector(d.sector);

  const ride = await prisma.ride.create({
    data: {
      clientName: d.clientName,
      clientPhone,
      clientEmail: d.clientEmail || undefined,
      scheduledAt,
      direction: d.direction,
      sector: d.sector,
      numPassengers: d.numPassengers,
      numBags: d.numBags,
      flightNumber: d.flightNumber || undefined,
      price,
      paymentMethod: d.paymentMethod,
      status: "PENDIENTE",
    },
  });

  await prisma.rideEvent.create({ data: { rideId: ride.id, type: "CREADO" } });

  return NextResponse.json({ ride, whatsappLink: buildWhatsappLink(ride) });
}
