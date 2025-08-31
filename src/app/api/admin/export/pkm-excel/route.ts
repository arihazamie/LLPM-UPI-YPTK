import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { withRoleAuth } from "@/lib/auth-helpers";

export const GET = withRoleAuth(["ADMIN", "PIMPINAN"], async () => {
  try {

    // Fetch ALL PKM data with all related data (admin can see all PKMs)
    const pkms = await prisma.pKM.findMany({
      include: { 
        publikasi: true, 
        hki: true, 
        buku: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Prepare data for Excel sheets
    const pkmData = pkms.map((pkm, index) => ({
      "No": index + 1,
      "ID PKM": pkm.id,
      "Proposal": pkm.proposal,
      "Laporan": pkm.laporan,
      "Dibuat Oleh": pkm.createdBy.name,
      "Email": pkm.createdBy.email,
      "Tanggal Dibuat": new Date(pkm.createdAt).toLocaleDateString("id-ID"),
      "Tanggal Diupdate": new Date(pkm.updatedAt).toLocaleDateString("id-ID"),
      "Memiliki Publikasi": pkm.publikasi ? "Ya" : "Tidak",
      "Memiliki HKI": pkm.hki ? "Ya" : "Tidak",
      "Memiliki Buku": pkm.buku ? "Ya" : "Tidak",
    }));

    // Prepare publikasi data
    const publikasiData = pkms
      .filter(pkm => pkm.publikasi)
      .map((pkm, pkmIndex) => {
        const pub = pkm.publikasi!;
        return {
          "No": pkmIndex + 1,
          "ID PKM": pkm.id,
          "ID Publikasi": pub.id,
          "Judul": pub.judul,
          "Author": Array.isArray(pub.author) ? pub.author.join(", ") : pub.author,
          "Nama Jurnal": pub.namaJurnal,
          "Publisher": pub.publisher,
          "Kategori": pub.kategori,
          "Level": pub.level || "-",
          "Dibuat Oleh": pkm.createdBy.name,
          "Tanggal Dibuat": new Date(pub.createdAt).toLocaleDateString("id-ID"),
        };
      });

    // Prepare HKI data
    const hkiData = pkms
      .filter(pkm => pkm.hki)
      .map((pkm, pkmIndex) => {
        const hki = pkm.hki!;
        return {
          "No": pkmIndex + 1,
          "ID PKM": pkm.id,
          "ID HKI": hki.id,
          "Author": Array.isArray(hki.author) ? hki.author.join(", ") : hki.author,
          "Nomor Penciptaan": hki.nomorPenciptaan,
          "Tanggal Permohonan": new Date(hki.tanggalPermohonan).toLocaleDateString("id-ID"),
          "Jenis Ciptaan": hki.jenisCiptaan,
          "Judul Ciptaan": hki.judulCiptaan,
          "Link Sertifikat": hki.linkSertifikat,
          "Dibuat Oleh": pkm.createdBy.name,
          "Tanggal Dibuat": new Date(hki.createdAt).toLocaleDateString("id-ID"),
        };
      });

    // Prepare buku data
    const bukuData = pkms
      .filter(pkm => pkm.buku)
      .map((pkm, pkmIndex) => {
        const buku = pkm.buku!;
        return {
          "No": pkmIndex + 1,
          "ID PKM": pkm.id,
          "ID Buku": buku.id,
          "Author": Array.isArray(buku.author) ? buku.author.join(", ") : buku.author,
          "Judul Buku": buku.judulBuku,
          "Penerbit": buku.penerbit,
          "ISBN": buku.isbn,
          "Tahun": buku.tahun,
          "Jenis Buku": buku.jenisBuku,
          "Link Buku": buku.linkBuku,
          "Dibuat Oleh": pkm.createdBy.name,
          "Tanggal Dibuat": new Date(buku.createdAt).toLocaleDateString("id-ID"),
        };
      });

    // Create workbook and worksheets
    const workbook = XLSX.utils.book_new();

    // Add PKM sheet
    const pkmWorksheet = XLSX.utils.json_to_sheet(pkmData);
    XLSX.utils.book_append_sheet(workbook, pkmWorksheet, "Data PKM");

    // Add Publikasi sheet
    if (publikasiData.length > 0) {
      const publikasiWorksheet = XLSX.utils.json_to_sheet(publikasiData);
      XLSX.utils.book_append_sheet(workbook, publikasiWorksheet, "Data Publikasi");
    }

    // Add HKI sheet
    if (hkiData.length > 0) {
      const hkiWorksheet = XLSX.utils.json_to_sheet(hkiData);
      XLSX.utils.book_append_sheet(workbook, hkiWorksheet, "Data HKI");
    }

    // Add Buku sheet
    if (bukuData.length > 0) {
      const bukuWorksheet = XLSX.utils.json_to_sheet(bukuData);
      XLSX.utils.book_append_sheet(workbook, bukuWorksheet, "Data Buku");
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { 
      type: "buffer", 
      bookType: "xlsx" 
    });

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `PKM_Data_Admin_${timestamp}.xlsx`;

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting PKM data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengekspor data PKM" },
      { status: 500 }
    );
  }
}); 