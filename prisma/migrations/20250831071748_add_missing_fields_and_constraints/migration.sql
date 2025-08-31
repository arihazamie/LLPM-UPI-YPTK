/*
  Warnings:

  - A unique constraint covering the columns `[pkmId]` on the table `Buku` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pkmId]` on the table `HKI` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pkmId]` on the table `Publikasi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nohp]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "nohp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Buku_pkmId_key" ON "public"."Buku"("pkmId");

-- CreateIndex
CREATE UNIQUE INDEX "HKI_pkmId_key" ON "public"."HKI"("pkmId");

-- CreateIndex
CREATE UNIQUE INDEX "Publikasi_pkmId_key" ON "public"."Publikasi"("pkmId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nohp_key" ON "public"."User"("nohp");
