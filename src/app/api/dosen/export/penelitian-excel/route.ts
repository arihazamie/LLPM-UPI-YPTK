import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

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

    // Transform data for Excel
    const excelData = penelitian.map((item, index) => ({
      No: index + 1,
      "Judul Penelitian": item.judulPenelitian,
      "Kategori Penelitian": item.kategoriPenelitian,
      "Ketua Peneliti":
        item.dosenPenelitian.find((d) => d.roleDosenPenelitian === "KETUA")
          ?.dosen.name || "N/A",
      "Anggota Peneliti": item.dosenPenelitian
        .filter((d) => d.roleDosenPenelitian === "ANGGOTA")
        .map((d) => d.dosen.name)
        .join(", "),
      "Lama Kegiatan": item.lamaKegiatan,
      "Tahun Kegiatan": item.tahunKegiatan,
      Anggaran: item.anggaran
        ? `Rp ${item.anggaran.toLocaleString("id-ID")}`
        : "-",
      "Sumber Anggaran": item.sumberAnggaran || "-",
      Luaran: item.luaran.join(", "),
      "Status Penelitian": item.statusPenelitian,
      "Link Proposal": item.linkProposal,
      "Link Laporan Kemajuan": item.linkLaporanKemajuan || "-",
      "Link Laporan Akhir": item.linkLaporanAkhir || "-",
      "Dibuat Oleh": item.createdBy.name,
      "Tanggal Dibuat": new Date(item.createdAt).toLocaleDateString("id-ID"),
      "Terakhir Diupdate": new Date(item.updatedAt).toLocaleDateString("id-ID"),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 }, // No
      { wch: 50 }, // Judul Penelitian
      { wch: 20 }, // Skema Penelitian
      { wch: 25 }, // Ketua Peneliti
      { wch: 30 }, // Anggota Peneliti
      { wch: 25 }, // Periode Penelitian
      { wch: 15 }, // Tahun Penelitian
      { wch: 20 }, // Status Penelitian
      { wch: 40 }, // Link Proposal
      { wch: 40 }, // Link Laporan
      { wch: 25 }, // Dibuat Oleh
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Terakhir Diupdate
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penelitian");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Set response headers
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="penelitian-upi-yptk-${
        new Date().toISOString().split("T")[0]
      }.xlsx"`
    );

    return new NextResponse(excelBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting penelitian to Excel:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
