// api/admin/pengabdian/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// GET - Fetch all pengabdian for admin review
export async function GET() {
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

    const pengabdian = await prisma.pengabdian.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
      orderBy: [
        {
          statusPengabdian: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    console.log(
      `GET /api/admin/pengabdian - Found ${pengabdian.length} pengabdian for admin review`
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
