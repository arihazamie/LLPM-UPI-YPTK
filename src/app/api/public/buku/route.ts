import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/buku
 * Ambil semua data buku (public access)
 */
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Data buku berhasil diambil",
      data: books,
    });
  } catch (error) {
    console.error("GET Book error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}
