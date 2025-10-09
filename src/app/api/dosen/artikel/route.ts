import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan file prisma client sudah ada
import type { KategoriArtikel } from "@/types/pkm-types";

/**
 * GET /api/dosen/artikel
 * Ambil semua data artikel dari database
 */
export async function GET() {
  try {
    const artikels = await prisma.artikel1.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Data artikel berhasil diambil",
      data: artikels,
    });
  } catch (error) {
    console.error("GET Artikel error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data artikel" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dosen/artikel
 * Tambah artikel baru ke database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.judul || !body.author || !body.namaArtikel) {
      return NextResponse.json(
        { message: "Data yang diperlukan tidak lengkap" },
        { status: 400 }
      );
    }

    const newArtikel = await prisma.artikel1.create({
      data: {
        judul: body.judul,
        author: body.author,
        namaArtikel: body.namaArtikel,
        publisher: body.publisher,
        kategori: body.kategori as KategoriArtikel,
        level: body.level || "",
        linkArtikel: body.linkArtikel,
        tanggalPublisher: new Date(body.tanggalPublisher),
        createdById: body.createdById,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Artikel berhasil ditambahkan",
        data: newArtikel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Artikel error:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan artikel" },
      { status: 500 }
    );
  }
}
