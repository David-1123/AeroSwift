import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-onyx text-bone/80">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <Logo tone="onDark" />
          <p className="mt-3 text-sm text-bone/60">
            Traslados privados premium en Quito · Quito, Ecuador
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/reservar" className="text-gold hover:text-white">
            Reservar traslado
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            Mis viajes
          </Link>
          <Link href="/admin/login" className="text-bone/50 hover:text-white">
            Administración
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-bone/40">
        © {new Date().getFullYear()} AeroSwift. Todos los derechos reservados.
      </div>
    </footer>
  );
}
