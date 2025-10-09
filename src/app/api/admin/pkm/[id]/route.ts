import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRoleAuth } from "@/lib/auth-helpers";

// --- GET SINGLE PKM BY ID ---
export const GET = withRoleAuth(["ADMIN", "PIMPINAN"], async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID PKM diperlukan",
        },
        { status: 400 }
      );
    }

    const pkm = await prisma.pKM.findUnique({
      where: { id },
      include: {
        artikel: true,
        hki: true,
        buku: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!pkm) {
      return NextResponse.json(
        {
          success: false,
          message: "PKM tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data PKM berhasil diambil",
      data: pkm,
    });
  } catch (error) {
    console.error("Error fetching PKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data PKM",
      },
      { status: 500 }
    );
  }
});
