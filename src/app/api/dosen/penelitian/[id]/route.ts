import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  LuaranPenelitian,
  RoleDosenPenelitian,
  ProgramStudiDosenPenelitian,
  KategoriPenelitian,
  StatusPenelitian,
} from "@prisma/client";

// PUT - Update penelitian
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
      judulPenelitian,
      kategoriPenelitian,
      lamaKegiatan,
      tahunKegiatan,
      anggaran,
      sumberAnggaran,
      luaran,
      dosenPenelitian,
      linkProposal,
      linkLaporanKemajuan,
      linkLaporanAkhir,
    } = body;

    // Check if penelitian exists and belongs to the user
    const existingPenelitian = await prisma.penelitian.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existingPenelitian) {
      return NextResponse.json(
        { message: "Penelitian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Basic validation
    if (
      !judulPenelitian ||
      !kategoriPenelitian ||
      !lamaKegiatan ||
      !tahunKegiatan ||
      !linkProposal
    ) {
      return NextResponse.json(
        {
          message:
            "Semua field wajib diisi: judulPenelitian, kategoriPenelitian, lamaKegiatan, tahunKegiatan, linkProposal",
        },
        { status: 400 }
      );
    }

    // Validate dosenPenelitian array if provided
    if (dosenPenelitian && Array.isArray(dosenPenelitian)) {
      for (const dosen of dosenPenelitian) {
        if (
          !dosen.namaDosen ||
          !dosen.NIDN ||
          !dosen.roleDosenPenelitian ||
          !dosen.programStudiDosenPenelitian
        ) {
          return NextResponse.json(
            {
              message:
                "Semua field dosen penelitian wajib diisi: namaDosen, NIDN, roleDosenPenelitian, programStudiDosenPenelitian",
            },
            { status: 400 }
          );
        }
      }

      // Delete existing dosenPenelitian relationships
      await prisma.dosenPenelitian.deleteMany({
        where: {
          penelitianId: id,
        },
      });
    }

    // Prepare update data
    const updateData: {
      judulPenelitian: string;
      kategoriPenelitian: KategoriPenelitian;
      lamaKegiatan: string;
      tahunKegiatan: number;
      anggaran: number | null;
      sumberAnggaran: string | null;
      luaran: LuaranPenelitian[];
      linkProposal: string;
      linkLaporanKemajuan?: string;
      linkLaporanAkhir?: string;
      statusPenelitian?: StatusPenelitian;
      dosenPenelitian?: {
        create: Array<{
          id: string;
          namaDosen: string;
          NIDN: string;
          roleDosenPenelitian: RoleDosenPenelitian;
          programStudiDosenPenelitian: ProgramStudiDosenPenelitian;
          dosen: {
            connect: {
              id: string;
            };
          };
        }>;
      };
    } = {
      judulPenelitian,
      kategoriPenelitian: kategoriPenelitian as KategoriPenelitian,
      lamaKegiatan,
      tahunKegiatan: parseInt(tahunKegiatan),
      anggaran: anggaran ? parseInt(anggaran) : null,
      sumberAnggaran: sumberAnggaran || null,
      luaran: luaran || [],
      linkProposal,
    };

    // Status progression logic berdasarkan alur penelitian
    if (linkLaporanKemajuan !== undefined) {
      updateData.linkLaporanKemajuan = linkLaporanKemajuan;

      // Jika dosen upload laporan kemajuan dan status saat ini ACC_PROPOSAL, ubah ke REVIEW_LAPORAN_KEMAJUAN_60
      if (
        existingPenelitian.statusPenelitian === "ACC_PROPOSAL" &&
        linkLaporanKemajuan
      ) {
        updateData.statusPenelitian = "REVIEW_LAPORAN_KEMAJUAN_60";
      }
      // Jika dosen upload laporan kemajuan lagi dan status saat ini ACC_LAPORAN_KEMAJUAN_60, ubah ke REVIEW_LAPORAN_KEMAJUAN_100
      else if (
        existingPenelitian.statusPenelitian === "ACC_LAPORAN_KEMAJUAN_60" &&
        linkLaporanKemajuan
      ) {
        updateData.statusPenelitian = "REVIEW_LAPORAN_KEMAJUAN_100";
      }
    }

    if (linkLaporanAkhir !== undefined) {
      updateData.linkLaporanAkhir = linkLaporanAkhir;
      // Laporan akhir tidak mengubah status otomatis, akan diubah oleh admin saat review
    }

    // Add dosenPenelitian if provided
    if (dosenPenelitian && Array.isArray(dosenPenelitian)) {
      updateData.dosenPenelitian = {
        create: dosenPenelitian.map(
          (dosen: {
            id?: string;
            namaDosen: string;
            NIDN: string;
            roleDosenPenelitian: string;
            programStudiDosenPenelitian: string;
          }) => ({
            id: dosen.id || `${session.user.id}-${Date.now()}-${Math.random()}`,
            namaDosen: dosen.namaDosen,
            NIDN: dosen.NIDN,
            roleDosenPenelitian:
              dosen.roleDosenPenelitian as RoleDosenPenelitian,
            programStudiDosenPenelitian:
              dosen.programStudiDosenPenelitian as ProgramStudiDosenPenelitian,
            dosen: {
              connect: {
                id: session.user.id,
              },
            },
          })
        ),
      };
    }

    const updatedPenelitian = await prisma.penelitian.update({
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
        dosenPenelitian: {
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
      message: "Penelitian berhasil diperbarui",
      data: updatedPenelitian,
    });
  } catch (error) {
    console.error("Error updating penelitian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete penelitian
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

    // Check if penelitian exists and belongs to the user
    const existingPenelitian = await prisma.penelitian.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!existingPenelitian) {
      return NextResponse.json(
        { message: "Penelitian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete associated dosenPenelitian first
    await prisma.dosenPenelitian.deleteMany({
      where: {
        penelitianId: id,
      },
    });

    // Delete the penelitian
    await prisma.penelitian.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Penelitian berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting penelitian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
