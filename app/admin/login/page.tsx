import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = { title: "Administración · AeroSwift" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center">
          <span className="font-display text-2xl font-bold text-white">AeroSwift</span>
          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-gold">
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
