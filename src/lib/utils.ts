import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to generate custom IDs
export async function generateCustomId(prefix: string, prisma: unknown, model: string): Promise<string> {
  // Get the latest record to determine the next number
  const latestRecord = await (prisma as Record<string, { findFirst: (args: { orderBy: { id: string }; select: { id: boolean } }) => Promise<{ id: string } | null> }>)[model].findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });

  let nextNumber = 1;
  
  if (latestRecord) {
    // Extract number from existing ID (e.g., "LPPM-PKM-001" -> 1)
    const match = latestRecord.id.match(new RegExp(`${prefix}-(\\d+)`));
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  // Format with leading zeros (e.g., 1 -> "001")
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  return `${prefix}-${formattedNumber}`;
}

// Specific ID generators for each model
export async function generatePkmId(prisma: unknown): Promise<string> {
  return generateCustomId('LPPM-PKM', prisma, 'pKM');
}

export async function generateHkiId(prisma: unknown): Promise<string> {
  return generateCustomId('LPPM-HKI', prisma, 'hKI');
}

export async function generateBukuId(prisma: unknown): Promise<string> {
  return generateCustomId('LPPM-BUKU', prisma, 'buku');
}

export async function generatePublikasiId(prisma: unknown): Promise<string> {
  return generateCustomId('LPPM-PUB', prisma, 'publikasi');
}
