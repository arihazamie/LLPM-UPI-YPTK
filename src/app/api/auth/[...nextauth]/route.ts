import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const config = {
  runtime: "edge",
  regions: ["sin1"],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
