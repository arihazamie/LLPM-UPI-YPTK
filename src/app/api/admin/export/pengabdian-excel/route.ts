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
        reviewedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
            email: true,
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
      "Dibuat Oleh": item.createdBy.name,
      "Email Pembuat": item.createdBy.email,
      "Direview Oleh": item.reviewedBy?.name || "N/A",
      "Email Reviewer": item.reviewedBy?.email || "N/A",
      "Tanggal Review": item.reviewedAt
        ? new Date(item.reviewedAt).toLocaleDateString("id-ID")
        : "N/A",
      "Catatan Review": item.reviewNotes || "N/A",
      "Disetujui Oleh": item.approvedBy?.name || "N/A",
      "Email Approver": item.approvedBy?.email || "N/A",
      "Tanggal Approval": item.approvedAt
        ? new Date(item.approvedAt).toLocaleDateString("id-ID")
        : "N/A",
      "Catatan Approval": item.approvalNotes || "N/A",
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
      { wch: 20 }, // Dibuat Oleh
      { wch: 25 }, // Email Pembuat
      { wch: 20 }, // Direview Oleh
      { wch: 25 }, // Email Reviewer
      { wch: 15 }, // Tanggal Review
      { wch: 30 }, // Catatan Review
      { wch: 20 }, // Disetujui Oleh
      { wch: 25 }, // Email Approver
      { wch: 15 }, // Tanggal Approval
      { wch: 30 }, // Catatan Approval
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
        "Content-Disposition": `attachment; filename="pengabdian-admin-${new Date()
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
