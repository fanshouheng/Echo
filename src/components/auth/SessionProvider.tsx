/**
 * Session Provider Wrapper
 * 为 NextAuth 提供 Session 上下文
 */

"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}



