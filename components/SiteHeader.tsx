import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bone/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-onyx text-gold">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M2 16l20-7-9 12-2-5-9 0z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-onyx">
            AeroSwift
          </span>
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
