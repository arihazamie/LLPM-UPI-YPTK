// src/app/api/dosen/prototype/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withRoleAuth } from "@/lib/auth-helpers";

// UPDATE PROTOTYPE
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
      const { id } = await params;
      if (!id) {
        return NextResponse.json(
          { message: "ID Prototype diperlukan" },
          { status: 400 }
        );
      }

      // Cek apakah Prototype milik user yang login
      const existingPrototype = await prisma.prototype.findFirst({
        where: {
          id: id,
          createdById: user.id,
        },
      });

      if (!existingPrototype) {
        return NextResponse.json(
          { message: "Prototype tidak ditemukan atau Anda tidak memiliki akses" },
          { status: 404 }
        );
      }

      const body = await request.json();

      // Validasi field yang diperlukan
      if (
        !body.author ||
        !body.namaPrototype ||
        !body.fungsiPrototype ||
        !body.penggunaUtama ||
        !body.jenisPrototype ||
        !body.link
      ) {
        return NextResponse.json(
          { message: "Semua field wajib diisi" },
          { status: 400 }
        );
      }

      const updatedPrototype = await prisma.prototype.update({
        where: { id },
        data: {
          author: body.author,
          namaPrototype: body.namaPrototype,
          fungsiPrototype: body.fungsiPrototype,
          penggunaUtama: body.penggunaUtama,
          jenisPrototype: body.jenisPrototype,
          link: body.link,
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
        { message: "Prototype berhasil diperbarui", data: updatedPrototype },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error updating Prototype:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Prototype tidak ditemukan" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { message: "Gagal memperbarui Prototype" },
        { status: 500 }
      );
    }
  })(request);
}

// DELETE PROTOTYPE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
      const { id } = await params;
      if (!id) {
        return NextResponse.json(
          { message: "ID Prototype diperlukan" },
          { status: 400 }
        );
      }

      // Cek apakah Prototype milik user yang login
      const existingPrototype = await prisma.prototype.findFirst({
        where: {
          id: id,
          createdById: user.id,
        },
      });

      if (!existingPrototype) {
        return NextResponse.json(
          { message: "Prototype tidak ditemukan atau Anda tidak memiliki akses" },
          { status: 404 }
        );
      }

      const deletedPrototype = await prisma.prototype.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "Prototype berhasil dihapus", data: deletedPrototype },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error deleting Prototype:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Prototype tidak ditemukan" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { message: "Gagal menghapus Prototype" },
        { status: 500 }
      );
    }
  })(request);
}
