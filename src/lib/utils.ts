import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to generate custom IDs
export async function generateCustomId(
  prefix: string,
  prisma: unknown,
  model: string
): Promise<string> {
  // Ambil ID terakhir untuk menentukan starting number
  const client = prisma as Record<
    string,
    {
      findFirst: (args: {
        orderBy: { id: string };
        select: { id: boolean };
      }) => Promise<{ id: string } | null>;
      findUnique: (args: {
        where: { id: string };
        select?: { id: boolean };
      }) => Promise<{ id: string } | null>;
    }
  >;

  const latestRecord = await client[model].findFirst({
    orderBy: { id: "desc" },
    select: { id: true },
  });

  let nextNumber = 1;
  if (latestRecord) {
    const match = latestRecord.id.match(new RegExp(`${prefix}-(\\d+)`));
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  // Pastikan unik: cek dan increment jika bentrok (retry up to 1000)
  for (let attempts = 0; attempts < 1000; attempts++) {
    const formattedNumber = nextNumber.toString().padStart(3, "0");
    const candidate = `${prefix}-${formattedNumber}`;
    const exists = await client[model].findUnique({
      where: { id: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    nextNumber += 1;
  }

  throw new Error(
    `Failed to generate unique ID for ${model} with prefix ${prefix}`
  );
}

// Specific ID generators for each model
export async function generatePkmId(prisma: unknown): Promise<string> {
  return generateCustomId("LPPM-PKM", prisma, "pKM");
}

export async function generatePId(prisma: unknown): Promise<string> {
  return generateCustomId("LPPM-PENELITIAN", prisma, "Penelitian");
}

export async function generateHkiId(prisma: unknown): Promise<string> {
  return generateCustomId("LPPM-HKI", prisma, "hKI");
}

export async function generateBukuId(prisma: unknown): Promise<string> {
  return generateCustomId("LPPM-BUKU", prisma, "buku");
}

export async function generateArtikelId(prisma: unknown): Promise<string> {
  return generateCustomId("LPPM-JUR", prisma, "artikel");
}

// Batch ID generators to avoid duplicate IDs within the same request
export async function generateSequentialIds(
  prefix: string,
  prisma: unknown,
  model: string,
  count: number
): Promise<string[]> {
  if (count <= 0) return [];

  const client = prisma as Record<
    string,
    {
      findFirst: (args: {
        orderBy: { id: string };
        select: { id: boolean };
      }) => Promise<{ id: string } | null>;
      findUnique: (args: {
        where: { id: string };
        select?: { id: boolean };
      }) => Promise<{ id: string } | null>;
    }
  >;

  const latestRecord = await client[model].findFirst({
    orderBy: { id: "desc" },
    select: { id: true },
  });

  let nextNumber = 1;
  if (latestRecord) {
    const match = latestRecord.id.match(new RegExp(`${prefix}-(\\d+)`));
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    // ensure no collision with existing (rare) and within-batch
    // try a few times if needed
    for (let tries = 0; tries < 100; tries++) {
      const candidate = `${prefix}-${nextNumber.toString().padStart(3, "0")}`;
      nextNumber += 1;
      if (ids.includes(candidate)) continue;
      const exists = await client[model].findUnique({
        where: { id: candidate },
        select: { id: true },
      });
      if (!exists) {
        ids.push(candidate);
        break;
      }
    }
  }
  return ids;
}

export async function generateArtikelIds(
  prisma: unknown,
  count: number
): Promise<string[]> {
  return generateSequentialIds("LPPM-JUR", prisma, "artikel", count);
}

export async function generateHkiIds(
  prisma: unknown,
  count: number
): Promise<string[]> {
  return generateSequentialIds("LPPM-HKI", prisma, "hKI", count);
}

export async function generateBukuIds(
  prisma: unknown,
  count: number
): Promise<string[]> {
  return generateSequentialIds("LPPM-BUKU", prisma, "buku", count);
}
