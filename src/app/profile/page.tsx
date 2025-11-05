/**
 * Profile Page
 * Display complete Echo personality profile
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGenerationStore } from "@/store/generation";
import { useInterviewStore } from "@/store/interview";
import { PersonalityCard } from "@/components/profile/PersonalityCard";
import { ImageGallery } from "@/components/profile/ImageGallery";
import { TraitDetails } from "@/components/profile/TraitDetails";
import { LifeScenesCard } from "@/components/profile/LifeScenesCard";
import { ShareDialog } from "@/components/share/ShareDialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Wand2 } from "lucide-react";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";
import { useGenerateImages, useGeneratePersonality } from "@/hooks/useGeneration";

export default function ProfilePage() {
  const router = useRouter();
  const {
    personality,
    partner,
    images,
    hasPersonality,
    hasImages,
    getSelectedImage,
  } = useGenerationStore();
  const { answers, completedAt } = useInterviewStore();
  const { generate: generateImages, isLoading: isGeneratingImages } = useGenerateImages();
  const {
    generate: generatePersonality,
    isLoading: isGeneratingPersonality,
    error: personalityError,
  } = useGeneratePersonality();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const generationRequestedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasInterviewData = Boolean(completedAt) && answers.length > 0;
  const combinedGenerationError = generationError || personalityError;
  const hasAnyImages = hasImages() && images.length > 0;

  const triggerGeneration = useCallback(async () => {
    try {
      setGenerationError(null);
      generationRequestedRef.current = true;
      await generatePersonality();
    } catch (error) {
      console.error("Personality generation failed:", error);
      const fallbackMessage =
        (error instanceof Error && error.message) ||
        personalityError ||
        "生成人格失败，请稍后重试";
      setGenerationError(fallbackMessage);
      generationRequestedRef.current = false;
    }
  }, [generatePersonality, personalityError]);

  useEffect(() => {
    if (!isMounted || hasPersonality()) {
      return;
    }

    if (!hasInterviewData) {
      router.replace("/interview");
      return;
    }

    if (!generationRequestedRef.current && !isGeneratingPersonality) {
      triggerGeneration();
    }
  }, [
    isMounted,
    hasPersonality,
    hasInterviewData,
    router,
    isGeneratingPersonality,
    triggerGeneration,
  ]);

  const handleRetryGeneration = useCallback(() => {
    if (!isGeneratingPersonality) {
      triggerGeneration();
    }
  }, [triggerGeneration, isGeneratingPersonality]);

  // Prevent hydration mismatch: SSR always renders same content
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  // After mount, check personality and render accordingly
  if (!personality) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          {combinedGenerationError ? (
            <>
              <p className="text-muted-foreground">{combinedGenerationError}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleRetryGeneration} disabled={isGeneratingPersonality}>
                  {isGeneratingPersonality ? "重新生成中..." : "重试生成"}
                </Button>
                <Button variant="ghost" onClick={() => router.replace("/interview")}>
                  返回访谈
                </Button>
              </div>
            </>
          ) : hasInterviewData ? (
            <>
              <p className="text-lg text-muted-foreground">
                {isGeneratingPersonality ? "人格生成中，请稍候..." : "正在加载你的 Echo 档案..."}
              </p>
              {isGeneratingPersonality && (
                <p className="text-sm text-muted-foreground/70">
                  我们正在根据你的答案构建专属的 Echo 人格，请稍等片刻。
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">尚未完成访谈，正在跳转至访谈页面...</p>
          )}
        </div>
      </div>
    );
  }

  const selectedImage = getSelectedImage();

  const handleShare = () => {
    if (selectedImage) {
      setShareDialogOpen(true);
    } else {
      alert("请先选择一张形象");
    }
  };

  const handleDownload = () => {
    if (selectedImage) {
      window.open(selectedImage, "_blank");
    }
  };

  const handleGenerateNewScene = async () => {
    try {
      await generateImages(1, "9:16");
    } catch (error) {
      console.error("Generate new scene failed:", error);
      alert("生成失败，请稍后重试");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 py-4"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Echo 档案</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} disabled={!hasAnyImages}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.section variants={fadeInUp} className="text-center space-y-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {personality.name}
            </h2>
            <p className="text-2xl text-muted-foreground">{personality.tagline}</p>

            <div className="flex flex-wrap gap-3 justify-center">
              {personality.keywords.map((keyword, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </motion.section>

          {hasAnyImages ? (
            <motion.section variants={fadeInUp} className="space-y-6">
              <ImageGallery images={images} />

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGenerateNewScene}
                  className="gap-2"
                  disabled={isGeneratingImages}
                >
                  <Wand2 className="w-4 h-4" />
                  {isGeneratingImages ? "生成中..." : "生成新场景"}
                </Button>
                {selectedImage && (
                  <Button size="lg" onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    下载当前形象
                  </Button>
                )}
              </div>
            </motion.section>
          ) : (
            <motion.section
              variants={fadeInUp}
              className="space-y-6 rounded-3xl border border-border/60 bg-background/80 px-6 py-12 text-center shadow-lg shadow-background/20"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">等待首张 Echo 形象</h3>
                <p className="text-muted-foreground">
                  人格档案已经准备好，点击下方按钮生成 Echo 的首张形象。生成后即可继续解锁更多场景与装扮。
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleGenerateNewScene}
                  className="gap-2"
                  disabled={isGeneratingImages}
                >
                  <Wand2 className="w-4 h-4" />
                  {isGeneratingImages ? "生成中..." : "生成首张形象"}
                </Button>
              </div>
            </motion.section>
          )}

          <motion.section variants={fadeInUp}>
            <PersonalityCard personality={personality} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <TraitDetails personality={personality} />
          </motion.section>

          {partner && (
            <motion.section variants={fadeInUp}>
              <LifeScenesCard partner={partner} />
            </motion.section>
          )}

          <motion.section
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            {hasAnyImages ? (
              <Button size="lg" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                分享我的 Echo
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={handleGenerateNewScene}
                className="gap-2"
                disabled={isGeneratingImages}
              >
                <Wand2 className="w-4 h-4" />
                {isGeneratingImages ? "生成中..." : "先生成首张形象"}
              </Button>
            )}
          </motion.section>
        </motion.div>
      </main>

      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-8 text-center text-sm text-muted-foreground border-t border-border/50"
      >
        <p>这是你灵魂的回声，独一无二的存在</p>
      </motion.footer>

      {hasAnyImages && selectedImage && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          personality={personality}
          imageUrl={selectedImage}
        />
      )}
    </div>
  );
}
