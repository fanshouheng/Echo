/**
 * NextAuth API Route Handler
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

export const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;



