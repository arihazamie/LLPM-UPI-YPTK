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

    // Ambil data PKM dari database (hanya milik user yang login)
    const pkmData = await prisma.pKM.findMany({
      where: {
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            nohp: true,
          },
        },
        jurnal: true,
        hki: true,
        buku: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data untuk Excel (hanya tampilkan yang ada)
    const excelData = pkmData.map((pkm, index) => ({
      No: index + 1,
      "Nama Dosen": pkm.createdBy?.name || "-",
      Email: pkm.createdBy?.email || "-",
      "No HP": pkm.createdBy?.nohp || "-",
      Judul: pkm.judul || "-",
      Proposal: pkm.proposal || "-",
      Laporan: pkm.laporan || "-",
      ...(pkm.jurnal && {
        "Judul Jurnal": pkm.jurnal.judul || "-",
        "Nama Jurnal": pkm.jurnal.namaJurnal || "-",
        "Link Jurnal": pkm.jurnal.linkJurnal || "-",
      }),
      ...(pkm.hki && {
        "Judul HKI": pkm.hki.judulCiptaan || "-",
        "Nomor Penciptaan": pkm.hki.nomorPenciptaan || "-",
        "Link Sertifikat": pkm.hki.linkSertifikat || "-",
      }),
      ...(pkm.buku && {
        "Judul Buku": pkm.buku.judulBuku || "-",
        Penerbit: pkm.buku.penerbit || "-",
        ISBN: pkm.buku.isbn || "-",
        "Link Buku": pkm.buku.linkBuku || "-",
      }),
      "Tanggal Dibuat": pkm.createdAt
        ? pkm.createdAt.toLocaleDateString("id-ID")
        : "-",
      "Tanggal Diperbarui": pkm.updatedAt
        ? pkm.updatedAt.toLocaleDateString("id-ID")
        : "-",
    }));

    // Buat workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Data PKM Utama
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set lebar kolom untuk sheet utama
    const columnWidths = [
      { wch: 5 }, // No
      { wch: 25 }, // Nama Dosen
      { wch: 30 }, // Email
      { wch: 15 }, // No HP
      { wch: 40 }, // Judul
      { wch: 40 }, // Proposal
      { wch: 40 }, // Laporan
      { wch: 40 }, // Judul Jurnal (opsional)
      { wch: 30 }, // Nama Jurnal (opsional)
      { wch: 40 }, // Link Jurnal (opsional)
      { wch: 40 }, // Judul HKI (opsional)
      { wch: 20 }, // Nomor Penciptaan (opsional)
      { wch: 40 }, // Link Sertifikat (opsional)
      { wch: 40 }, // Judul Buku (opsional)
      { wch: 25 }, // Penerbit (opsional)
      { wch: 20 }, // ISBN (opsional)
      { wch: 40 }, // Link Buku (opsional)
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Diperbarui
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data PKM");

    // Sheet 2: Detail Jurnal (hanya jika ada data)
    const jurnalData = pkmData
      .filter((pkm) => pkm.jurnal)
      .map((pkm, index) => ({
        No: index + 1,
        "ID PKM": pkm.id,
        "Judul PKM": pkm.judul,
        "Judul Jurnal": pkm.jurnal!.judul,
        Author: Array.isArray(pkm.jurnal!.author)
          ? pkm.jurnal!.author.join(", ")
          : pkm.jurnal!.author,
        "Nama Jurnal": pkm.jurnal!.namaJurnal,
        Publisher: pkm.jurnal!.publisher,
        Kategori: pkm.jurnal!.kategori,
        Level: pkm.jurnal!.level || "-",
        "Link Jurnal": pkm.jurnal!.linkJurnal,
        "Tanggal Dibuat": pkm.jurnal!.createdAt.toLocaleDateString("id-ID"),
      }));

    if (jurnalData.length > 0) {
      const jurnalWorksheet = XLSX.utils.json_to_sheet(jurnalData);
      jurnalWorksheet["!cols"] = [
        { wch: 5 }, // No
        { wch: 15 }, // ID PKM
        { wch: 40 }, // Judul PKM
        { wch: 40 }, // Judul Jurnal
        { wch: 30 }, // Author
        { wch: 30 }, // Nama Jurnal
        { wch: 25 }, // Publisher
        { wch: 15 }, // Kategori
        { wch: 10 }, // Level
        { wch: 40 }, // Link Jurnal
        { wch: 15 }, // Tanggal Dibuat
      ];
      XLSX.utils.book_append_sheet(workbook, jurnalWorksheet, "Detail Jurnal");
    }

    // Sheet 3: Detail HKI (hanya jika ada data)
    const hkiData = pkmData
      .filter((pkm) => pkm.hki)
      .map((pkm, index) => ({
        No: index + 1,
        "ID PKM": pkm.id,
        "Judul PKM": pkm.judul,
        "Judul Ciptaan": pkm.hki!.judulCiptaan,
        Author: Array.isArray(pkm.hki!.author)
          ? pkm.hki!.author.join(", ")
          : pkm.hki!.author,
        "Nomor Penciptaan": pkm.hki!.nomorPenciptaan,
        "Tanggal Permohonan":
          pkm.hki!.tanggalPermohonan.toLocaleDateString("id-ID"),
        "Jenis Ciptaan": pkm.hki!.jenisCiptaan,
        "Link Sertifikat": pkm.hki!.linkSertifikat,
        "Tanggal Dibuat": pkm.hki!.createdAt.toLocaleDateString("id-ID"),
      }));

    if (hkiData.length > 0) {
      const hkiWorksheet = XLSX.utils.json_to_sheet(hkiData);
      hkiWorksheet["!cols"] = [
        { wch: 5 }, // No
        { wch: 15 }, // ID PKM
        { wch: 40 }, // Judul PKM
        { wch: 40 }, // Judul Ciptaan
        { wch: 30 }, // Author
        { wch: 20 }, // Nomor Penciptaan
        { wch: 15 }, // Tanggal Permohonan
        { wch: 25 }, // Jenis Ciptaan
        { wch: 40 }, // Link Sertifikat
        { wch: 15 }, // Tanggal Dibuat
      ];
      XLSX.utils.book_append_sheet(workbook, hkiWorksheet, "Detail HKI");
    }

    // Sheet 4: Detail Buku (hanya jika ada data)
    const bukuData = pkmData
      .filter((pkm) => pkm.buku)
      .map((pkm, index) => ({
        No: index + 1,
        "ID PKM": pkm.id,
        "Judul PKM": pkm.judul,
        "Judul Buku": pkm.buku!.judulBuku,
        Author: Array.isArray(pkm.buku!.author)
          ? pkm.buku!.author.join(", ")
          : pkm.buku!.author,
        Penerbit: pkm.buku!.penerbit,
        ISBN: pkm.buku!.isbn,
        Tahun: pkm.buku!.tahun,
        "Jenis Buku": pkm.buku!.jenisBuku,
        "Link Buku": pkm.buku!.linkBuku,
        "Tanggal Dibuat": pkm.buku!.createdAt.toLocaleDateString("id-ID"),
      }));

    if (bukuData.length > 0) {
      const bukuWorksheet = XLSX.utils.json_to_sheet(bukuData);
      bukuWorksheet["!cols"] = [
        { wch: 5 }, // No
        { wch: 15 }, // ID PKM
        { wch: 40 }, // Judul PKM
        { wch: 40 }, // Judul Buku
        { wch: 30 }, // Author
        { wch: 25 }, // Penerbit
        { wch: 20 }, // ISBN
        { wch: 8 }, // Tahun
        { wch: 15 }, // Jenis Buku
        { wch: 40 }, // Link Buku
        { wch: 15 }, // Tanggal Dibuat
      ];
      XLSX.utils.book_append_sheet(workbook, bukuWorksheet, "Detail Buku");
    }

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
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Gagal mengekspor data PKM",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
