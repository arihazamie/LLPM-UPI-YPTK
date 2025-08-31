import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRoleAuth } from "@/lib/auth-helpers";

const PrestasiSchema = z
  .object({
    namaPrestasi: z.string().min(1, "Nama prestasi wajib diisi"),
    jenisPretasi: z.string().min(1, "Jenis prestasi wajib diisi"),
    peringkatJuara: z.string().min(1, "Peringkat juara wajib diisi"),
    tingkat: z.string().min(1, "Tingkat wajib diisi"),
    tanggal: z.string().min(1, "Tanggal wajib diisi"),
    penyelenggara: z.string().min(1, "Penyelenggara wajib diisi"),
    linkSertifikat: z
      .string()
      .url("Link sertifikat harus berupa URL yang valid")
      .or(z.literal("")),
    createdById: z.string().min(1, "ID pembuat wajib diisi"),
  })
  .strict();

export const POST = withRoleAuth(["ADMIN"], async (req) => {
  try {
    const body = await req.json();

    const validatedData = PrestasiSchema.parse(body);

    const prestasi = await prisma.prestasi.create({
      data: {
        namaPrestasi: validatedData.namaPrestasi,
        jenisPretasi: validatedData.jenisPretasi,
        peringkatJuara: validatedData.peringkatJuara,
        tingkat: validatedData.tingkat,
        tanggal: new Date(validatedData.tanggal),
        penyelenggara: validatedData.penyelenggara,
        linkSertifikat: validatedData.linkSertifikat,
        createdById: validatedData.createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prestasi berhasil ditambahkan",
        data: prestasi,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
});

export const GET = withRoleAuth(["ADMIN"], async () => {
  try {
    const prestasis = await prisma.prestasi.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Data prestasi berhasil diambil",
      data: prestasis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data prestasi",
      },
      { status: 500 }
    );
  }
});
