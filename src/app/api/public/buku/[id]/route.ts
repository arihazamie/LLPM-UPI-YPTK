import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @handler GET /api/public/buku/[id]
 * @description Ambil buku berdasarkan ID (public access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: `Buku dengan ID ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Buku berhasil ditemukan",
      data: book,
    });
  } catch (error) {
    console.error("GET Book error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil buku" },
      { status: 500 }
    );
  }
}

