import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // Verifikasi autentikasi
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ambil data PKM dari database
    const pkmData = await prisma.pKM.findMany({
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            nohp: true,
          },
        },
        publikasi: true,
        hki: true,
        buku: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data untuk Excel
    const excelData = pkmData.map((pkm) => ({
      "Nama Dosen": pkm.createdBy.name,
      Email: pkm.createdBy.email,
      "No HP": pkm.createdBy.nohp,
      Proposal: pkm.proposal,
      Laporan: pkm.laporan,
      Publikasi: pkm.publikasi ? "Ada" : "Tidak ada",
      HKI: pkm.hki ? "Ada" : "Tidak ada",
      Buku: pkm.buku ? "Ada" : "Tidak ada",
      "Tanggal Dibuat": pkm.createdAt.toLocaleDateString("id-ID"),
      "Tanggal Diperbarui": pkm.updatedAt.toLocaleDateString("id-ID"),
    }));

    // Buat workbook dan worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set lebar kolom
    const columnWidths = [
      { wch: 25 }, // Nama Dosen
      { wch: 30 }, // Email
      { wch: 15 }, // No HP
      { wch: 40 }, // Proposal
      { wch: 40 }, // Laporan
      { wch: 15 }, // Publikasi
      { wch: 15 }, // HKI
      { wch: 15 }, // Buku
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Diperbarui
    ];
    worksheet["!cols"] = columnWidths;

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data PKM");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    const filename = `PKM_Dosen_${new Date().toISOString().split("T")[0]}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting PKM data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
