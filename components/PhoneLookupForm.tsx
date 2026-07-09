"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PhoneLookupForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.trim().length < 7) return;
    router.push(`/dashboard?tel=${encodeURIComponent(phone.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Tu WhatsApp, ej: 0987654321"
        className="flex-1 rounded border border-line bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <button
        type="submit"
        className="rounded bg-onyx px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-onyx-deep"
      >
        Ver mis viajes
      </button>
    </form>
  );
}
