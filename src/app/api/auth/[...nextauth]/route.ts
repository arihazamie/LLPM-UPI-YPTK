import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// gunakan Node.js runtime, bukan Edge
export const runtime = "nodejs";

// cegah pre-render API auth
export const dynamic = "force-dynamic";
