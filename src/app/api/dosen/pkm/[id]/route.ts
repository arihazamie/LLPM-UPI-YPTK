import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateHkiId, generateBukuId, generateJurnalId } from "@/lib/utils";
import { withRoleAuth } from "@/lib/auth-helpers";

// UPDATE PKM
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
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
          createdById: user.id,
        },
        include: {
          jurnal: true,
          hki: true,
          buku: true,
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
      if (!body.judul || !body.proposal || !body.laporan) {
        return NextResponse.json(
          { message: "Judul, proposal, dan laporan wajib diisi" },
          { status: 400 }
        );
      }

      // Mulai transaksi untuk update PKM dan relasi
      const updatedPkm = await prisma.$transaction(async (tx) => {
        // Update PKM utama
        const pkm = await tx.pKM.update({
          where: { id },
          data: {
            judul: body.judul,
            proposal: body.proposal,
            laporan: body.laporan,
            updatedAt: new Date(),
          },
          include: {
            jurnal: true,
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

        // Handle jurnal update
        if (body.jurnal !== undefined) {
          // Delete existing jurnal if any
          if (existingPkm.jurnal) {
            await tx.jurnal.delete({
              where: { id: existingPkm.jurnal.id },
            });
          }

          // Create new jurnal if provided
          if (body.jurnal) {
            const jurnalId = await generateJurnalId(tx);
            await tx.jurnal.create({
              data: {
                id: jurnalId,
                ...body.jurnal,
                pkmId: id,
                createdById: pkm.createdById,
                linkJurnal: body.jurnal.linkJurnal,
              },
            });
          }
        }

        // Handle HKI update
        if (body.hki !== undefined) {
          // Delete existing HKI if any
          if (existingPkm.hki) {
            await tx.hKI.delete({
              where: { id: existingPkm.hki.id },
            });
          }

          // Create new HKI if provided
          if (body.hki) {
            const hkiId = await generateHkiId(tx);
            await tx.hKI.create({
              data: {
                id: hkiId,
                ...body.hki,
                pkmId: id,
                createdById: pkm.createdById,
                linkSertifikat: body.hki.linkSertifikat,
              },
            });
          }
        }

        // Handle buku update
        if (body.buku !== undefined) {
          // Delete existing buku if any
          if (existingPkm.buku) {
            await tx.buku.delete({
              where: { id: existingPkm.buku.id },
            });
          }

          // Create new buku if provided
          if (body.buku) {
            const bukuId = await generateBukuId(tx);
            await tx.buku.create({
              data: {
                id: bukuId,
                ...body.buku,
                pkmId: id,
                createdById: pkm.createdById,
                linkBuku: body.buku.linkBuku,
              },
            });
          }
        }

        // Ambil data terbaru dengan relasi
        return await tx.pKM.findUnique({
          where: { id },
          include: {
            jurnal: true,
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
  })(request);
}

// DELETE PKM
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoleAuth(["DOSEN", "ADMIN", "PIMPINAN"], async (req, user) => {
    try {
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
          createdById: user.id,
        },
      });

      if (!existingPkm) {
        return NextResponse.json(
          { message: "PKM tidak ditemukan atau Anda tidak memiliki akses" },
          { status: 404 }
        );
      }

      // Hapus PKM dan semua relasi yang terhubung dalam satu transaksi
      const deletedPkm = await prisma.$transaction(async (tx) => {
        // Hapus data relasi terlebih dahulu
        await tx.jurnal.deleteMany({
          where: { pkmId: id },
        });

        await tx.hKI.deleteMany({
          where: { pkmId: id },
        });

        await tx.buku.deleteMany({
          where: { pkmId: id },
        });

        // Hapus PKM utama
        return await tx.pKM.delete({
          where: { id },
        });
      });

      return NextResponse.json(
        {
          message: "PKM dan semua data terkait berhasil dihapus",
          data: deletedPkm,
        },
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
  })(request);
}
