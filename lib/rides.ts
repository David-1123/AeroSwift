import type {
  Sector,
  RideStatus,
  RideDirection,
  PaymentMethod,
} from "@/generated/prisma/enums";

// Reglas de capacidad del sedán ejecutivo. Si se exceden, la reserva se rechaza
// y se sugiere contactar a soporte (ver POST /api/public/rides).
export const MAX_PASSENGERS = 4;
export const MAX_BAGS = 3;

export const SECTORS: Sector[] = ["NORTE", "CENTRO", "VALLES", "SUR"];

export const SECTOR_LABELS: Record<Sector, string> = {
  NORTE: "Norte",
  CENTRO: "Centro",
  VALLES: "Valles",
  SUR: "Sur de Quito",
};

export const DIRECTION_LABELS: Record<RideDirection, string> = {
  AL_AEROPUERTO: "Hacia el aeropuerto",
  DESDE_AEROPUERTO: "Desde el aeropuerto",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  TRANSFERENCIA: "Transferencia bancaria",
  DEUNA: "Deuna!",
  TARJETA: "Tarjeta de crédito",
  EFECTIVO: "Efectivo presencial",
};

// Métodos de pago que se ofrecen al cliente en la reserva. TARJETA queda en el
// modelo (por datos antiguos) pero ya no se ofrece.
export const SELECTABLE_PAYMENT_METHODS: PaymentMethod[] = [
  "TRANSFERENCIA",
  "DEUNA",
  "EFECTIVO",
];

export const STATUS_LABELS: Record<RideStatus, string> = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  EN_RUTA: "En ruta",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

// Clases Tailwind para los badges de estado (paleta "Executive Transit").
export const STATUS_BADGE: Record<RideStatus, string> = {
  PENDIENTE: "bg-slate-200 text-slate-700",
  ASIGNADO: "bg-[#f3e2c0] text-[#5a4317]",
  EN_RUTA: "bg-[#1A202C] text-white",
  COMPLETADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-700",
};

// Transiciones de estado permitidas desde el panel admin.
export const ALLOWED_STATUS_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  PENDIENTE: ["ASIGNADO", "CANCELADO"],
  ASIGNADO: ["EN_RUTA", "CANCELADO"],
  EN_RUTA: ["COMPLETADO", "CANCELADO"],
  COMPLETADO: [],
  CANCELADO: [],
};
