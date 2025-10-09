import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { KategoriArtikel } from "@/types/pkm-types";

/**
 * @handler GET /api/dosen/artikel/[id]
 * @description Ambil artikel berdasarkan ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artikel = await prisma.artikel1.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!artikel) {
      return NextResponse.json(
        { message: `Artikel dengan ID ${params.id} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Artikel berhasil ditemukan",
      data: artikel,
    });
  } catch (error) {
    console.error("GET Artikel error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}

/**
 * @handler PUT /api/dosen/artikel/[id]
 * @description Update artikel berdasarkan ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // pastikan artikel ada
    const existing = await prisma.artikel1.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: `Artikel dengan ID ${params.id} tidak ditemukan` },
        { status: 404 }
      );
    }

    const updatedArtikel = await prisma.artikel1.update({
      where: { id: params.id },
      data: {
        judul: body.judul ?? existing.judul,
        author: body.author ?? existing.author,
        namaArtikel: body.namaArtikel ?? existing.namaArtikel,
        publisher: body.publisher ?? existing.publisher,
        kategori: (body.kategori as KategoriArtikel) ?? existing.kategori,
        level: body.level ?? existing.level,
        linkArtikel: body.linkArtikel ?? existing.linkArtikel,
        tanggalPublisher: body.tanggalPublisher
          ? new Date(body.tanggalPublisher)
          : existing.tanggalPublisher,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Artikel berhasil diperbarui",
      data: updatedArtikel,
    });
  } catch (error) {
    console.error("PUT Artikel error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui artikel" },
      { status: 500 }
    );
  }
}

/**
 * @handler DELETE /api/dosen/artikel/[id]
 * @description Hapus artikel berdasarkan ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.artikel1.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: `Artikel dengan ID ${params.id} tidak ditemukan` },
        { status: 404 }
      );
    }

    await prisma.artikel1.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Artikel error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus artikel" },
      { status: 500 }
    );
  }
}
