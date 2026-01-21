import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma as prismaEdge } from "@/lib/prisma-edge";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pengabdian = await prismaEdge.pengabdian.findMany({
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

    // Transform data for Excel
    const excelData = pengabdian.map((item, index) => ({
      No: index + 1,
      "Judul Pengabdian": item.judulPengabdian,
      "Kategori Pengabdian": item.kategoriPengabdian,
      "Ketua Pengabdian":
        item.dosenPengabdian.find((d) => d.roleDosenPengabdian === "KETUA")
          ?.dosen.name || "N/A",
      "NIDN Ketua":
        item.dosenPengabdian.find((d) => d.roleDosenPengabdian === "KETUA")
          ?.NIDN || "N/A",
      "Anggota Pengabdian": item.dosenPengabdian
        .filter((d) => d.roleDosenPengabdian === "ANGGOTA")
        .map((d) => d.dosen.name)
        .join(", "),
      "Lama Kegiatan": item.lamaKegiatan,
      "Tahun Kegiatan": item.tahunKegiatan,
      "Anggaran": item.anggaran || 0,
      "Sumber Anggaran": item.sumberAnggaran || "N/A",
      "Luaran": item.luaran.join(", "),
      "Status Pengabdian": item.statusPengabdian,
      "Link Proposal": item.linkProposal,
      "Link Laporan Kemajuan": item.linkLaporanKemajuan || "N/A",
      "Link Laporan Akhir": item.linkLaporanAkhir || "N/A",
      "Tanggal Dibuat": new Date(item.createdAt).toLocaleDateString("id-ID"),
      "Tanggal Diperbarui": new Date(item.updatedAt).toLocaleDateString("id-ID"),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 }, // No
      { wch: 50 }, // Judul Pengabdian
      { wch: 30 }, // Kategori Pengabdian
      { wch: 25 }, // Ketua Pengabdian
      { wch: 15 }, // NIDN Ketua
      { wch: 30 }, // Anggota Pengabdian
      { wch: 15 }, // Lama Kegiatan
      { wch: 15 }, // Tahun Kegiatan
      { wch: 15 }, // Anggaran
      { wch: 20 }, // Sumber Anggaran
      { wch: 40 }, // Luaran
      { wch: 25 }, // Status Pengabdian
      { wch: 30 }, // Link Proposal
      { wch: 30 }, // Link Laporan Kemajuan
      { wch: 30 }, // Link Laporan Akhir
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Diperbarui
    ];

    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pengabdian");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="pengabdian-${new Date()
          .toISOString()
          .split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting pengabdian to Excel:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
