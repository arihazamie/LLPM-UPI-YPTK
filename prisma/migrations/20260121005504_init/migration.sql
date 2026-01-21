-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PIMPINAN', 'ADMIN', 'DOSEN');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('AGENDA', 'ARTIKEL', 'BERITA', 'PENGUMUMAN', 'WEBINAR');

-- CreateEnum
CREATE TYPE "JenisPrototype" AS ENUM ('ALAT', 'APLIKASI', 'ALGORITMA', 'MODUL', 'PSEUDOCODE', 'METODE');

-- CreateEnum
CREATE TYPE "JenisBuku" AS ENUM ('BUKU_AJAR', 'REFERENSI');

-- CreateEnum
CREATE TYPE "KategoriArtikel" AS ENUM ('OJS', 'SINTA', 'INTERNASIONAL', 'WOS', 'SCOPUS');

-- CreateEnum
CREATE TYPE "StatusPenelitian" AS ENUM ('REVIEW', 'ACC_PROPOSAL', 'REVIEW_LAPORAN_KEMAJUAN_60', 'ACC_LAPORAN_KEMAJUAN_60', 'REVIEW_LAPORAN_KEMAJUAN_100', 'REVIEW_LAPORAN_AKHIR', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "LuaranPenelitian" AS ENUM ('SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS', 'ARTIKEL_JURNAL_NASIONAL_SINTA_5', 'ARTIKEL_JURNAL_NASIONAL_SINTA_4', 'ARTIKEL_JURNAL_NASIONAL_SINTA_3', 'ARTIKEL_JURNAL_NASIONAL_SINTA_2', 'PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS', 'HKI_PATEN', 'BUKU_ISBN', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "KategoriPenelitian" AS ENUM ('PENELITIAN_DOSEN_PEMULA', 'PENELITIAN_TERAPAN', 'PENELITIAN_PENGEMBANGAN', 'PENELITIAN_UNGGULAN_PERGURUAN_TINGGI', 'PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR', 'PENELITIAN_BEKERJASAMA_MITRA_NASIONAL', 'PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL');

-- CreateEnum
CREATE TYPE "RoleDosenPenelitian" AS ENUM ('KETUA', 'ANGGOTA');

-- CreateEnum
CREATE TYPE "ProgramStudiDosenPenelitian" AS ENUM ('D3_MANAJEMEN_INFORMATIKA', 'S1_SISTEM_INFORMASI', 'S1_SISTEM_KOMPUTER', 'S1_TEKNIK_INFORMATIKA', 'S1_MANAJEMEN', 'S1_AKUNTANSI', 'S1_TEKNIK_SIPIL', 'S1_TEKNIK_INDUSTRI', 'S1_PSIKOLOGI', 'S1_DESAIN_KOMUNIKASI_VISUAL', 'S1_PTIK', 'S1_BIMBINGAN_KONSELING', 'S1_BAHASA_INGGRIS', 'S2_TEKNIK_INFORMATIKA', 'S2_MANAJEMEN', 'S3_TEKNOLOGI_INFORMASI');

-- CreateEnum
CREATE TYPE "StatusPengabdian" AS ENUM ('REVIEW', 'ACC_PROPOSAL', 'REVIEW_LAPORAN_KEMAJUAN_60', 'ACC_LAPORAN_KEMAJUAN_60', 'REVIEW_LAPORAN_KEMAJUAN_100', 'REVIEW_LAPORAN_AKHIR', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "LuaranPengabdian" AS ENUM ('SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS', 'ARTIKEL_JURNAL_NASIONAL_SINTA_5', 'ARTIKEL_JURNAL_NASIONAL_SINTA_4', 'ARTIKEL_JURNAL_NASIONAL_SINTA_3', 'ARTIKEL_JURNAL_NASIONAL_SINTA_2', 'PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS', 'HKI_PATEN', 'BUKU_ISBN', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "KategoriPengabdian" AS ENUM ('PENGABDIAN_MASYARAKAT', 'PENGABDIAN_DOSEN_PEMULA', 'PENGABDIAN_TERAPAN', 'PENGABDIAN_ILMU', 'PENGABDIAN_PENGEMBANGAN', 'PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI', 'PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR', 'PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL', 'PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL');

-- CreateEnum
CREATE TYPE "RoleDosenPengabdian" AS ENUM ('KETUA', 'ANGGOTA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "nohp" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prototype" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "namaPrototype" TEXT NOT NULL,
    "fungsiPrototype" TEXT NOT NULL,
    "penggunaUtama" TEXT NOT NULL,
    "jenisPrototype" TEXT[],
    "link" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prototype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buku" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judulBuku" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jenisBuku" "JenisBuku" NOT NULL,
    "linkBuku" TEXT NOT NULL,
    "pkmId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HKI" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "nomorPenciptaan" TEXT NOT NULL,
    "tanggalPermohonan" TIMESTAMP(3) NOT NULL,
    "jenisCiptaan" TEXT NOT NULL,
    "judulCiptaan" TEXT NOT NULL,
    "linkSertifikat" TEXT NOT NULL,
    "pkmId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HKI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artikel" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judul" TEXT NOT NULL,
    "namaArtikel" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "kategori" "KategoriArtikel" NOT NULL,
    "level" TEXT,
    "linkArtikel" TEXT NOT NULL,
    "tanggalPublisher" TIMESTAMP(3),
    "pkmId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PKM" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "laporan" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PKM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestasi" (
    "id" TEXT NOT NULL,
    "namaPrestasi" TEXT NOT NULL,
    "jenisPretasi" TEXT NOT NULL,
    "peringkatJuara" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "penyelenggara" TEXT NOT NULL,
    "linkSertifikat" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penelitian" (
    "id" TEXT NOT NULL,
    "judulPenelitian" TEXT NOT NULL,
    "kategoriPenelitian" "KategoriPenelitian" NOT NULL,
    "lamaKegiatan" TEXT NOT NULL,
    "tahunKegiatan" INTEGER NOT NULL,
    "anggaran" INTEGER,
    "sumberAnggaran" TEXT,
    "luaran" "LuaranPenelitian"[],
    "statusPenelitian" "StatusPenelitian" NOT NULL DEFAULT 'REVIEW',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "linkProposal" TEXT NOT NULL,
    "linkLaporanKemajuan" TEXT,
    "statusLuaran" TEXT,
    "linkLaporanAkhir" TEXT,
    "linkLuaran" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosenPenelitian" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "namaDosen" TEXT NOT NULL,
    "NIDN" TEXT NOT NULL,
    "noHp" TEXT,
    "roleDosenPenelitian" "RoleDosenPenelitian" NOT NULL,
    "programStudiDosenPenelitian" "ProgramStudiDosenPenelitian" NOT NULL,
    "penelitianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosenPenelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengabdian" (
    "id" TEXT NOT NULL,
    "judulPengabdian" TEXT NOT NULL,
    "kategoriPengabdian" "KategoriPengabdian" NOT NULL,
    "lamaKegiatan" TEXT NOT NULL,
    "tahunKegiatan" INTEGER NOT NULL,
    "anggaran" INTEGER,
    "sumberAnggaran" TEXT,
    "luaran" "LuaranPengabdian"[],
    "statusPengabdian" "StatusPengabdian" NOT NULL DEFAULT 'REVIEW',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "linkProposal" TEXT NOT NULL,
    "linkLaporanKemajuan" TEXT,
    "statusLuaran" TEXT,
    "linkLaporanAkhir" TEXT,
    "linkLuaran" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengabdian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosenPengabdian" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "namaDosen" TEXT NOT NULL,
    "NIDN" TEXT NOT NULL,
    "noHp" TEXT,
    "roleDosenPengabdian" "RoleDosenPengabdian" NOT NULL,
    "programStudiDosenPengabdian" "ProgramStudiDosenPenelitian" NOT NULL,
    "pengabdianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosenPengabdian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artikel1" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "author" TEXT[],
    "namaArtikel" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "kategori" "KategoriArtikel" NOT NULL,
    "level" TEXT NOT NULL,
    "linkArtikel" TEXT NOT NULL,
    "tanggalPublisher" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artikel1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LayananPenelitian" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "laporan" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LayananPenelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenelitianBuku" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judulBuku" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jenisBuku" "JenisBuku" NOT NULL,
    "linkBuku" TEXT NOT NULL,
    "layananPenelitianId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenelitianBuku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenelitianHKI" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "nomorPenciptaan" TEXT NOT NULL,
    "tanggalPermohonan" TIMESTAMP(3) NOT NULL,
    "jenisCiptaan" TEXT NOT NULL,
    "judulCiptaan" TEXT NOT NULL,
    "linkSertifikat" TEXT NOT NULL,
    "layananPenelitianId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenelitianHKI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenelitianArtikel" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judul" TEXT NOT NULL,
    "namaArtikel" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "kategori" "KategoriArtikel" NOT NULL,
    "level" TEXT,
    "linkArtikel" TEXT NOT NULL,
    "tanggalPublisher" TIMESTAMP(3),
    "layananPenelitianId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenelitianArtikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "pages" INTEGER,
    "size" TEXT,
    "year" INTEGER,
    "shortDesc" TEXT,
    "synopsis" TEXT,
    "price" INTEGER,
    "coverBook" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nohp_key" ON "User"("nohp");

-- CreateIndex
CREATE INDEX "Post_type_idx" ON "Post"("type");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prototype" ADD CONSTRAINT "Prototype_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "PKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buku" ADD CONSTRAINT "Buku_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HKI" ADD CONSTRAINT "HKI_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "PKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HKI" ADD CONSTRAINT "HKI_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "PKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PKM" ADD CONSTRAINT "PKM_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestasi" ADD CONSTRAINT "Prestasi_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penelitian" ADD CONSTRAINT "Penelitian_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penelitian" ADD CONSTRAINT "Penelitian_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penelitian" ADD CONSTRAINT "Penelitian_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosenPenelitian" ADD CONSTRAINT "dosenPenelitian_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosenPenelitian" ADD CONSTRAINT "dosenPenelitian_penelitianId_fkey" FOREIGN KEY ("penelitianId") REFERENCES "Penelitian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengabdian" ADD CONSTRAINT "Pengabdian_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengabdian" ADD CONSTRAINT "Pengabdian_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengabdian" ADD CONSTRAINT "Pengabdian_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosenPengabdian" ADD CONSTRAINT "dosenPengabdian_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosenPengabdian" ADD CONSTRAINT "dosenPengabdian_pengabdianId_fkey" FOREIGN KEY ("pengabdianId") REFERENCES "Pengabdian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artikel1" ADD CONSTRAINT "Artikel1_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LayananPenelitian" ADD CONSTRAINT "LayananPenelitian_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianBuku" ADD CONSTRAINT "PenelitianBuku_layananPenelitianId_fkey" FOREIGN KEY ("layananPenelitianId") REFERENCES "LayananPenelitian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianBuku" ADD CONSTRAINT "PenelitianBuku_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianHKI" ADD CONSTRAINT "PenelitianHKI_layananPenelitianId_fkey" FOREIGN KEY ("layananPenelitianId") REFERENCES "LayananPenelitian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianHKI" ADD CONSTRAINT "PenelitianHKI_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianArtikel" ADD CONSTRAINT "PenelitianArtikel_layananPenelitianId_fkey" FOREIGN KEY ("layananPenelitianId") REFERENCES "LayananPenelitian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenelitianArtikel" ADD CONSTRAINT "PenelitianArtikel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
