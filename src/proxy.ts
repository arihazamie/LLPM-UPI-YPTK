import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token?: any } }) {
    const token = req.nextauth?.token;
    const { pathname } = req.nextUrl;

    // ⛔️ jangan proteksi halaman login & route auth
    if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // jika belum login, biarkan withAuth yang urus
    if (!token) {
      return NextResponse.next();
    }

    // Proteksi API routes berdasarkan role
    if (pathname.startsWith("/api/admin")) {
      if (token.role !== "ADMIN" && token.role !== "PIMPINAN") {
        return NextResponse.json(
          { error: "Unauthorized: Admin access required" },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith("/api/dosen")) {
      if (
        token.role !== "DOSEN" &&
        token.role !== "ADMIN" &&
        token.role !== "PIMPINAN"
      ) {
        return NextResponse.json(
          { error: "Unauthorized: Dosen access required" },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith("/api/export")) {
      if (token.role !== "ADMIN" && token.role !== "PIMPINAN") {
        return NextResponse.json(
          { error: "Unauthorized: Export access required" },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith("/api/stats")) {
      if (token.role !== "ADMIN" && token.role !== "PIMPINAN") {
        return NextResponse.json(
          { error: "Unauthorized: Stats access required" },
          { status: 403 }
        );
      }
    }

    // Proteksi halaman dashboard berdasarkan role
    if (pathname.startsWith("/dashboard/admin")) {
      if (token.role !== "ADMIN" && token.role !== "PIMPINAN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/pimpinan")) {
      if (token.role !== "PIMPINAN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // halaman khusus dosen
    if (
      pathname === "/pkm" ||
      pathname === "/prestasi" ||
      pathname === "/prototype"
    ) {
      if (token.role !== "DOSEN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/api/((?!auth|public).*)",
    "/dashboard/:path*",
    "/admin/:path*",
    "/pkm",
    "/prestasi",
    "/prototype",
  ],
};
