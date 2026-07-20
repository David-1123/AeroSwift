"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SECTORS,
  SECTOR_LABELS,
  DIRECTION_LABELS,
  PAYMENT_LABELS,
  SELECTABLE_PAYMENT_METHODS,
  MAX_PASSENGERS,
  MAX_BAGS,
} from "@/lib/rides";
import { priceForSector, formatUsd } from "@/lib/pricing";
import { BANK_ACCOUNTS, DEUNA } from "@/lib/payments";
import type {
  Sector,
  RideDirection,
  PaymentMethod,
} from "@/generated/prisma/enums";

type FormState = {
  direction: RideDirection;
  sector: Sector | "";
  date: string;
  time: string;
  numPassengers: number;
  numBags: number;
  flightNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  paymentMethod: PaymentMethod | "";
};

const STEPS = ["Ruta", "Detalles", "Datos", "Pago", "Confirmar"] as const;

const initialState: FormState = {
  direction: "AL_AEROPUERTO",
  sector: "",
  date: "",
  time: "",
  numPassengers: 1,
  numBags: 0,
  flightNumber: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  paymentMethod: "",
};

type SubmitResult = { id: string; whatsappLink: string; price: number };

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const estimate = form.sector ? priceForSector(form.sector) : null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!form.sector) return "Selecciona la zona en Quito.";
      if (!form.date) return "Selecciona la fecha del viaje.";
      if (!form.time) return "Selecciona la hora del viaje.";
    }
    if (current === 1) {
      if (form.numPassengers > MAX_PASSENGERS)
        return `Máximo ${MAX_PASSENGERS} pasajeros. Para grupos más grandes, escríbenos por WhatsApp.`;
      if (form.numBags > MAX_BAGS)
        return `Máximo ${MAX_BAGS} maletas. Para más equipaje, escríbenos por WhatsApp.`;
      if (form.numPassengers < 1) return "Debe viajar al menos 1 pasajero.";
    }
    if (current === 2) {
      if (form.clientName.trim().length < 3) return "Ingresa tu nombre completo.";
      if (form.clientPhone.trim().length < 7) return "Ingresa tu WhatsApp de contacto.";
    }
    if (current === 3) {
      if (!form.paymentMethod) return "Elige un método de pago.";
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    if (step === 3) {
      void submit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/public/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.clientName,
          clientPhone: form.clientPhone,
          clientEmail: form.clientEmail || undefined,
          date: form.date,
          time: form.time,
          direction: form.direction,
          sector: form.sector,
          numPassengers: form.numPassengers,
          numBags: form.numBags,
          flightNumber: form.flightNumber || undefined,
          paymentMethod: form.paymentMethod || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo crear la reserva. Intenta de nuevo.");
        setSubmitting(false);
        return;
      }
      setResult({ id: data.ride.id, whatsappLink: data.whatsappLink, price: data.ride.price });
      setStep(4);
    } catch {
      setError("Error de conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-surface-card p-6 shadow-sm sm:p-8">
      <Stepper step={step} />

      <div className="mt-8">
        {step === 0 && <StepRoute form={form} update={update} estimate={estimate} />}
        {step === 1 && <StepDetails form={form} update={update} />}
        {step === 2 && <StepContact form={form} update={update} estimate={estimate} />}
        {step === 3 && <StepPayment form={form} update={update} estimate={estimate} />}
        {step === 4 && result && <StepConfirm form={form} result={result} />}
      </div>

      {error && (
        <p className="mt-6 rounded border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {step < 4 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className="rounded border border-onyx/25 px-5 py-2.5 text-sm font-semibold text-onyx transition enabled:hover:bg-onyx/5 disabled:opacity-40"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="rounded bg-onyx px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-onyx-deep disabled:opacity-60"
          >
            {submitting ? "Procesando…" : step === 3 ? "Confirmar reserva" : "Continuar"}
          </button>
        </div>
      )}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-medium">
      {STEPS.map((label, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                state === "done"
                  ? "bg-gold text-onyx"
                  : state === "current"
                    ? "bg-onyx text-white"
                    : "bg-line text-ink-soft"
              }`}
            >
              {i + 1}
            </span>
            <span className={state === "todo" ? "text-ink-soft" : "text-onyx"}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-line sm:w-6" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Paso 1: Ruta ---------- */
function StepRoute({
  form,
  update,
  estimate,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  estimate: number | null;
}) {
  return (
    <div className="space-y-5">
      <Field label="Dirección del viaje">
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(DIRECTION_LABELS) as RideDirection[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => update("direction", d)}
              className={`rounded border px-4 py-3 text-sm font-medium transition ${
                form.direction === d
                  ? "border-onyx bg-onyx text-white"
                  : "border-line bg-white text-ink hover:border-onyx/40"
              }`}
            >
              {DIRECTION_LABELS[d]}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Zona en Quito">
        <select
          value={form.sector}
          onChange={(e) => update("sector", e.target.value as Sector)}
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          <option value="">Selecciona tu zona…</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {SECTOR_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha">
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
        <Field label="Hora">
          <input
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
      </div>

      <p className="rounded-lg border border-line bg-bone/60 px-4 py-3 text-xs text-ink-soft">
        📍 La dirección exacta de recogida la coordinas por WhatsApp al confirmar tu
        reserva. Con la zona nos basta para calcular tu tarifa.
      </p>

      <PriceEstimate estimate={estimate} />
    </div>
  );
}

/* ---------- Paso 2: Detalles ---------- */
function StepDetails({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Pasajeros (máx. ${MAX_PASSENGERS})`}>
          <Counter
            value={form.numPassengers}
            min={1}
            max={MAX_PASSENGERS}
            onChange={(v) => update("numPassengers", v)}
          />
        </Field>
        <Field label={`Maletas (máx. ${MAX_BAGS})`}>
          <Counter
            value={form.numBags}
            min={0}
            max={MAX_BAGS}
            onChange={(v) => update("numBags", v)}
          />
        </Field>
      </div>

      <Field label="Número de vuelo (opcional)">
        <input
          type="text"
          value={form.flightNumber}
          onChange={(e) => update("flightNumber", e.target.value.toUpperCase())}
          placeholder="Ej: LA1435"
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm uppercase focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          Si lo agregas, monitoreamos tu vuelo para ajustar la recogida si hay retrasos.
        </p>
      </Field>
    </div>
  );
}

/* ---------- Paso 3: Datos de contacto ---------- */
function StepContact({
  form,
  update,
  estimate,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  estimate: number | null;
}) {
  return (
    <div className="space-y-5">
      <Field label="Nombre completo">
        <input
          type="text"
          value={form.clientName}
          onChange={(e) => update("clientName", e.target.value)}
          placeholder="Nombre y apellido"
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono / WhatsApp">
          <input
            type="tel"
            value={form.clientPhone}
            onChange={(e) => update("clientPhone", e.target.value)}
            placeholder="0987654321"
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
        <Field label="Correo (opcional)">
          <input
            type="email"
            value={form.clientEmail}
            onChange={(e) => update("clientEmail", e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>
      </div>
      <RideSummary form={form} estimate={estimate} />
    </div>
  );
}

/* ---------- Paso 4: Pago ---------- */
const PAYMENT_HINTS: Record<PaymentMethod, string> = {
  TRANSFERENCIA: "Transfiere a una de nuestras cuentas y envía el comprobante por WhatsApp.",
  DEUNA: "Escanea el código con tu app Deuna! y paga el monto.",
  TARJETA: "Cobro presencial con datáfono durante el viaje.",
  EFECTIVO: "Pagas en efectivo al conductor durante el viaje.",
};

function StepPayment({
  form,
  update,
  estimate,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  estimate: number | null;
}) {
  return (
    <div className="space-y-5">
      <PriceEstimate estimate={estimate} />
      <div className="space-y-3">
        {SELECTABLE_PAYMENT_METHODS.map((m) => {
          const selected = form.paymentMethod === m;
          return (
            <div
              key={m}
              className={`rounded-lg border transition ${
                selected ? "border-gold bg-gold-soft/30 ring-2 ring-gold/30" : "border-line bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => update("paymentMethod", m)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                    selected ? "border-gold" : "border-onyx/30"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-gold" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-onyx">{PAYMENT_LABELS[m]}</span>
                  <span className="mt-0.5 block text-xs text-ink-soft">{PAYMENT_HINTS[m]}</span>
                </span>
              </button>

              {selected && (
                <div className="border-t border-gold/30 px-4 py-4">
                  <PaymentDetails method={m} amount={estimate} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-gold/30 bg-gold-soft/20 px-4 py-3">
        <span className="text-base">📲</span>
        <p className="text-xs text-ink-soft">
          Envía tu comprobante por WhatsApp en el último paso para confirmar tu reserva y el pago de
          inmediato.
        </p>
      </div>
    </div>
  );
}

function PaymentDetails({ method, amount }: { method: PaymentMethod; amount: number | null }) {
  if (method === "TRANSFERENCIA") {
    return (
      <div className="space-y-4">
        {amount !== null && (
          <p className="text-xs text-ink-soft">
            Monto a transferir: <span className="font-semibold text-onyx">{formatUsd(amount)}</span>
          </p>
        )}
        {BANK_ACCOUNTS.map((a) => (
          <div key={a.bank} className="rounded-lg border border-line bg-bone/50 p-3">
            <p className="text-sm font-semibold text-onyx">{a.bank}</p>
            <dl className="mt-2 space-y-1.5 text-sm">
              <Row label="Tipo de cuenta" value={a.type} />
              <Row label="Titular" value={a.holder} />
              <Row label="N.º de cuenta" value={a.number} copy />
              <Row label="Cédula / RUC" value={a.idNumber} copy />
            </dl>
          </div>
        ))}
      </div>
    );
  }

  if (method === "DEUNA") {
    return (
      <div className="flex flex-col items-center text-center">
        <p className="mb-3 text-xs text-ink-soft">Escanea el código con tu app Deuna! y paga el monto.</p>
        <div className="overflow-hidden rounded-lg border border-line bg-white p-2">
          <Image
            src={DEUNA.qrSrc}
            alt="Código QR de Deuna!"
            width={200}
            height={200}
            className="h-48 w-48 object-contain"
          />
        </div>
        <p className="mt-2 text-xs font-medium text-onyx">{DEUNA.holder}</p>
      </div>
    );
  }

  if (method === "EFECTIVO") {
    return (
      <p className="text-sm text-ink-soft">
        Pagas <span className="font-medium text-onyx">en efectivo directamente al conductor</span> al
        inicio del viaje. Te recomendamos tener el monto exacto a la mano.
      </p>
    );
  }

  // TARJETA
  return (
    <p className="text-sm text-ink-soft">
      El cobro con tarjeta se realiza <span className="font-medium text-onyx">en persona con datáfono</span>{" "}
      durante el viaje. No necesitas pagar por adelantado.
    </p>
  );
}

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-ink-soft">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-medium text-onyx tabular">{value}</span>
        {copy && <CopyButton value={value} />}
      </span>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard no disponible */
        }
      }}
      className="rounded border border-gold/50 px-2 py-0.5 text-xs font-semibold text-[#745a2d] hover:bg-gold-soft/50"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}

/* ---------- Paso 5: Confirmar por WhatsApp ---------- */
function StepConfirm({ form, result }: { form: FormState; result: SubmitResult }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-onyx">¡Reserva registrada!</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Código <span className="font-semibold text-onyx">{result.id.slice(-6).toUpperCase()}</span>.
        Envía tu comprobante por WhatsApp para confirmar tu reserva y el pago de inmediato.
      </p>

      <div className="mt-6 rounded-lg border border-line bg-bone/60 p-5 text-left text-sm">
        <SummaryRow label="Servicio" value={DIRECTION_LABELS[form.direction]} />
        <SummaryRow label="Zona" value={form.sector ? SECTOR_LABELS[form.sector] : "—"} />
        <SummaryRow label="Fecha y hora" value={`${form.date} · ${form.time}`} />
        <SummaryRow label="Vuelo" value={form.flightNumber || "Sin especificar"} />
        <SummaryRow label="Pasajeros / Maletas" value={`${form.numPassengers} / ${form.numBags}`} />
        <SummaryRow label="Total" value={formatUsd(result.price)} strong />
      </div>

      <a
        href={result.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1eb457]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.01c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.13.22-3.8-.79-3.2-1.24-5.25-4.48-5.41-4.69-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.66.29-.32.63-.4.84-.4h.6c.19 0 .45-.07.7.53.24.6.83 2.07.9 2.22.07.15.12.32.02.53-.1.21-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.15.26.1 1.67.79 1.96.93.29.15.48.22.55.34.07.12.07.71-.17 1.39z" />
        </svg>
        Enviar comprobante por WhatsApp
      </a>

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <Link href="/dashboard" className="text-onyx underline underline-offset-4 hover:text-gold">
          Ver mis viajes
        </Link>
        <Link href="/" className="text-ink-soft hover:text-onyx">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

/* ---------- Piezas compartidas ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-onyx">{label}</span>
      {children}
    </label>
  );
}

function Counter({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded border border-line text-lg text-onyx hover:bg-onyx/5"
      >
        −
      </button>
      <span className="w-8 text-center text-lg font-semibold tabular text-onyx">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center rounded border border-line text-lg text-onyx hover:bg-onyx/5"
      >
        +
      </button>
    </div>
  );
}

function PriceEstimate({ estimate }: { estimate: number | null }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gold/40 bg-gold-soft/30 px-4 py-3">
      <span className="text-sm font-medium text-onyx">Precio estimado</span>
      <span className="font-display text-2xl font-bold text-onyx tabular">
        {estimate !== null ? formatUsd(estimate) : "$0"}
      </span>
    </div>
  );
}

function RideSummary({ form, estimate }: { form: FormState; estimate: number | null }) {
  return (
    <div className="rounded-lg border border-line bg-bone/60 p-5 text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Resumen de tu reserva
      </p>
      <SummaryRow label="Servicio" value={DIRECTION_LABELS[form.direction]} />
      <SummaryRow label="Zona" value={form.sector ? SECTOR_LABELS[form.sector] : "—"} />
      <SummaryRow label="Fecha y hora" value={`${form.date || "—"} · ${form.time || "—"}`} />
      <SummaryRow label="Pasajeros / Maletas" value={`${form.numPassengers} / ${form.numBags}`} />
      <SummaryRow label="Total" value={estimate !== null ? formatUsd(estimate) : "$0"} strong />
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 py-1.5 last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className={strong ? "font-display text-lg font-bold text-onyx tabular" : "font-medium text-onyx"}>
        {value}
      </span>
    </div>
  );
}
