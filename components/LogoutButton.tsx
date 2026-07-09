"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded border border-white/20 px-4 py-2 text-sm font-medium text-bone/80 transition hover:bg-white/10"
    >
      Cerrar sesión
    </button>
  );
}
