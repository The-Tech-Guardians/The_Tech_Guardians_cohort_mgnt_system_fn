import { NextResponse, type NextRequest } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((base64Url.length + 3) % 4);
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (and nested) on the server edge.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const payload = decodeJwtPayload(token);
    const role = String(payload?.role || "").toUpperCase();

    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = role === "INSTRUCTOR" ? "/instructor" : role === "LEARNER" ? "/learner" : "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

