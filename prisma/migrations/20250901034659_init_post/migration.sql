-- CreateTable
CREATE TABLE "public"."Penelitian" (
    "id" TEXT NOT NULL,
    "judulPenelitian" TEXT NOT NULL,
    "skemaPenelitian" TEXT NOT NULL,
    "ketuaPeneliti" TEXT NOT NULL,
    "anggotaPeneliti" TEXT[],
    "periodePenelitian" TEXT NOT NULL,
    "tahunPenelitian" INTEGER NOT NULL,
    "statusPenelitian" TEXT NOT NULL,
    "linkProposal" TEXT NOT NULL,
    "linkLaporan" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penelitian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Penelitian" ADD CONSTRAINT "Penelitian_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
