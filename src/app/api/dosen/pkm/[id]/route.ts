import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateHkiId, generateBukuId, generateArtikelId } from "@/lib/utils";
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
          artikel: true,
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
            artikel: true,
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

        // Handle artikel update (array)
        if (body.artikel !== undefined) {
          // Hapus semua artikel lama milik PKM ini
          await tx.artikel.deleteMany({ where: { pkmId: id } });

          // Buat ulang jika ada artikel baru
          if (Array.isArray(body.artikel) && body.artikel.length > 0) {
            const artikelData = await Promise.all(
              body.artikel.map(
                async (a: {
                  author: string;
                  judul: string;
                  namaArtikel: string;
                  publisher: string;
                  kategori: string;
                  level?: string | null;
                  linkArtikel: string;
                  tanggalPublisher?: string | null;
                }) => ({
                  id: await generateArtikelId(tx),
                  author: a.author,
                  judul: a.judul,
                  namaArtikel: a.namaArtikel,
                  publisher: a.publisher,
                  kategori: a.kategori,
                  level: a.level ?? null,
                  linkArtikel: a.linkArtikel,
                  tanggalPublisher: a.tanggalPublisher ?? null,
                  pkmId: id,
                  createdById: pkm.createdById,
                })
              )
            );
            await tx.artikel.createMany({ data: artikelData });
          }
        }

        // Handle HKI update (array)
        if (body.hki !== undefined) {
          await tx.hKI.deleteMany({ where: { pkmId: id } });

          if (Array.isArray(body.hki) && body.hki.length > 0) {
            const hkiData = await Promise.all(
              body.hki.map(
                async (h: {
                  author: string;
                  nomorPenciptaan: string;
                  tanggalPermohonan: string;
                  jenisCiptaan: string;
                  judulCiptaan: string;
                  linkSertifikat: string;
                }) => ({
                  id: await generateHkiId(tx),
                  author: h.author,
                  nomorPenciptaan: h.nomorPenciptaan,
                  tanggalPermohonan: new Date(h.tanggalPermohonan),
                  jenisCiptaan: h.jenisCiptaan,
                  judulCiptaan: h.judulCiptaan,
                  linkSertifikat: h.linkSertifikat,
                  pkmId: id,
                  createdById: pkm.createdById,
                })
              )
            );
            await tx.hKI.createMany({ data: hkiData });
          }
        }

        // Handle buku update (array)
        if (body.buku !== undefined) {
          await tx.buku.deleteMany({ where: { pkmId: id } });

          if (Array.isArray(body.buku) && body.buku.length > 0) {
            const bukuData = await Promise.all(
              body.buku.map(
                async (b: {
                  author: string;
                  judulBuku: string;
                  penerbit: string;
                  isbn: string;
                  tahun: number;
                  jenisBuku: string;
                  linkBuku: string;
                }) => ({
                  id: await generateBukuId(tx),
                  author: b.author,
                  judulBuku: b.judulBuku,
                  penerbit: b.penerbit,
                  isbn: b.isbn,
                  tahun: b.tahun,
                  jenisBuku: b.jenisBuku,
                  linkBuku: b.linkBuku,
                  pkmId: id,
                  createdById: pkm.createdById,
                })
              )
            );
            await tx.buku.createMany({ data: bukuData });
          }
        }

        // Ambil data terbaru dengan relasi
        return await tx.pKM.findUnique({
          where: { id },
          include: {
            artikel: true,
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
        await tx.artikel.deleteMany({
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
