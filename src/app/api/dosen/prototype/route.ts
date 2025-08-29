// src/app/api/dosen/prototype/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Skema validasi Zod
const PrototypeSchema = z
  .object({
    author: z.array(z.string()).min(1, "Minimal 1 penulis harus diisi"),
    namaPrototype: z.string().min(1, "Nama prototype wajib diisi"),
    fungsiPrototype: z.string().min(1, "Fungsi prototype wajib diisi"),
    penggunaUtama: z.string().min(1, "Pengguna utama wajib diisi"),
    jenisPrototype: z
      .array(
        z.enum([
          "ALAT",
          "APLIKASI",
          "ALGORITMA",
          "MODUL",
          "PSEUDOCODE",
          "METODE",
        ])
      )
      .min(1, "Minimal 1 jenis prototype harus dipilih"),
    link: z.string().url("Link harus berupa URL yang valid"),
    createdById: z.string().min(1, "ID pembuat wajib diisi"),
  })
  .strict();

// ✅ Membuat data Prototype baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = PrototypeSchema.parse(body);

    const prototype = await prisma.prototype.create({
      data: {
        author: validatedData.author,
        namaPrototype: validatedData.namaPrototype,
        fungsiPrototype: validatedData.fungsiPrototype,
        penggunaUtama: validatedData.penggunaUtama,
        jenisPrototype: validatedData.jenisPrototype,
        link: validatedData.link,
        createdById: validatedData.createdById,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prototype berhasil dibuat",
        data: prototype,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi data gagal",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("POST /prototype error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat membuat prototype",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const prototypes = await prisma.prototype.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Daftar prototype berhasil diambil",
      data: prototypes,
    });
  } catch (error) {
    console.error("GET /prototype error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat mengambil data prototype",
      },
      { status: 500 }
    );
  }
}
