import { NextResponse } from "next/server";
import { z } from "zod";
import { priceForSector } from "@/lib/pricing";

// Cotización de precio. El frontend puede mostrar un estimado por su cuenta,
// pero el precio que realmente se cobra sale del backend (aquí y al crear el
// viaje), nunca de un valor enviado por el cliente.
const schema = z.object({
  sector: z.enum(["NORTE", "CENTRO", "VALLES", "SUR"]),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Sector inválido" }, { status: 400 });
  }
  return NextResponse.json({ price: priceForSector(parsed.data.sector) });
}
