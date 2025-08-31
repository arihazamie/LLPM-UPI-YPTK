import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withRoleAuth } from "@/lib/auth-helpers";

// UPDATE PRESTASI
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
      const { id } = await params;
      if (!id) {
        return NextResponse.json(
          { message: "ID Prestasi diperlukan" },
          { status: 400 }
        );
      }

      // Cek apakah Prestasi milik user yang login
      const existingPrestasi = await prisma.prestasi.findFirst({
        where: {
          id: id,
          createdById: user.id,
        },
      });

      if (!existingPrestasi) {
        return NextResponse.json(
          { message: "Prestasi tidak ditemukan atau Anda tidak memiliki akses" },
          { status: 404 }
        );
      }

      const body = await request.json();

      // Validasi field yang diperlukan
      if (
        !body.namaPrestasi ||
        !body.jenisPretasi ||
        !body.peringkatJuara ||
        !body.tingkat ||
        !body.tanggal ||
        !body.penyelenggara
      ) {
        return NextResponse.json(
          { message: "Semua field wajib diisi kecuali linkSertifikat" },
          { status: 400 }
        );
      }

      const updatedPrestasi = await prisma.prestasi.update({
        where: { id },
        data: {
          namaPrestasi: body.namaPrestasi,
          jenisPretasi: body.jenisPretasi,
          peringkatJuara: body.peringkatJuara,
          tingkat: body.tingkat,
          tanggal: new Date(body.tanggal),
          penyelenggara: body.penyelenggara,
          linkSertifikat: body.linkSertifikat || null,
          updatedAt: new Date(),
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
        { message: "Prestasi berhasil diperbarui", data: updatedPrestasi },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error updating Prestasi:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Prestasi tidak ditemukan" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { message: "Gagal memperbarui Prestasi" },
        { status: 500 }
      );
    }
  })(request);
}

// DELETE PRESTASI
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
      const { id } = await params;
      if (!id) {
        return NextResponse.json(
          { message: "ID Prestasi diperlukan" },
          { status: 400 }
        );
      }

      // Cek apakah Prestasi milik user yang login
      const existingPrestasi = await prisma.prestasi.findFirst({
        where: {
          id: id,
          createdById: user.id,
        },
      });

      if (!existingPrestasi) {
        return NextResponse.json(
          { message: "Prestasi tidak ditemukan atau Anda tidak memiliki akses" },
          { status: 404 }
        );
      }

      const deletedPrestasi = await prisma.prestasi.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "Prestasi berhasil dihapus", data: deletedPrestasi },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error deleting Prestasi:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Prestasi tidak ditemukan" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { message: "Gagal menghapus Prestasi" },
        { status: 500 }
      );
    }
  })(request);
}
