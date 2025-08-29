// src/app/api/dosen/prototype/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// --- Session Verification ---
async function verifyDosenSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu",
        },
        { status: 401 }
      ),
    };
  }
  if (session.user.role !== "DOSEN") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message:
            "Akses ditolak: Hanya dosen yang dapat mengakses endpoint ini",
        },
        { status: 403 }
      ),
    };
  }
  return { session };
}

// UPDATE PROTOTYPE
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: sessionError, session } = await verifyDosenSession();
    if (sessionError) return sessionError;

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
        createdById: session!.user.id,
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
}

// DELETE PROTOTYPE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: sessionError, session } = await verifyDosenSession();
    if (sessionError) return sessionError;

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
        createdById: session!.user.id,
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
}
