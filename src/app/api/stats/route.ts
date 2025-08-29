// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KategoriJurnal } from "@prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const [
      // Semua
      publikasiAll,
      bukuAll,
      hkiAll,
      pkmAll,
      prestasiAll,

      // Tahun sekarang
      publikasiThisYear,
      bukuThisYear,
      hkiThisYear,
      pkmThisYear,
      prestasiThisYear,

      // Publikasi by kategori
      publikasiScopusAll,
      publikasiSintaAll,
      publikasiScopusThisYear,
      publikasiSintaThisYear,
    ] = await Promise.all([
      prisma.publikasi.count(),
      prisma.buku.count(),
      prisma.hKI.count(),
      prisma.pKM.count(),
      prisma.prestasi.count(),

      prisma.publikasi.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      }),
      prisma.buku.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      }),
      prisma.hKI.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      }),
      prisma.pKM.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      }),
      prisma.prestasi.count({
        where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      }),

      prisma.publikasi.count({
        where: { kategori: KategoriJurnal.SCOPUS },
      }),
      prisma.publikasi.count({
        where: { kategori: KategoriJurnal.SINTA },
      }),
      prisma.publikasi.count({
        where: {
          kategori: KategoriJurnal.SCOPUS,
          createdAt: { gte: startOfYear, lte: endOfYear },
        },
      }),
      prisma.publikasi.count({
        where: {
          kategori: KategoriJurnal.SINTA,
          createdAt: { gte: startOfYear, lte: endOfYear },
        },
      }),
    ]);

    const totals = {
      publikasi: {
        all: publikasiAll,
        thisYear: publikasiThisYear,
        byKategori: {
          scopus: {
            all: publikasiScopusAll,
            thisYear: publikasiScopusThisYear,
          },
          sinta: {
            all: publikasiSintaAll,
            thisYear: publikasiSintaThisYear,
          },
        },
      },
      buku: {
        all: bukuAll,
        thisYear: bukuThisYear,
      },
      hki: {
        all: hkiAll,
        thisYear: hkiThisYear,
      },
      pkm: {
        all: pkmAll,
        thisYear: pkmThisYear,
      },
      prestasi: {
        all: prestasiAll,
        thisYear: prestasiThisYear,
      },
      all: {
        totalAll: publikasiAll + bukuAll + hkiAll + pkmAll + prestasiAll,
        totalThisYear:
          publikasiThisYear +
          bukuThisYear +
          hkiThisYear +
          pkmThisYear +
          prestasiThisYear,
      },
    };

    return NextResponse.json(
      {
        totals,
        revalidate: 0,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil statistik." },
      { status: 500 }
    );
  }
}
