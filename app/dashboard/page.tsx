import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { PhoneLookupForm } from "@/components/PhoneLookupForm";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { SECTOR_LABELS, DIRECTION_LABELS } from "@/lib/rides";
import { formatUsd } from "@/lib/pricing";

export const metadata = { title: "Mis viajes · AeroSwift" };

function formatDateTime(d: Date): string {
  return new Date(d).toLocaleString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Guayaquil",
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tel?: string }>;
}) {
  const { tel } = await searchParams;
  const normalized = tel ? normalizePhone(tel) : null;

  const rides = normalized
    ? await prisma.ride.findMany({
        where: { clientPhone: normalized },
        orderBy: { scheduledAt: "desc" },
        include: { driver: true },
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-onyx">Mis viajes</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Consulta el estado de tus traslados con el número de WhatsApp con el que reservaste.
        </p>

        <div className="mt-6 rounded-lg border border-line bg-surface-card p-5 shadow-sm">
          <PhoneLookupForm defaultValue={tel ?? ""} />
        </div>

        {tel && !normalized && (
          <p className="mt-6 rounded border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            Ese número no parece válido. Ingresa tu WhatsApp, ej: 0987654321.
          </p>
        )}

        {normalized && rides.length === 0 && (
          <div className="mt-8 rounded-lg border border-line bg-surface-card p-8 text-center">
            <p className="text-sm text-ink-soft">
              No encontramos viajes con ese número.
            </p>
            <Link
              href="/reservar"
              className="mt-4 inline-block rounded bg-onyx px-5 py-2.5 text-sm font-semibold text-white hover:bg-onyx-deep"
            >
              Reservar un traslado
            </Link>
          </div>
        )}

        {rides.length > 0 && (
          <ul className="mt-8 space-y-4">
            {rides.map((ride) => (
              <li
                key={ride.id}
                className="rounded-lg border border-line bg-surface-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold text-onyx">
                      {DIRECTION_LABELS[ride.direction]} · {SECTOR_LABELS[ride.sector]}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-soft tabular">
                      {formatDateTime(ride.scheduledAt)}
                    </p>
                  </div>
                  <StatusBadge status={ride.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                  <Info label="Código" value={ride.id.slice(-6).toUpperCase()} />
                  <Info label="Vuelo" value={ride.flightNumber ?? "—"} />
                  <Info label="Conductor" value={ride.driver?.fullName ?? "Por asignar"} />
                  <Info label="Total" value={formatUsd(ride.price)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-0.5 font-medium text-onyx tabular">{value}</p>
    </div>
  );
}
