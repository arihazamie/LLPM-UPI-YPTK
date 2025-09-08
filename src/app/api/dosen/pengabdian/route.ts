import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  RoleDosenPengabdian,
  ProgramStudiDosenPenelitian,
} from "@/types/pkm-types";

// GET - Fetch all pengabdian for the logged-in dosen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pengabdian = await prisma.pengabdian.findMany({
      where: {
        createdById: session.user.id,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `GET /api/dosen/pengabdian - Found ${pengabdian.length} pengabdian for user ${session.user.id}`
    );

    return NextResponse.json({
      message: "Pengabdian berhasil diambil",
      data: pengabdian,
    });
  } catch (error) {
    console.error("Error fetching pengabdian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new pengabdian
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
    } = body;

    // Validation
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

    // Validate dosenPengabdian array
    if (
      !dosenPengabdian ||
      !Array.isArray(dosenPengabdian) ||
      dosenPengabdian.length === 0
    ) {
      return NextResponse.json(
        { message: "Minimal harus ada satu dosen pengabdian" },
        { status: 400 }
      );
    }

    // Validate each dosenPengabdian entry
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

    const pengabdian = await prisma.pengabdian.create({
      data: {
        judulPengabdian,
        kategoriPengabdian,
        lamaKegiatan,
        tahunKegiatan: parseInt(tahunKegiatan),
        anggaran: anggaran ? parseInt(anggaran) : null,
        sumberAnggaran: sumberAnggaran || null,
        luaran: luaran || [],
        statusPengabdian: "REVIEW", // Otomatis diajukan setelah dosen submit
        linkProposal,
        linkLaporanKemajuan: null, // Optional untuk laporan kemajuan
        linkLaporanAkhir: null, // Akan diisi saat status LAPORAN_AKHIR
        createdById: session.user.id,
        dosenPengabdian: {
          create: dosenPengabdian.map(
            (dosen: {
              id?: string;
              namaDosen: string;
              NIDN: string;
              roleDosenPengabdian: string;
              programStudiDosenPengabdian: string;
            }) => ({
              id:
                dosen.id || `${session.user.id}-${Date.now()}-${Math.random()}`,
              namaDosen: dosen.namaDosen,
              NIDN: dosen.NIDN,
              roleDosenPengabdian:
                dosen.roleDosenPengabdian as RoleDosenPengabdian,
              programStudiDosenPengabdian:
                dosen.programStudiDosenPengabdian as ProgramStudiDosenPenelitian,
              dosen: {
                connect: { id: session.user.id },
              },
            })
          ),
        },
      },
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

    return NextResponse.json(
      {
        message: "Pengabdian berhasil ditambahkan",
        data: pengabdian,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pengabdian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
