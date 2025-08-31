-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PIMPINAN', 'ADMIN', 'DOSEN');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('AGENDA', 'ARTIKEL', 'BERITA', 'PENGUMUMAN', 'WEBINAR');

-- CreateEnum
CREATE TYPE "public"."KategoriJurnal" AS ENUM ('OJS', 'SINTA', 'INTERNASIONAL', 'WOS', 'SCOPUS');

-- CreateEnum
CREATE TYPE "public"."JenisPrototype" AS ENUM ('ALAT', 'APLIKASI', 'ALGORITMA', 'MODUL', 'PSEUDOCODE', 'METODE');

-- CreateEnum
CREATE TYPE "public"."JenisBuku" AS ENUM ('BUKU_AJAR', 'REFERENSI');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL,
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
CREATE TABLE "public"."Publikasi" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judul" TEXT NOT NULL,
    "namaJurnal" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "kategori" "public"."KategoriJurnal" NOT NULL,
    "level" TEXT,
    "pkmId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prototype" (
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
CREATE TABLE "public"."Buku" (
    "id" TEXT NOT NULL,
    "author" TEXT[],
    "judulBuku" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jenisBuku" "public"."JenisBuku" NOT NULL,
    "linkBuku" TEXT NOT NULL,
    "pkmId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HKI" (
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
CREATE TABLE "public"."PKM" (
    "id" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "laporan" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PKM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prestasi" (
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

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Post_type_idx" ON "public"."Post"("type");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "public"."Post"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publikasi" ADD CONSTRAINT "Publikasi_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "public"."PKM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publikasi" ADD CONSTRAINT "Publikasi_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prototype" ADD CONSTRAINT "Prototype_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Buku" ADD CONSTRAINT "Buku_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "public"."PKM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Buku" ADD CONSTRAINT "Buku_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HKI" ADD CONSTRAINT "HKI_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "public"."PKM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HKI" ADD CONSTRAINT "HKI_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PKM" ADD CONSTRAINT "PKM_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prestasi" ADD CONSTRAINT "Prestasi_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
