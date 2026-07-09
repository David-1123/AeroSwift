import type { Ride } from "@/generated/prisma/client";
import { SECTOR_LABELS, DIRECTION_LABELS, PAYMENT_LABELS } from "@/lib/rides";
import { formatUsd } from "@/lib/pricing";

/** Número de WhatsApp del negocio (formato internacional sin +). */
export function businessWhatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593961215149";
}

function formatDateTime(d: Date): string {
  return new Date(d).toLocaleString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Construye el texto del mensaje de WhatsApp con el detalle del viaje para que
 * el cliente confirme la reserva y el pago enviando su comprobante.
 */
export function buildRideMessage(ride: Ride): string {
  const lines: (string | null)[] = [
    "*Nueva reserva AeroSwift*",
    "",
    `*Código:* ${ride.id.slice(-6).toUpperCase()}`,
    `*Cliente:* ${ride.clientName}`,
    `*Teléfono:* ${ride.clientPhone}`,
    `*Servicio:* ${DIRECTION_LABELS[ride.direction]}`,
    `*Zona:* ${SECTOR_LABELS[ride.sector]}`,
    `*Fecha y hora:* ${formatDateTime(ride.scheduledAt)}`,
    ride.flightNumber ? `*Vuelo:* ${ride.flightNumber}` : null,
    `*Pasajeros:* ${ride.numPassengers} - *Maletas:* ${ride.numBags}`,
    ride.paymentMethod ? `*Pago:* ${PAYMENT_LABELS[ride.paymentMethod]}` : null,
    `*Total:* ${formatUsd(ride.price)}`,
    "",
    "Enseguida les comparto mi dirección exacta de recogida por aquí.",
    "Adjunto también mi comprobante de pago para confirmar.",
  ];
  // Solo quitamos las líneas opcionales ausentes (null); conservamos las
  // líneas en blanco ("") para que el mensaje quede bien espaciado.
  return lines.filter((line) => line !== null).join("\n");
}

/** Enlace wa.me listo para abrir con el mensaje precargado. */
export function buildWhatsappLink(ride: Ride): string {
  const text = encodeURIComponent(buildRideMessage(ride));
  return `https://wa.me/${businessWhatsappNumber()}?text=${text}`;
}
