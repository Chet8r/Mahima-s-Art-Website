import { NextResponse, type NextRequest } from "next/server";
import {
  isSessionTokenValidEdge,
  SESSION_COOKIE_NAME,
} from "@/lib/auth-edge";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Login page itself must be reachable without a session.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await isSessionTokenValidEdge(token);

  if (!valid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("from", pathname + search);
    } else {
      loginUrl.searchParams.delete("from");
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every /admin/* request (including /admin itself).
  // We intentionally skip /api/* here — those routes guard themselves
  // via assertAdmin() so the matcher stays narrow.
  matcher: ["/admin/:path*"],
};
