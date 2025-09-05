import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { StatusPenelitian } from "@prisma/client";

// Validation schema
const ReviewSchema = z.object({
  status: z.nativeEnum(StatusPenelitian),
  reviewNotes: z.string().min(1, "Catatan review wajib diisi"),
  approvalNotes: z.string().optional(),
});

// PUT - Admin review penelitian
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    console.log("Review API - Received data:", { id, body });

    // Validate request body
    const validation = ReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validasi gagal",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { status, reviewNotes, approvalNotes } = validation.data;

    // Check if penelitian exists
    const existingPenelitian = await prisma.penelitian.findUnique({
      where: { id },
      select: {
        id: true,
        statusPenelitian: true,
        judulPenelitian: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingPenelitian) {
      return NextResponse.json(
        { message: "Penelitian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prepare update data based on status
    let updateData: {
      statusPenelitian: StatusPenelitian;
      updatedAt: Date;
      reviewedById?: string;
      reviewedAt?: Date;
      reviewNotes?: string;
      approvedById?: string;
      approvedAt?: Date;
      approvalNotes?: string | null;
    } = {
      statusPenelitian: status,
      updatedAt: new Date(),
    };

    // Logic untuk review berdasarkan alur penelitian
    if (status === "ACC_PROPOSAL") {
      // Admin menyetujui proposal - dari REVIEW ke ACC_PROPOSAL
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
        approvedById: session.user.id,
        approvedAt: new Date(),
        approvalNotes: approvalNotes || null,
      };
    } else if (status === "ACC_LAPORAN_KEMAJUAN_60") {
      // Admin menyetujui laporan kemajuan 60% - dari REVIEW_LAPORAN_KEMAJUAN_60 ke ACC_LAPORAN_KEMAJUAN_60
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
        approvedById: session.user.id,
        approvedAt: new Date(),
        approvalNotes: approvalNotes || null,
      };
    } else if (status === "ACC_LAPORAN_KEMAJUAN_100") {
      // Admin menyetujui laporan kemajuan 100% - dari REVIEW_LAPORAN_KEMAJUAN_100 ke ACC_LAPORAN_KEMAJUAN_100
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
        approvedById: session.user.id,
        approvedAt: new Date(),
        approvalNotes: approvalNotes || null,
      };
    } else if (status === "SELESAI") {
      // Admin menyelesaikan penelitian - dari ACC_LAPORAN_KEMAJUAN_100 ke SELESAI
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
        approvedById: session.user.id,
        approvedAt: new Date(),
        approvalNotes: approvalNotes || null,
      };
    } else if (status === "DITOLAK") {
      // Admin menolak di tahap manapun
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
      };
    } else {
      // Status review lainnya - hanya review tanpa approval
      updateData = {
        ...updateData,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes,
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
            role: true,
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
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log the review action
    console.log(
      `Admin ${session.user.name} reviewed penelitian ${existingPenelitian.judulPenelitian} - Status: ${status}`
    );

    return NextResponse.json({
      message: "Review penelitian berhasil disimpan",
      data: updatedPenelitian,
    });
  } catch (error) {
    console.error("Error reviewing penelitian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
