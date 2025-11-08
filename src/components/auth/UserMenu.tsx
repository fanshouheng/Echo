/**
 * User Menu Component
 * 显示用户登录状态和菜单
 */

"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User, LogOut, LogIn } from "lucide-react";

export function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/auth/signin")}
        className="gap-2"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">登录</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
        <User className="w-4 h-4" />
        <span>{user?.email || user?.name || "用户"}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">登出</span>
      </Button>
    </div>
  );
}



