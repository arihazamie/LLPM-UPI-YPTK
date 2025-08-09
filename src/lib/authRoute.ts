import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

export type Role = "ADMIN" | "PIMPINAN" | "DOSEN";

export interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
  expires: string;
}

interface SessionOptions {
  allowedRoles?: Role[];
  redirectTo?: string;
}

export async function getSession(
  options: SessionOptions = {}
): Promise<Session> {
  const { allowedRoles, redirectTo = "/" } = options;

  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    redirect(redirectTo);
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    redirect(redirectTo);
  }

  return session;
}
