/**
 * Generation Page
 * Personality and Image Generation Flow
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useInterviewStore } from "@/store/interview";
import { useGenerationStore } from "@/store/generation";
import { useCompleteGeneration, useGenerateImages } from "@/hooks/useGeneration";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { fadeIn, fadeInUp } from "@/lib/animations";

type GenerationStage = "personality" | "images" | "completed" | "error";

export default function GeneratePage() {
  const router = useRouter();
  const { answers, completedAt } = useInterviewStore();
  const { personality, images, hasPersonality, hasImages, error: storeError } = useGenerationStore();
  const { generateAll, isLoading, error } = useCompleteGeneration();
  const { generate: generateImages, isLoading: isGeneratingImages } = useGenerateImages();

  const [stage, setStage] = useState<GenerationStage>("personality");
  const [progress, setProgress] = useState(0);
  const [showPersonalityResult, setShowPersonalityResult] = useState(false);

  // Redirect if interview not completed
  useEffect(() => {
    if (!completedAt || answers.length < 10) {
      router.push("/interview");
    }
  }, [completedAt, answers, router]);

  // Start generation on mount or show personality result
  useEffect(() => {
    if (completedAt) {
      if (hasPersonality() && !hasImages()) {
        // Already has personality, show result
        setShowPersonalityResult(true);
      } else if (!hasPersonality() && !isLoading) {
        // No personality yet, start generation
        console.log("Auto-starting personality generation...");
        startGeneration();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedAt, hasPersonality, hasImages, isLoading]);


  // Simulate progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (stage === "personality" && prev < 40) {
            return prev + 1;
          } else if (stage === "images" && prev < 90) {
            return prev + 1;
          }
          return prev;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (stage === "completed") {
      setProgress(100);
    }
  }, [isLoading, stage]);

  // Start generation process (personality only)
  const startGeneration = async () => {
    try {
      console.log("🚀 Starting personality generation...");
      console.log("Answers count:", answers.length);
      console.log("Completed at:", completedAt);
      
      setStage("personality");
      setProgress(0);
      setShowPersonalityResult(false);
      
      console.log("Calling generateAll()...");
      const result = await generateAll();
      console.log("✅ generateAll() completed:", result);
      
      setShowPersonalityResult(true);
      setProgress(100);
      console.log("✅ Generation complete, showing personality result");
    } catch (err) {
      console.error("❌ Generation failed:", err);
      console.error("Error details:", {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      setStage("error");
    }
  };

  // Start image generation
  const startImageGeneration = async () => {
    try {
      setStage("images");
      setProgress(0);
      setShowPersonalityResult(false);
      await generateImages(3, "9:16");
      setStage("completed");
      setProgress(100);
    } catch (err) {
      console.error("Image generation failed:", err);
      setStage("error");
    }
  };

  // Navigate to profile
  const handleViewProfile = () => {
    router.push("/profile");
  };

  // Retry generation
  const handleRetry = () => {
    startGeneration();
  };

  // Error state
  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-6 max-w-md"
        >
          <div className="text-6xl">😔</div>
          <h2 className="text-2xl font-bold text-foreground">生成失败</h2>
          <p className="text-muted-foreground">
            {error || storeError || "遇到了一些问题，请重试"}
          </p>
          <Button size="lg" onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新生成
          </Button>
        </motion.div>
      </div>
    );
  }

  // Personality generated - show result and option to generate images
  if (showPersonalityResult && personality && !hasImages()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-8 max-w-2xl"
        >
          <motion.div variants={fadeIn}>
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {personality.name}
            </h2>
            <p className="text-xl text-muted-foreground">{personality.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {personality.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Personality Details */}
          <div className="text-left space-y-4 bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">沟通风格</h3>
              <p className="text-foreground/90 leading-relaxed">{personality.communicationStyle}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-2">价值观</h3>
              <p className="text-foreground/90 leading-relaxed">{personality.values}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">为什么是TA</h3>
              <p className="text-foreground/90 leading-relaxed">{personality.whyMatch}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">独特特质</h3>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{personality.uniqueTraits}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              onClick={startImageGeneration} 
              disabled={isGeneratingImages}
              className="gap-2"
            >
              {isGeneratingImages ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  正在生成形象...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成 TA 的形象
                </>
              )}
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/profile")}
              className="gap-2"
            >
              暂不生成，查看档案
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✨ 人格描述已生成，现在可以为 TA 创造视觉形象
          </p>
        </motion.div>
      </div>
    );
  }

  // Completed state - both personality and images generated
  if (stage === "completed" && personality && images.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-8 max-w-2xl"
        >
          <motion.div variants={fadeIn}>
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {personality.name}
            </h2>
            <p className="text-xl text-muted-foreground">{personality.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {personality.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>

          <p className="text-base text-foreground/80 leading-relaxed">
            你的 Echo 已完整生成！
          </p>

          <Button size="lg" onClick={handleViewProfile} className="gap-2">
            查看完整档案
          </Button>

          <p className="text-sm text-muted-foreground">
            🎉 人格 + {images.length} 张形象已生成
          </p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-8 max-w-md w-full"
      >
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>

        {/* Stage indicator */}
        <AnimatePresence mode="wait">
          {stage === "personality" && !showPersonalityResult && (
            <motion.div
              key="personality"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold text-foreground">正在生成人格描述...</h2>
              <p className="text-muted-foreground">DeepSeek 正在理解你的灵魂</p>
              <p className="text-xs text-muted-foreground/60 mt-4">
                请查看浏览器控制台（F12）查看详细日志
              </p>
              <p className="text-xs text-muted-foreground/60">
                Loading: {isLoading ? "是" : "否"} | Stage: {stage}
              </p>
            </motion.div>
          )}

          {stage === "images" && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold text-foreground">正在生成形象...</h2>
              <p className="text-muted-foreground">Gemini Imagen 4 将抽象化为具象</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>

        {/* Tips */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground italic">
            "每一个回答，都是一片灵魂的碎片..."
          </p>
        </div>
      </motion.div>
    </div>
  );
}

