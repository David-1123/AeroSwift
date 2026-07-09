import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bone/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="AeroSwift Executive">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="/#servicios" className="hover:text-onyx">Servicios</a>
          <a href="/#tarifas" className="hover:text-onyx">Tarifas</a>
          <a href="/#cobertura" className="hover:text-onyx">Cobertura</a>
          <Link href="/dashboard" className="hover:text-onyx">Mis viajes</Link>
        </nav>

        <Link
          href="/reservar"
          className="rounded bg-onyx px-4 py-2 text-sm font-semibold text-white transition hover:bg-onyx-deep"
        >
          Reservar
        </Link>
      </div>
    </header>
  );
}
