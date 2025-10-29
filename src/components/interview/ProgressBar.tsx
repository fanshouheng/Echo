/**
 * ProgressBar Component
 * Shows interview completion progress
 */

"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>灵魂解析进度</span>
        <span className="font-medium">
          {current} / {total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-center text-xs text-muted-foreground">
        {percentage}% 完成
      </div>
    </div>
  );
}

