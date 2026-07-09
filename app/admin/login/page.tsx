import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Administración · AeroSwift" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo tone="onDark" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold">
            Control operacional
          </span>
        </Link>
        <div className="rounded-lg border border-white/10 bg-surface-card p-7 shadow-xl">
          <h1 className="mb-1 font-display text-xl font-bold text-onyx">Iniciar sesión</h1>
          <p className="mb-6 text-sm text-ink-soft">Acceso exclusivo del equipo AeroSwift.</p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
