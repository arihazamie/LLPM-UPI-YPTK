/*
  Warnings:

  - Added the required column `linkJurnal` to the `Jurnal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul` to the `PKM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Jurnal" ADD COLUMN     "linkJurnal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."PKM" ADD COLUMN     "judul" TEXT NOT NULL;
