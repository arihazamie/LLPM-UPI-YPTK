import { NextResponse } from "next/server";
import { prisma as prismaEdge } from "@/lib/prisma-edge";

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // Fetch all data without user filtering for public stats
    const [
      artikelAll,
      artikelThisYear,
      bukuAll,
      bukuThisYear,
      hkiAll,
      hkiThisYear,
      pkmAll,
      pkmThisYear,
      prestasiAll,
      prestasiThisYear,
      scopusAll,
      scopusThisYear,
      sintaAll,
      sintaThisYear,
    ] = await Promise.all([
      // Total Artikel
      prismaEdge.artikel.count(),
      prismaEdge.artikel.count({
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Total buku
      prismaEdge.buku.count(),
      prismaEdge.buku.count({
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Total HKI
      prismaEdge.hKI.count(),
      prismaEdge.hKI.count({
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Total PKM
      prismaEdge.pKM.count(),
      prismaEdge.pKM.count({
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Total prestasi
      prismaEdge.prestasi.count(),
      prismaEdge.prestasi.count({
        where: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Scopus
      prismaEdge.artikel.count({
        where: {
          kategori: "SCOPUS",
        },
      }),
      prismaEdge.artikel.count({
        where: {
          kategori: "SCOPUS",
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
      // Sinta
      prismaEdge.artikel.count({
        where: {
          kategori: "SINTA",
        },
      }),
      prismaEdge.artikel.count({
        where: {
          kategori: "SINTA",
          createdAt: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      }),
    ]);

    const totals = {
      artikel: {
        all: artikelAll,
        thisYear: artikelThisYear,
        byKategori: {
          scopus: { all: scopusAll, thisYear: scopusThisYear },
          sinta: { all: sintaAll, thisYear: sintaThisYear },
        },
      },
      buku: { all: bukuAll, thisYear: bukuThisYear },
      hki: { all: hkiAll, thisYear: hkiThisYear },
      pkm: { all: pkmAll, thisYear: pkmThisYear },
      prestasi: { all: prestasiAll, thisYear: prestasiThisYear },
      all: {
        totalAll: artikelAll + bukuAll + hkiAll + pkmAll + prestasiAll,
        totalThisYear:
          artikelThisYear +
          bukuThisYear +
          hkiThisYear +
          pkmThisYear +
          prestasiThisYear,
      },
    };

    return NextResponse.json({ totals });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch statistics",
        totals: {
          artikel: {
            all: 0,
            thisYear: 0,
            byKategori: {
              scopus: { all: 0, thisYear: 0 },
              sinta: { all: 0, thisYear: 0 },
            },
          },
          buku: { all: 0, thisYear: 0 },
          hki: { all: 0, thisYear: 0 },
          pkm: { all: 0, thisYear: 0 },
          prestasi: { all: 0, thisYear: 0 },
          all: { totalAll: 0, totalThisYear: 0 },
        },
      },
      { status: 500 }
    );
  }
}
