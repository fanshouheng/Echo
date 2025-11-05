/**
 * Generate Page
 * Gender selection and personality/image generation
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInterviewStore } from "@/store/interview";
import { useGenerationStore } from "@/store/generation";
import { useGeneratePersonality } from "@/hooks/useGeneration";
import { useGenerateImages } from "@/hooks/useGeneration";
import { Button } from "@/components/ui/button";
import { User, UserCircle, Sparkles, Loader2 } from "lucide-react";
import { fadeIn, fadeInUp } from "@/lib/animations";

export default function GeneratePage() {
  const router = useRouter();
  const { completedAt, answers } = useInterviewStore();
  const { preferredGender, setPreferredGender, hasPersonality, hasImages } = useGenerationStore();
  const { generate: generatePersonality, isLoading: isGeneratingPersonality } = useGeneratePersonality();
  const { generate: generateImages, isLoading: isGeneratingImages } = useGenerateImages();
  
  const [isMounted, setIsMounted] = useState(false);
  const [generationStep, setGenerationStep] = useState<"gender" | "generating" | "completed">("gender");

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isMounted) return;

    // If interview not completed, go to interview
    if (!completedAt || answers.length < 10) {
      router.replace("/interview");
      return;
    }

    // If already has personality and images, go to profile
    if (hasPersonality() && hasImages()) {
      router.replace("/profile");
      return;
    }

    // If has personality but no images, go to profile (can generate images there)
    if (hasPersonality() && !hasImages()) {
      router.replace("/profile");
      return;
    }
  }, [isMounted, completedAt, answers.length, hasPersonality, hasImages, router]);

  // Start generation after gender selection
  const startGeneration = useCallback(async () => {
    if (!preferredGender) {
      alert("请先选择性别");
      return;
    }

    setGenerationStep("generating");

    try {
      // Generate personality first
      await generatePersonality();
      
      // Then generate images
      await generateImages(1, "9:16");
      
      setGenerationStep("completed");
      
      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error?.message || "生成失败，请重试");
      setGenerationStep("gender");
    }
  }, [preferredGender, generatePersonality, generateImages, router]);

  // Show loading if checking redirect
  if (!isMounted || !completedAt || answers.length < 10) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  // If already has personality, this shouldn't happen (redirected above)
  if (hasPersonality()) {
    return null;
  }

  // Gender selection UI
  if (generationStep === "gender" && !preferredGender) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">选择 Echo 的性别</h1>
            <p className="text-muted-foreground">
              请选择你希望生成的 Echo 的性别，这将决定生成的形象特征
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferredGender("female")}
              className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                preferredGender === "female"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <UserCircle className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="font-medium">女性</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferredGender("male")}
              className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                preferredGender === "male"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <User className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="font-medium">男性</p>
            </motion.button>
          </div>

          {preferredGender && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <Button
                size="lg"
                onClick={startGeneration}
                className="w-full gap-2"
              >
                <Sparkles className="w-4 h-4" />
                开始生成人格 & 形象
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Generating UI
  if (generationStep === "generating") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-md w-full space-y-8 text-center"
        >
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {isGeneratingPersonality ? "正在生成人格档案..." : "正在生成形象..."}
            </h2>
            <p className="text-muted-foreground">
              {isGeneratingPersonality
                ? "AI 正在分析你的回答，生成与你契合的 Echo 人格"
                : "AI 正在根据人格档案生成对应的视觉形象"}
            </p>
            <p className="text-sm text-muted-foreground">
              这可能需要几分钟，请耐心等待...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Completed (should redirect, but show this as fallback)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div variants={fadeIn} className="text-center space-y-4">
        <Sparkles className="w-16 h-16 mx-auto text-primary" />
        <p className="text-muted-foreground">生成完成！正在跳转...</p>
      </motion.div>
    </div>
  );
}
