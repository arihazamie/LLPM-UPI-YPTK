import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  RoleDosenPenelitian,
  ProgramStudiDosenPenelitian,
} from "@/types/pkm-types";

// GET - Fetch all penelitian for the logged-in dosen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const penelitian = await prisma.penelitian.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `GET /api/dosen/penelitian - Found ${penelitian.length} penelitian for user ${session.user.id}`
    );

    return NextResponse.json({
      message: "Penelitian berhasil diambil",
      data: penelitian,
    });
  } catch (error) {
    console.error("Error fetching penelitian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new penelitian
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
      statusLuaran,
    } = body;

    // Validation
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

    // Validate dosenPenelitian array
    if (
      !dosenPenelitian ||
      !Array.isArray(dosenPenelitian) ||
      dosenPenelitian.length === 0
    ) {
      return NextResponse.json(
        { message: "Minimal harus ada satu dosen penelitian" },
        { status: 400 }
      );
    }

    // Validate each dosenPenelitian entry
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

    const penelitian = await prisma.penelitian.create({
      data: {
        judulPenelitian,
        kategoriPenelitian,
        lamaKegiatan,
        tahunKegiatan: parseInt(tahunKegiatan),
        anggaran: anggaran ? parseInt(anggaran) : null,
        sumberAnggaran: sumberAnggaran || null,
        luaran: luaran || [],
        statusPenelitian: "REVIEW", // Otomatis diajukan setelah dosen submit
        linkProposal,
        linkLaporanKemajuan: linkLaporanKemajuan || null,
        statusLuaran: statusLuaran || null,
        linkLaporanAkhir: null, // Akan diisi saat status LAPORAN_AKHIR
        createdById: session.user.id,
        dosenPenelitian: {
          create: dosenPenelitian.map(
            (dosen: {
              id?: string;
              namaDosen: string;
              NIDN: string;
              roleDosenPenelitian: string;
              programStudiDosenPenelitian: string;
            }) => ({
              id:
                dosen.id || `${session.user.id}-${Date.now()}-${Math.random()}`,
              namaDosen: dosen.namaDosen,
              NIDN: dosen.NIDN,
              roleDosenPenelitian:
                dosen.roleDosenPenelitian as RoleDosenPenelitian,
              programStudiDosenPenelitian:
                dosen.programStudiDosenPenelitian as ProgramStudiDosenPenelitian,
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

    return NextResponse.json(
      {
        message: "Penelitian berhasil ditambahkan",
        data: penelitian,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating penelitian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
