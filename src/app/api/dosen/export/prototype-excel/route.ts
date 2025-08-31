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

    // Ambil data prototype dari database
    const prototypeData = await prisma.prototype.findMany({
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
    const excelData = prototypeData.map((prototype) => ({
      "Nama Dosen": prototype.createdBy.name,
      Email: prototype.createdBy.email,
      "No HP": prototype.createdBy.nohp,
      "Nama Prototype": prototype.namaPrototype,
      "Fungsi Prototype": prototype.fungsiPrototype,
      "Pengguna Utama": prototype.penggunaUtama,
      "Jenis Prototype": prototype.jenisPrototype.join(", "),
      Link: prototype.link,
      "Tanggal Dibuat": prototype.createdAt.toLocaleDateString("id-ID"),
      "Tanggal Diperbarui": prototype.updatedAt.toLocaleDateString("id-ID"),
    }));

    // Buat workbook dan worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set lebar kolom
    const columnWidths = [
      { wch: 25 }, // Nama Dosen
      { wch: 30 }, // Email
      { wch: 15 }, // No HP
      { wch: 35 }, // Nama Prototype
      { wch: 30 }, // Fungsi Prototype
      { wch: 20 }, // Pengguna Utama
      { wch: 25 }, // Jenis Prototype
      { wch: 40 }, // Link
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Diperbarui
    ];
    worksheet["!cols"] = columnWidths;

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Prototype");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    const filename = `Prototype_Dosen_${
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
    console.error("Error exporting prototype data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
