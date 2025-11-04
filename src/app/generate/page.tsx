/**
 * Legacy Generate Page
 * 已合并至访谈与档案流程，保留做引导跳转
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/interview";
import { useGenerationStore } from "@/store/generation";

export default function GeneratePage() {
  const router = useRouter();
  const { completedAt } = useInterviewStore();
  const { hasPersonality } = useGenerationStore();

  useEffect(() => {
    if (!completedAt) {
      router.replace("/interview");
      return;
    }

    if (hasPersonality()) {
      router.replace("/profile");
    } else {
      router.replace("/interview");
    }
  }, [completedAt, hasPersonality, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      <p>正在为你跳转到最新的 Echo 档案...</p>
    </div>
  );
}

