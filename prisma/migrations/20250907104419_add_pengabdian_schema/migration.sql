-- CreateEnum
CREATE TYPE "public"."StatusPengabdian" AS ENUM ('REVIEW', 'ACC_PROPOSAL', 'REVIEW_LAPORAN_KEMAJUAN_60', 'ACC_LAPORAN_KEMAJUAN_60', 'REVIEW_LAPORAN_KEMAJUAN_100', 'ACC_LAPORAN_KEMAJUAN_100', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "public"."LuaranPengabdian" AS ENUM ('SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS', 'ARTIKEL_JURNAL_NASIONAL_SINTA_5', 'ARTIKEL_JURNAL_NASIONAL_SINTA_4', 'ARTIKEL_JURNAL_NASIONAL_SINTA_3', 'ARTIKEL_JURNAL_NASIONAL_SINTA_2', 'PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS', 'HKI_PATEN', 'BUKU_ISBN', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "public"."KategoriPengabdian" AS ENUM ('PENGABDIAN_DOSEN_PEMULA', 'PENGABDIAN_TERAPAN', 'PENGABDIAN_PENGEMBANGAN', 'PENGABDIAN_UNGGULAN_PERGURUAN_TINGGI', 'PENGABDIAN_GURU_BESAR_PERCEPATAN_PROFESOR', 'PENGABDIAN_BEKERJASAMA_MITRA_NASIONAL', 'PENGABDIAN_BEKERJASAMA_MITRA_INTERNASIONAL');

-- CreateEnum
CREATE TYPE "public"."RoleDosenPengabdian" AS ENUM ('KETUA', 'ANGGOTA');

-- CreateTable
CREATE TABLE "public"."Pengabdian" (
    "id" TEXT NOT NULL,
    "judulPengabdian" TEXT NOT NULL,
    "kategoriPengabdian" "public"."KategoriPengabdian" NOT NULL,
    "lamaKegiatan" TEXT NOT NULL,
    "tahunKegiatan" INTEGER NOT NULL,
    "anggaran" INTEGER,
    "sumberAnggaran" TEXT,
    "luaran" "public"."LuaranPengabdian"[],
    "statusPengabdian" "public"."StatusPengabdian" NOT NULL DEFAULT 'REVIEW',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "linkProposal" TEXT NOT NULL,
    "linkLaporanKemajuan" TEXT,
    "linkLaporanAkhir" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengabdian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dosenPengabdian" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "namaDosen" TEXT NOT NULL,
    "NIDN" TEXT NOT NULL,
    "roleDosenPengabdian" "public"."RoleDosenPengabdian" NOT NULL,
    "programStudiDosenPengabdian" "public"."ProgramStudiDosenPenelitian" NOT NULL,
    "pengabdianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosenPengabdian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Pengabdian" ADD CONSTRAINT "Pengabdian_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pengabdian" ADD CONSTRAINT "Pengabdian_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pengabdian" ADD CONSTRAINT "Pengabdian_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dosenPengabdian" ADD CONSTRAINT "dosenPengabdian_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dosenPengabdian" ADD CONSTRAINT "dosenPengabdian_pengabdianId_fkey" FOREIGN KEY ("pengabdianId") REFERENCES "public"."Pengabdian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
