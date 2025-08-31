import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Jika user tidak terautentikasi, redirect ke login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
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
      if (token.role !== "DOSEN" && token.role !== "ADMIN" && token.role !== "PIMPINAN") {
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

    // Proteksi halaman dosen (hanya DOSEN yang bisa akses)
    if (pathname === "/pkm" || pathname === "/prestasi" || pathname === "/prototype") {
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
    // Proteksi semua API routes kecuali auth dan public
    "/api/((?!auth|public).*)",
    // Proteksi halaman dashboard
    "/dashboard/:path*",
    // Proteksi halaman yang memerlukan login
    "/admin/:path*",
    "/pkm",
    "/prestasi",
    "/prototype",
  ],
}; 