const ECUADOR_COUNTRY_CODE = "593";

/**
 * Normaliza un teléfono ingresado por el cliente a formato E.164
 * (+<código país><número>) para que toda integración de WhatsApp reciba un
 * formato consistente sin importar cómo lo escribió el usuario. Específico de
 * Ecuador: los móviles locales son 10 dígitos que empiezan con 0
 * (ej. 0987654321); se quita el 0 inicial y se antepone el código de país.
 *
 * Devuelve null cuando no se puede normalizar con confianza (el llamador debe
 * tratarlo como error de validación).
 */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) {
    const rest = digits.slice(1);
    if (/^\d{8,15}$/.test(rest)) return `+${rest}`;
    return null;
  }

  // Formato local Ecuador: 0987654321 (10 dígitos, empieza con 0)
  if (/^0\d{9}$/.test(digits)) {
    return `+${ECUADOR_COUNTRY_CODE}${digits.slice(1)}`;
  }

  // Ya trae código de país pero sin +: 593987654321
  if (digits.startsWith(ECUADOR_COUNTRY_CODE) && /^\d{11,12}$/.test(digits)) {
    return `+${digits}`;
  }

  // Móvil de 9 dígitos sin código de país ni 0 inicial: 987654321
  if (/^9\d{8}$/.test(digits)) {
    return `+${ECUADOR_COUNTRY_CODE}${digits}`;
  }

  return null;
}
