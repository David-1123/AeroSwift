import { LogoutButton } from "@/components/LogoutButton";
import { AdminNav } from "@/components/AdminNav";
import { Logo } from "@/components/Logo";

// Cascarón común de las páginas autenticadas del admin (no incluye el login).
export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bone">
      <header className="bg-onyx">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Logo tone="onDark" />
            <span className="hidden text-xs uppercase tracking-[0.2em] text-gold sm:inline">
              · Control operacional
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-bone/70 sm:inline">{adminName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <AdminNav />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
