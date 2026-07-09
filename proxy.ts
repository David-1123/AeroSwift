import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Next.js 16 renombró `middleware` a `proxy` (corre en runtime Node por defecto).
// Aquí solo hacemos el redirect de UX para proteger las páginas /admin; la
// verdadera frontera de seguridad (lectura/mutación de datos) se valida además
// dentro de cada route handler con getCurrentAdmin(), como recomienda el doc.

const SESSION_COOKIE = "aeroswift_admin_session";

function hasValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = hasValidSession(request.cookies.get(SESSION_COOKIE)?.value);

  // Ya autenticado entrando a /admin/login -> mándalo al panel.
  if (pathname === "/admin/login") {
    if (authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Resto de /admin/* requiere sesión válida.
  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
