import type { Sector } from "@/generated/prisma/enums";

/**
 * Tarifas fijas de AeroSwift, en dólares enteros (USD).
 *
 * ⚠️ El precio se calcula SIEMPRE aquí, en el backend, a partir del sector.
 * Nunca se debe confiar en un precio enviado por el cliente: el frontend solo
 * lo muestra como estimado, pero el valor que se persiste sale de esta función.
 *
 * Regla: $25 para el sector Sur (más lejano a Tababela), $20 para el resto.
 */
export const BASE_FARE_USD = 20;
export const SUR_FARE_USD = 25;

export function priceForSector(sector: Sector): number {
  return sector === "SUR" ? SUR_FARE_USD : BASE_FARE_USD;
}

/** Formatea un monto entero en USD para mostrarlo, ej: 25 -> "$25". */
export function formatUsd(amount: number): string {
  return `$${amount}`;
}
