import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRoleAuth } from "@/lib/auth-helpers";

const UpdatePrestasiSchema = z
  .object({
    namaPrestasi: z.string().min(1, "Nama prestasi wajib diisi").optional(),
    jenisPretasi: z.string().min(1, "Jenis prestasi wajib diisi").optional(),
    peringkatJuara: z.string().min(1, "Peringkat juara wajib diisi").optional(),
    tingkat: z.string().min(1, "Tingkat wajib diisi").optional(),
    tanggal: z.string().min(1, "Tanggal wajib diisi").optional(),
    penyelenggara: z.string().min(1, "Penyelenggara wajib diisi").optional(),
    linkSertifikat: z
      .string()
      .url("Link sertifikat harus berupa URL yang valid")
      .or(z.literal(""))
      .optional(),
  })
  .strict();

// --- GET SINGLE PRESTASI BY ID ---
export const GET = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID prestasi diperlukan",
        },
        { status: 400 }
      );
    }

    const prestasi = await prisma.prestasi.findUnique({
      where: { id },
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

    if (!prestasi) {
      return NextResponse.json(
        {
          success: false,
          message: "Prestasi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data prestasi berhasil diambil",
      data: prestasi,
    });
  } catch (error) {
    console.error("Error fetching prestasi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data prestasi",
      },
      { status: 500 }
    );
  }
});

// --- UPDATE PRESTASI BY ID ---
export const PUT = withRoleAuth(["ADMIN"], async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID prestasi diperlukan",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = UpdatePrestasiSchema.parse(body);

    // Check if prestasi exists
    const existingPrestasi = await prisma.prestasi.findUnique({
      where: { id },
    });

    if (!existingPrestasi) {
      return NextResponse.json(
        {
          success: false,
          message: "Prestasi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      namaPrestasi?: string;
      jenisPretasi?: string;
      peringkatJuara?: string;
      tingkat?: string;
      tanggal?: Date;
      penyelenggara?: string;
      linkSertifikat?: string;
    } = {};
    
    if (validatedData.namaPrestasi !== undefined) {
      updateData.namaPrestasi = validatedData.namaPrestasi;
    }
    if (validatedData.jenisPretasi !== undefined) {
      updateData.jenisPretasi = validatedData.jenisPretasi;
    }
    if (validatedData.peringkatJuara !== undefined) {
      updateData.peringkatJuara = validatedData.peringkatJuara;
    }
    if (validatedData.tingkat !== undefined) {
      updateData.tingkat = validatedData.tingkat;
    }
    if (validatedData.tanggal !== undefined) {
      updateData.tanggal = new Date(validatedData.tanggal);
    }
    if (validatedData.penyelenggara !== undefined) {
      updateData.penyelenggara = validatedData.penyelenggara;
    }
    if (validatedData.linkSertifikat !== undefined) {
      updateData.linkSertifikat = validatedData.linkSertifikat;
    }

    const updatedPrestasi = await prisma.prestasi.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: "Prestasi berhasil diperbarui",
      data: updatedPrestasi,
    });
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
    console.error("Error updating prestasi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui prestasi",
      },
      { status: 500 }
    );
  }
});

// --- DELETE PRESTASI BY ID ---
export const DELETE = withRoleAuth(["ADMIN"], async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID prestasi diperlukan",
        },
        { status: 400 }
      );
    }

    // Check if prestasi exists
    const existingPrestasi = await prisma.prestasi.findUnique({
      where: { id },
    });

    if (!existingPrestasi) {
      return NextResponse.json(
        {
          success: false,
          message: "Prestasi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.prestasi.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Prestasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting prestasi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus prestasi",
      },
      { status: 500 }
    );
  }
}); 