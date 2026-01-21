// api/admin/penelitian/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma-edge";

// GET - Fetch all penelitian for admin review
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

    const penelitian = await prisma.penelitian.findMany({
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
      },
      orderBy: [
        {
          statusPenelitian: "asc", // DIAJUKAN first
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      message: "Data penelitian berhasil diambil",
      data: penelitian,
    });
  } catch (error) {
    console.error("Error fetching penelitian for admin:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus penelitian by id (query param ?id=)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID penelitian diperlukan" },
        { status: 400 }
      );
    }

    const existing = await prisma.penelitian.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Penelitian tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.penelitian.delete({ where: { id } });

    return NextResponse.json({ message: "Penelitian berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting penelitian:", error);
    return NextResponse.json(
      { message: "Gagal menghapus penelitian" },
      { status: 500 }
    );
  }
}
