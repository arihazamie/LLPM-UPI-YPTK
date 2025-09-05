/*
  Warnings:

  - You are about to drop the column `anggotaPeneliti` on the `Penelitian` table. All the data in the column will be lost.
  - You are about to drop the column `ketuaPeneliti` on the `Penelitian` table. All the data in the column will be lost.
  - You are about to drop the column `linkLaporan` on the `Penelitian` table. All the data in the column will be lost.
  - You are about to drop the column `periodePenelitian` on the `Penelitian` table. All the data in the column will be lost.
  - You are about to drop the column `skemaPenelitian` on the `Penelitian` table. All the data in the column will be lost.
  - You are about to drop the column `tahunPenelitian` on the `Penelitian` table. All the data in the column will be lost.
  - The `statusPenelitian` column on the `Penelitian` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `kategoriPenelitian` to the `Penelitian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lamaKegiatan` to the `Penelitian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahunKegiatan` to the `Penelitian` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StatusPenelitian" AS ENUM ('DIAJUKAN', 'PROGRESS', 'SELESAI');

-- CreateEnum
CREATE TYPE "public"."LuaranPenelitian" AS ENUM ('SEMINAR_INTERNASIONAL_SCOPUS_ATLANTIS_WOS', 'ARTIKEL_JURNAL_NASIONAL_SINTA_5', 'ARTIKEL_JURNAL_NASIONAL_SINTA_4', 'ARTIKEL_JURNAL_NASIONAL_SINTA_3', 'ARTIKEL_JURNAL_NASIONAL_SINTA_2', 'PUBLIKASI_JURNAL_INTERNATIONAL_BEREPUTASI_SCOPUS_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q4_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q3_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q2_WOS', 'PUBLIKASI_JURNAL_INTERNATIONAL_SCOPUS_Q1_WOS', 'HKI_PATEN', 'BUKU_ISBN', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "public"."KategoriPenelitian" AS ENUM ('PENELITIAN_DOSEN_PEMULA', 'PENELITIAN_TERAPAN', 'PENELITIAN_PENGEMBANGAN', 'PENELITIAN_UNGGULAN_PERGURUAN_TINGGI', 'PENELITIAN_GURU_BESAR_PERCEPATAN_PROFESOR', 'PENELITIAN_BEKERJASAMA_MITRA_NASIONAL', 'PENELITIAN_BEKERJASAMA_MITRA_INTERNASIONAL');

-- CreateEnum
CREATE TYPE "public"."RoleDosenPenelitian" AS ENUM ('KETUA', 'ANGGOTA');

-- CreateEnum
CREATE TYPE "public"."ProgramStudiDosenPenelitian" AS ENUM ('D3_MANAJEMEN_INFORMATIKA', 'S1_SISTEM_INFORMASI', 'S1_SISTEM_KOMPUTER', 'S1_TEKNIK_INFORMATIKA', 'S1_MANAJEMEN', 'S1_AKUNTANSI', 'S1_TEKNIK_SIPIL', 'S1_TEKNIK_INDUSTRI', 'S1_PSIKOLOGI', 'S1_DESAIN_KOMUNIKASI_VISUAL', 'S1_PTIK', 'S1_BIMBINGAN_KONSELING', 'S1_BAHASA_INGGRIS', 'S2_TEKNIK_INFORMATIKA', 'S2_MANAJEMEN', 'S3_TEKNOLOGI_INFORMASI');

-- AlterTable
ALTER TABLE "public"."Penelitian" DROP COLUMN "anggotaPeneliti",
DROP COLUMN "ketuaPeneliti",
DROP COLUMN "linkLaporan",
DROP COLUMN "periodePenelitian",
DROP COLUMN "skemaPenelitian",
DROP COLUMN "tahunPenelitian",
ADD COLUMN     "anggaran" INTEGER,
ADD COLUMN     "kategoriPenelitian" "public"."KategoriPenelitian" NOT NULL,
ADD COLUMN     "lamaKegiatan" TEXT NOT NULL,
ADD COLUMN     "linkLaporanAkhir" TEXT,
ADD COLUMN     "linkLaporanKemajuan" TEXT,
ADD COLUMN     "luaran" "public"."LuaranPenelitian"[],
ADD COLUMN     "luaranTambahan" TEXT,
ADD COLUMN     "sumberAnggaran" TEXT,
ADD COLUMN     "tahunKegiatan" INTEGER NOT NULL,
DROP COLUMN "statusPenelitian",
ADD COLUMN     "statusPenelitian" "public"."StatusPenelitian" NOT NULL DEFAULT 'DIAJUKAN';

-- CreateTable
CREATE TABLE "public"."dosenPenelitian" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "namaDosen" TEXT NOT NULL,
    "NIDN" TEXT NOT NULL,
    "roleDosenPenelitian" "public"."RoleDosenPenelitian" NOT NULL,
    "programStudiDosenPenelitian" "public"."ProgramStudiDosenPenelitian" NOT NULL,
    "penelitianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosenPenelitian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."dosenPenelitian" ADD CONSTRAINT "dosenPenelitian_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dosenPenelitian" ADD CONSTRAINT "dosenPenelitian_penelitianId_fkey" FOREIGN KEY ("penelitianId") REFERENCES "public"."Penelitian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
