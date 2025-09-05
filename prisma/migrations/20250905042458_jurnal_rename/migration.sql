/*
  Warnings:

  - You are about to drop the `Publikasi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Publikasi" DROP CONSTRAINT "Publikasi_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Publikasi" DROP CONSTRAINT "Publikasi_pkmId_fkey";

-- DropTable
DROP TABLE "public"."Publikasi";

-- CreateTable
CREATE TABLE "public"."Jurnal" (
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

    CONSTRAINT "Jurnal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jurnal_pkmId_key" ON "public"."Jurnal"("pkmId");

-- AddForeignKey
ALTER TABLE "public"."Jurnal" ADD CONSTRAINT "Jurnal_pkmId_fkey" FOREIGN KEY ("pkmId") REFERENCES "public"."PKM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jurnal" ADD CONSTRAINT "Jurnal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
