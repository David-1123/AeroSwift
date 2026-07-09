"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Viajes" },
  { href: "/admin/conductores", label: "Conductores" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-line bg-surface-card">
      <div className="mx-auto flex max-w-[1280px] gap-1 px-4 sm:px-6 lg:px-10">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-gold text-onyx"
                  : "border-transparent text-ink-soft hover:text-onyx"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
