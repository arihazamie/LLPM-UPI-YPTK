import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import * as bcrypt from "bcryptjs";
import { prisma as prismaEdge } from "@/lib/prisma-edge";

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") {
    return "Password baru harus berupa teks.";
  }

  if (password.length < 8) {
    return "Password baru minimal 8 karakter.";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      currentPassword = "",
      newPassword,
      confirmPassword,
    } = await request.json();

    const requiresCurrentPassword = session.user.role !== "DOSEN";

    if (
      (requiresCurrentPassword && !currentPassword) ||
      !newPassword ||
      !confirmPassword
    ) {
      const message = requiresCurrentPassword
        ? "Semua kolom password wajib diisi."
        : "Password baru dan konfirmasi wajib diisi.";

      return NextResponse.json({ message }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Konfirmasi password baru tidak cocok." },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }

    const user = await prismaEdge.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    if (requiresCurrentPassword) {
      const isValidCurrentPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidCurrentPassword) {
        return NextResponse.json(
          { message: "Password saat ini tidak sesuai." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prismaEdge.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password berhasil diperbarui." });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server, coba lagi nanti." },
      { status: 500 }
    );
  }
}
