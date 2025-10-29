/**
 * NavigationButtons Component
 * Back and Next navigation for interview
 */

"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  nextDisabled?: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastQuestion,
  nextDisabled = false,
}: NavigationButtonsProps) {
  // Ensure boolean values for disabled prop
  const backDisabled = Boolean(!canGoBack);
  const forwardDisabled = Boolean(!canGoNext || nextDisabled);

  return (
    <div className="w-full max-w-2xl mx-auto flex justify-between items-center gap-4">
      {/* Back Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={backDisabled}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        上一题
      </Button>

      {/* Next/Complete Button */}
      <Button
        size="lg"
        onClick={onNext}
        disabled={forwardDisabled}
        className="flex items-center gap-2"
      >
        {isLastQuestion ? "完成访谈" : "下一题"}
        {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
      </Button>
    </div>
  );
}

