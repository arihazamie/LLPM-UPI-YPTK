import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  RoleDosenPengabdian,
  ProgramStudiDosenPenelitian,
  KategoriPengabdian,
  LuaranPengabdian,
} from "@/types/pkm-types";
import { Prisma } from "@prisma/client";

// PUT - Update pengabdian
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      judulPengabdian,
      kategoriPengabdian,
      lamaKegiatan,
      tahunKegiatan,
      anggaran,
      sumberAnggaran,
      luaran,
      dosenPengabdian,
      linkProposal,
      linkLaporanKemajuan,
      linkLaporanAkhir,
    } = body;

    // Cek apakah pengabdian ada dan milik user
    const existingPengabdian = await prisma.pengabdian.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existingPengabdian) {
      return NextResponse.json(
        { message: "Pengabdian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek partial update (hanya laporan kemajuan/akhir)
    const isPartialUpdate =
      (linkLaporanKemajuan !== undefined || linkLaporanAkhir !== undefined) &&
      !judulPengabdian &&
      !kategoriPengabdian &&
      !lamaKegiatan &&
      !tahunKegiatan;

    if (isPartialUpdate) {
      const updateData: {
        linkLaporanKemajuan?: string;
        linkLaporanAkhir?: string;
        // statusPengabdian?: StatusPengabdian; // jika ada status
      } = {};

      if (linkLaporanKemajuan !== undefined) {
        updateData.linkLaporanKemajuan = linkLaporanKemajuan;
        // Logic status jika diperlukan
      }

      if (linkLaporanAkhir !== undefined) {
        updateData.linkLaporanAkhir = linkLaporanAkhir;
        // Logic status jika diperlukan
      }

      const updatedPengabdian = await prisma.pengabdian.update({
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
          dosenPengabdian: {
            include: {
              dosen: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        message: "Laporan berhasil diperbarui",
        data: updatedPengabdian,
      });
    }

    // Full update - require all mandatory fields
    if (
      !judulPengabdian ||
      !kategoriPengabdian ||
      !lamaKegiatan ||
      !tahunKegiatan ||
      !linkProposal
    ) {
      return NextResponse.json(
        {
          message:
            "Semua field wajib diisi: judulPengabdian, kategoriPengabdian, lamaKegiatan, tahunKegiatan, linkProposal",
        },
        { status: 400 }
      );
    }

    // Validasi dosenPengabdian jika ada
    if (dosenPengabdian && Array.isArray(dosenPengabdian)) {
      for (const dosen of dosenPengabdian) {
        if (
          !dosen.namaDosen ||
          !dosen.NIDN ||
          !dosen.roleDosenPengabdian ||
          !dosen.programStudiDosenPengabdian
        ) {
          return NextResponse.json(
            {
              message:
                "Semua field dosen pengabdian wajib diisi: namaDosen, NIDN, roleDosenPengabdian, programStudiDosenPengabdian",
            },
            { status: 400 }
          );
        }
      }

      // Hapus relasi dosenPengabdian lama
      await prisma.dosenPengabdian.deleteMany({
        where: {
          pengabdianId: id,
        },
      });
    }

    // Siapkan data update
    const updateData: {
      judulPengabdian: string;
      kategoriPengabdian: KategoriPengabdian;
      lamaKegiatan: string;
      tahunKegiatan: number;
      anggaran: number | null;
      sumberAnggaran: string | null;
      luaran: LuaranPengabdian[];
      linkProposal: string;
      linkLaporanKemajuan?: string;
      linkLaporanAkhir?: string;
      dosenPengabdian?: {
        create: Array<{
          id: string;
          namaDosen: string;
          NIDN: string;
          roleDosenPengabdian: RoleDosenPengabdian;
          programStudiDosenPengabdian: ProgramStudiDosenPenelitian;
          dosen: {
            connect: {
              id: string;
            };
          };
        }>;
      };
    } = {
      judulPengabdian,
      kategoriPengabdian: kategoriPengabdian as KategoriPengabdian,
      lamaKegiatan,
      tahunKegiatan: parseInt(tahunKegiatan),
      anggaran: anggaran ? parseInt(anggaran) : null,
      sumberAnggaran: sumberAnggaran || null,
      luaran: (luaran || []) as LuaranPengabdian[],
      linkProposal,
    };

    if (linkLaporanKemajuan !== undefined) {
      updateData.linkLaporanKemajuan = linkLaporanKemajuan;
    }
    if (linkLaporanAkhir !== undefined) {
      updateData.linkLaporanAkhir = linkLaporanAkhir;
    }

    // Tambahkan dosenPengabdian jika ada
    if (dosenPengabdian && Array.isArray(dosenPengabdian)) {
      updateData.dosenPengabdian = {
        create: dosenPengabdian.map(
          (dosen: {
            id?: string;
            namaDosen: string;
            NIDN: string;
            roleDosenPengabdian: string;
            programStudiDosenPengabdian: string;
          }) => ({
            id: dosen.id || `${session.user.id}-${Date.now()}-${Math.random()}`,
            namaDosen: dosen.namaDosen,
            NIDN: dosen.NIDN,
            roleDosenPengabdian:
              dosen.roleDosenPengabdian as RoleDosenPengabdian,
            programStudiDosenPengabdian:
              dosen.programStudiDosenPengabdian as ProgramStudiDosenPenelitian,
            dosen: {
              connect: {
                id: session.user.id,
              },
            },
          })
        ),
      };
    }

    const updatedPengabdian = await prisma.pengabdian.update({
      where: { id },
      data: updateData as Prisma.PengabdianUpdateInput,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dosenPengabdian: {
          include: {
            dosen: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Pengabdian berhasil diperbarui",
      data: updatedPengabdian,
    });
  } catch (error) {
    console.error("Error updating pengabdian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus pengabdian
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Cek apakah pengabdian ada dan milik user
    const existingPengabdian = await prisma.pengabdian.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existingPengabdian) {
      return NextResponse.json(
        { message: "Pengabdian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus relasi dosenPengabdian dulu
    await prisma.dosenPengabdian.deleteMany({
      where: {
        pengabdianId: id,
      },
    });

    // Hapus pengabdian
    await prisma.pengabdian.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Pengabdian berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting pengabdian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
