/**
 * useAuth Hook
 * 提供用户认证状态和操作
 */

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
}



