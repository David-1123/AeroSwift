"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RideStatus } from "@/generated/prisma/enums";
import { StatusBadge } from "@/components/StatusBadge";
import { ALLOWED_STATUS_TRANSITIONS, STATUS_LABELS } from "@/lib/rides";
import { formatUsd } from "@/lib/pricing";

export type RideRow = {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  scheduledAtISO: string;
  dayKey: string; // YYYY-MM-DD (Ecuador)
  dayLabel: string; // "miércoles, 15 de julio"
  timeLabel: string; // "03:57 p. m."
  route: string;
  flightNumber: string;
  numPassengers: number;
  numBags: number;
  price: number;
  status: RideStatus;
  payment: string;
  driverId: string | null;
  driverName: string | null;
};

export type DriverOption = { id: string; fullName: string };

type Stats = { ridesToday: number; pending: number; earningsToday: number };

const ACTIVE_STATUSES: RideStatus[] = ["PENDIENTE", "ASIGNADO", "EN_RUTA"];

type FilterKey = "todos" | "hoy" | "activos" | "futuros" | "realizados" | "cancelados";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "hoy", label: "Hoy" },
  { key: "activos", label: "Activos" },
  { key: "futuros", label: "Futuros" },
  { key: "realizados", label: "Realizados" },
  { key: "cancelados", label: "Cancelados" },
];

export function AdminBoard({
  initialRides,
  drivers,
  stats,
}: {
  initialRides: RideRow[];
  drivers: DriverOption[];
  stats: Stats;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("todos");

  const todayKey = useMemo(
    () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date()),
    []
  );

  function matchesFilter(r: RideRow, f: FilterKey): boolean {
    const isActive = ACTIVE_STATUSES.includes(r.status);
    switch (f) {
      case "todos":
        return true;
      case "hoy":
        return r.dayKey === todayKey;
      case "activos":
        return isActive;
      case "futuros":
        return isActive && new Date(r.scheduledAtISO).getTime() > Date.now();
      case "realizados":
        return r.status === "COMPLETADO";
      case "cancelados":
        return r.status === "CANCELADO";
    }
  }

  const counts = useMemo(() => {
    const c = {} as Record<FilterKey, number>;
    for (const f of FILTERS) c[f.key] = initialRides.filter((r) => matchesFilter(r, f.key)).length;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRides, todayKey]);

  // Agrupa los viajes filtrados por día (orden ascendente por fecha/hora).
  const groups = useMemo(() => {
    const filtered = initialRides
      .filter((r) => matchesFilter(r, filter))
      .sort((a, b) => a.scheduledAtISO.localeCompare(b.scheduledAtISO));
    const map = new Map<string, { label: string; rides: RideRow[] }>();
    for (const r of filtered) {
      if (!map.has(r.dayKey)) map.set(r.dayKey, { label: r.dayLabel, rides: [] });
      map.get(r.dayKey)!.rides.push(r);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRides, filter, todayKey]);

  async function mutate(id: string, method: "PATCH" | "DELETE", body?: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rides/${id}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo actualizar el viaje.");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de conexión.");
    } finally {
      setBusyId(null);
    }
  }

  function removeRide(r: RideRow) {
    if (
      !window.confirm(
        `¿Eliminar el viaje de ${r.clientName} (#${r.code})? Esta acción no se puede deshacer.`
      )
    )
      return;
    void mutate(r.id, "DELETE");
  }

  return (
    <div>
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Viajes hoy" value={String(stats.ridesToday)} />
        <Kpi label="Pendientes" value={String(stats.pending)} accent />
        <Kpi label="Ganancias hoy" value={formatUsd(stats.earningsToday)} />
      </div>

      {/* Filtros */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === f.key
                ? "bg-onyx text-white"
                : "bg-surface-card text-ink-soft ring-1 ring-line hover:text-onyx"
            }`}
          >
            {f.label}
            <span className={filter === f.key ? "text-bone/60" : "text-ink-soft/60"}> {counts[f.key]}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Vista calendario: agrupado por día */}
      {groups.length === 0 ? (
        <div className="mt-8 rounded-lg border border-line bg-surface-card p-10 text-center text-ink-soft">
          No hay viajes en esta vista.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map(([dayKey, group]) => (
            <section key={dayKey}>
              <div className="mb-2 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold capitalize text-onyx">
                  {group.label}
                </h3>
                <span className="rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-ink-soft">
                  {group.rides.length} {group.rides.length === 1 ? "viaje" : "viajes"}
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-line bg-surface-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] text-sm">
                    <thead>
                      <tr className="bg-onyx text-left text-xs font-semibold uppercase tracking-wide text-gold">
                        <th className="px-4 py-3">Hora</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Ruta</th>
                        <th className="px-4 py-3">Vuelo</th>
                        <th className="px-4 py-3">Pax/Mal</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Conductor</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {group.rides.map((ride, i) => {
                        const nextActions = (ALLOWED_STATUS_TRANSITIONS[ride.status] ?? []).filter(
                          (s) => s !== "ASIGNADO"
                        );
                        const busy = busyId === ride.id;
                        const closed = ride.status === "COMPLETADO" || ride.status === "CANCELADO";
                        return (
                          <tr key={ride.id} className={i % 2 === 1 ? "bg-bone/40" : ""}>
                            <td className="whitespace-nowrap px-4 py-3 tabular font-semibold text-onyx">
                              {ride.timeLabel}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-onyx">{ride.clientName}</p>
                              <p className="text-xs text-ink-soft tabular">{ride.clientPhone}</p>
                              <p className="text-xs text-ink-soft">#{ride.code}</p>
                            </td>
                            <td className="px-4 py-3 text-onyx">{ride.route}</td>
                            <td className="whitespace-nowrap px-4 py-3 tabular font-medium text-onyx">
                              {ride.flightNumber}
                            </td>
                            <td className="px-4 py-3 tabular text-ink-soft">
                              {ride.numPassengers}/{ride.numBags}
                            </td>
                            <td className="px-4 py-3 tabular font-semibold text-onyx">
                              {formatUsd(ride.price)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={ride.status} />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={ride.driverId ?? ""}
                                disabled={busy || closed}
                                onChange={(e) => {
                                  if (e.target.value)
                                    mutate(ride.id, "PATCH", {
                                      action: "assign",
                                      driverId: e.target.value,
                                    });
                                }}
                                className="w-36 rounded border border-line bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none disabled:opacity-50"
                              >
                                <option value="">Por asignar…</option>
                                {drivers.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.fullName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {nextActions.map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    disabled={busy}
                                    onClick={() => mutate(ride.id, "PATCH", { action: "status", status: s })}
                                    className={`rounded px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                                      s === "CANCELADO"
                                        ? "border border-red-300 text-red-600 hover:bg-red-50"
                                        : "bg-onyx text-white hover:bg-onyx-deep"
                                    }`}
                                  >
                                    {STATUS_LABELS[s]}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => removeRide(ride)}
                                  title="Eliminar viaje"
                                  className="rounded p-1 text-ink-soft transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                >
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        accent ? "border-gold bg-gold-soft/40" : "border-line bg-surface-card"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-onyx tabular">{value}</p>
    </div>
  );
}
