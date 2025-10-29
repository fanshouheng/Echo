/**
 * Share Page (Placeholder)
 * Will implement in Phase 7
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SharePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-3xl font-bold text-foreground">分享功能</h2>
        <p className="text-muted-foreground">Phase 7 将实现分享卡片生成和导出功能</p>
        <Button onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回档案
        </Button>
      </div>
    </div>
  );
}

