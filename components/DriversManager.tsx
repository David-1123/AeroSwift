"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type Driver = {
  id: string;
  fullName: string;
  phone: string;
  vehicle: string | null;
  plate: string | null;
};

export function DriversManager({ drivers }: { drivers: Driver[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", phone: "", vehicle: "", plate: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          vehicle: form.vehicle || undefined,
          plate: form.plate || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo añadir el conductor.");
        return;
      }
      setForm({ fullName: "", phone: "", vehicle: "", plate: "" });
      router.refresh();
    } catch {
      setError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(d: Driver) {
    if (!window.confirm(`¿Quitar a ${d.fullName} de la lista de conductores?`)) return;
    setBusyId(d.id);
    try {
      const res = await fetch(`/api/admin/drivers/${d.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else setError("No se pudo quitar el conductor.");
    } catch {
      setError("Error de conexión.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Añadir conductor */}
      <div className="rounded-lg border border-line bg-surface-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-onyx">Añadir conductor</h2>
        <form onSubmit={add} className="mt-4 space-y-4">
          <Input label="Nombre completo" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Nombre y apellido" />
          <Input label="Teléfono / WhatsApp" value={form.phone} onChange={(v) => set("phone", v)} placeholder="0987654321" />
          <Input label="Vehículo (opcional)" value={form.vehicle} onChange={(v) => set("vehicle", v)} placeholder="Chevrolet Aveo gris" />
          <Input label="Placa (opcional)" value={form.plate} onChange={(v) => set("plate", v)} placeholder="PABC-1234" />
          {error && (
            <p className="rounded border-l-2 border-red-500 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-onyx px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-onyx-deep disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Añadir conductor"}
          </button>
        </form>
      </div>

      {/* Lista */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-onyx">
          Conductores activos <span className="text-ink-soft">({drivers.length})</span>
        </h2>
        {drivers.length === 0 ? (
          <div className="rounded-lg border border-line bg-surface-card p-8 text-center text-sm text-ink-soft">
            Aún no hay conductores. Añade el primero con el formulario.
          </div>
        ) : (
          <ul className="space-y-3">
            {drivers.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-line bg-surface-card p-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-onyx">{d.fullName}</p>
                  <p className="text-sm text-ink-soft tabular">{d.phone}</p>
                  {(d.vehicle || d.plate) && (
                    <p className="text-xs text-ink-soft">
                      {[d.vehicle, d.plate].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busyId === d.id}
                  onClick={() => remove(d)}
                  className="rounded border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-onyx">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
    </label>
  );
}
