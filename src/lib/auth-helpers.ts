import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export type UserRole = Role;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Mendapatkan session user yang sedang login
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name!,
    email: session.user.email!,
    role: session.user.role as UserRole,
  };
}

/**
 * Memverifikasi apakah user sudah login
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return user;
}

/**
 * Memverifikasi apakah user memiliki role yang diperlukan
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: ${allowedRoles.join(", ")} access required`);
  }
  
  return user;
}

/**
 * Memverifikasi apakah user adalah admin atau pimpinan
 */
export async function requireAdminOrPimpinan(): Promise<AuthenticatedUser> {
  return requireRole(["ADMIN", "PIMPINAN"]);
}

/**
 * Memverifikasi apakah user adalah admin
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole(["ADMIN"]);
}

/**
 * Memverifikasi apakah user adalah pimpinan
 */
export async function requirePimpinan(): Promise<AuthenticatedUser> {
  return requireRole(["PIMPINAN"]);
}

/**
 * Memverifikasi apakah user adalah dosen
 */
export async function requireDosen(): Promise<AuthenticatedUser> {
  return requireRole(["DOSEN", "ADMIN", "PIMPINAN"]);
}

/**
 * Wrapper untuk API handler dengan autentikasi
 */
export function withAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = await requireAuth();
      return await handler(req, user);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrapper untuk API handler dengan role-based authorization
 */
export function withRoleAuth(
  allowedRoles: UserRole[],
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = await requireRole(allowedRoles);
      return await handler(req, user);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper untuk mengecek apakah user memiliki role tertentu
 */
export function hasRole(user: AuthenticatedUser, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Helper untuk mengecek apakah user memiliki salah satu dari role yang diberikan
 */
export function hasAnyRole(user: AuthenticatedUser, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Helper untuk mengecek apakah user adalah admin atau pimpinan
 */
export function isAdminOrPimpinan(user: AuthenticatedUser): boolean {
  return hasAnyRole(user, ["ADMIN", "PIMPINAN"]);
}

/**
 * Helper untuk mengecek apakah user adalah admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return hasRole(user, "ADMIN");
}

/**
 * Helper untuk mengecek apakah user adalah pimpinan
 */
export function isPimpinan(user: AuthenticatedUser): boolean {
  return hasRole(user, "PIMPINAN");
}

/**
 * Helper untuk mengecek apakah user adalah dosen
 */
export function isDosen(user: AuthenticatedUser): boolean {
  return hasRole(user, "DOSEN");
} 