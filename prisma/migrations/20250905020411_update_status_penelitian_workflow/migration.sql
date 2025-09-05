/*
  Warnings:

  - The values [PROGRESS] on the enum `StatusPenelitian` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusPenelitian_new" AS ENUM ('DIAJUKAN', 'REVIEW_PROPOSAL', 'DISETUJUI', 'PROGRESS_60', 'REVIEW_60', 'ACC_60', 'PROGRESS_100', 'REVIEW_100', 'SELESAI', 'DITOLAK');
ALTER TABLE "public"."Penelitian" ALTER COLUMN "statusPenelitian" DROP DEFAULT;
ALTER TABLE "public"."Penelitian" ALTER COLUMN "statusPenelitian" TYPE "public"."StatusPenelitian_new" USING ("statusPenelitian"::text::"public"."StatusPenelitian_new");
ALTER TYPE "public"."StatusPenelitian" RENAME TO "StatusPenelitian_old";
ALTER TYPE "public"."StatusPenelitian_new" RENAME TO "StatusPenelitian";
DROP TYPE "public"."StatusPenelitian_old";
ALTER TABLE "public"."Penelitian" ALTER COLUMN "statusPenelitian" SET DEFAULT 'DIAJUKAN';
COMMIT;
