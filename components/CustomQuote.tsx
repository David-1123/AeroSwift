"use client";

import { useState } from "react";

const SERVICE_TYPES = [
  "Traslado a otra ciudad",
  "Evento o turismo",
  "Viaje con acompañante",
  "Otro",
];

function whatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593961215149";
}

export function CustomQuote() {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (destination.trim().length < 2) {
      setError("Indica a dónde quieres ir (ej: Riobamba).");
      return;
    }
    const lines = [
      "*Cotización personalizada AeroSwift*",
      "",
      `*Servicio:* ${serviceType}`,
      `*Destino:* ${destination.trim()}`,
      `*Fecha:* ${date || "Por definir"}`,
      `*Pasajeros:* ${passengers}`,
      details.trim() ? `*Detalles:* ${details.trim()}` : null,
      "",
      "Hola, quisiera cotizar este traslado personalizado. ¿Me ayudan con el precio?",
    ].filter((l) => l !== null);
    const url = `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-line bg-surface-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de servicio">
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="¿A dónde vas?">
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setError(null);
            }}
            placeholder="Ej: Riobamba, Baños, Otavalo…"
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
        <Field label="Fecha (opcional)">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
        <Field label="Pasajeros">
          <input
            type="number"
            min={1}
            max={20}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm tabular focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Detalles (opcional)">
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
            placeholder="Punto de salida, ida y vuelta, horarios, equipaje especial…"
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
      </div>

      {error && (
        <p className="mt-3 rounded border-l-2 border-red-500 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1eb457] sm:w-auto"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.01c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.13.22-3.8-.79-3.2-1.24-5.25-4.48-5.41-4.69-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.66.29-.32.63-.4.84-.4h.6c.19 0 .45-.07.7.53.24.6.83 2.07.9 2.22.07.15.12.32.02.53-.1.21-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.15.26.1 1.67.79 1.96.93.29.15.48.22.55.34.07.12.07.71-.17 1.39z" />
        </svg>
        Cotizar por WhatsApp
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-onyx">{label}</span>
      {children}
    </label>
  );
}
