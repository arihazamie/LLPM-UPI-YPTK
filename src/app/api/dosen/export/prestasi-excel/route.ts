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

    // Ambil data prestasi dari database
    const prestasiData = await prisma.prestasi.findMany({
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            nohp: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data untuk Excel
    const excelData = prestasiData.map((prestasi) => ({
      "Nama Dosen": prestasi.createdBy.name,
      Email: prestasi.createdBy.email,
      "No HP": prestasi.createdBy.nohp,
      "Nama Prestasi": prestasi.namaPrestasi,
      "Jenis Prestasi": prestasi.jenisPretasi,
      "Peringkat Juara": prestasi.peringkatJuara,
      Tingkat: prestasi.tingkat,
      Tanggal: prestasi.tanggal.toLocaleDateString("id-ID"),
      Penyelenggara: prestasi.penyelenggara,
      "Link Sertifikat": prestasi.linkSertifikat,
      "Tanggal Dibuat": prestasi.createdAt.toLocaleDateString("id-ID"),
      "Tanggal Diperbarui": prestasi.updatedAt.toLocaleDateString("id-ID"),
    }));

    // Buat workbook dan worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set lebar kolom
    const columnWidths = [
      { wch: 25 }, // Nama Dosen
      { wch: 30 }, // Email
      { wch: 15 }, // No HP
      { wch: 35 }, // Nama Prestasi
      { wch: 20 }, // Jenis Prestasi
      { wch: 15 }, // Peringkat Juara
      { wch: 15 }, // Tingkat
      { wch: 15 }, // Tanggal
      { wch: 25 }, // Penyelenggara
      { wch: 40 }, // Link Sertifikat
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Diperbarui
    ];
    worksheet["!cols"] = columnWidths;

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Prestasi");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    const filename = `Prestasi_Dosen_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting prestasi data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
