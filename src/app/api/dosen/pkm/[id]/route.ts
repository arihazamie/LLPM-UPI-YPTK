import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan prisma instance ada
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

// UPDATE PKM
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
        { message: "ID PKM diperlukan" },
        { status: 400 }
      );
    }

    // Cek apakah PKM milik user yang login
    const existingPkm = await prisma.pKM.findFirst({
      where: {
        id: id,
        createdById: session!.user.id,
      },
    });

    if (!existingPkm) {
      return NextResponse.json(
        { message: "PKM tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validasi field yang diperlukan untuk PKM
    if (!body.proposal || !body.laporan) {
      return NextResponse.json(
        { message: "Proposal dan laporan wajib diisi" },
        { status: 400 }
      );
    }

    // Mulai transaksi untuk update PKM dan relasi
    const updatedPkm = await prisma.$transaction(async (tx) => {
      // Update PKM utama
      const pkm = await tx.pKM.update({
        where: { id },
        data: {
          proposal: body.proposal,
          laporan: body.laporan,
          updatedAt: new Date(),
        },
        include: {
          publikasi: true,
          hki: true,
          buku: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Hapus data lama jika ada
      if (body.publikasi !== undefined) {
        await tx.publikasi.deleteMany({
          where: { pkmId: id },
        });
      }
      if (body.hki !== undefined) {
        await tx.hKI.deleteMany({
          where: { pkmId: id },
        });
      }
      if (body.buku !== undefined) {
        await tx.buku.deleteMany({
          where: { pkmId: id },
        });
      }

      // Tambah data baru jika ada
      if (body.publikasi && body.publikasi.length > 0) {
        await tx.publikasi.createMany({
          data: body.publikasi.map(
            (pub: {
              judul: string;
              author: string[];
              namaJurnal: string;
              publisher: string;
              kategori: string;
              level?: string;
            }) => ({
              ...pub,
              pkmId: id,
              createdById: pkm.createdById,
            })
          ),
        });
      }

      if (body.hki && body.hki.length > 0) {
        await tx.hKI.createMany({
          data: body.hki.map(
            (h: {
              author: string[];
              nomorPenciptaan: string;
              tanggalPermohonan: Date;
              jenisCiptaan: string;
              judulCiptaan: string;
              linkSertifikat: string;
            }) => ({
              ...h,
              pkmId: id,
              createdById: pkm.createdById,
            })
          ),
        });
      }

      if (body.buku && body.buku.length > 0) {
        await tx.buku.createMany({
          data: body.buku.map(
            (b: {
              author: string[];
              judulBuku: string;
              penerbit: string;
              isbn: string;
              tahun: number;
              jenisBuku: string;
              linkBuku: string;
            }) => ({
              ...b,
              pkmId: id,
              createdById: pkm.createdById,
            })
          ),
        });
      }

      // Ambil data terbaru dengan relasi
      return await tx.pKM.findUnique({
        where: { id },
        include: {
          publikasi: true,
          hki: true,
          buku: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      { message: "PKM berhasil diperbarui", data: updatedPkm },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating PKM:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "PKM tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal memperbarui PKM" },
      { status: 500 }
    );
  }
}

// DELETE PKM
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
        { message: "ID PKM diperlukan" },
        { status: 400 }
      );
    }

    // Cek apakah PKM milik user yang login
    const existingPkm = await prisma.pKM.findFirst({
      where: {
        id: id,
        createdById: session!.user.id,
      },
    });

    if (!existingPkm) {
      return NextResponse.json(
        { message: "PKM tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 }
      );
    }

    const deletedPkm = await prisma.pKM.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "PKM berhasil dihapus", data: deletedPkm },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting PKM:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "PKM tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal menghapus PKM" },
      { status: 500 }
    );
  }
}
