/**
 * Profile Page
 * Display complete Echo personality profile
 */

"use client";

import { useEffect, useState } from "react";
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
import { useGenerateImages } from "@/hooks/useGeneration";

export default function ProfilePage() {
  const router = useRouter();
  const { personality, partner, images, hasPersonality, hasImages, getSelectedImage } =
    useGenerationStore();
  const { completedAt } = useInterviewStore();
  const { generate: generateImages, isLoading: isGeneratingImages } = useGenerateImages();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mount check to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if no personality
  useEffect(() => {
    if (isMounted && !hasPersonality()) {
      // If interview is completed but no personality, go to generate page
      if (completedAt) {
        router.push("/generate");
      } else {
        // Otherwise, go to interview page
        router.push("/interview");
      }
    }
  }, [isMounted, hasPersonality, completedAt, router]);

  // Show loading only after mount to avoid hydration mismatch
  if (!isMounted || !personality) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
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
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 py-4"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Echo 档案</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Hero Section */}
          <motion.section variants={fadeInUp} className="text-center space-y-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {personality.name}
            </h2>
            <p className="text-2xl text-muted-foreground">{personality.tagline}</p>
            
            {/* Keywords */}
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

          {/* Image Gallery */}
          {hasImages() && images.length > 0 && (
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
          )}

          {/* Personality Details */}
          <motion.section variants={fadeInUp}>
            <PersonalityCard personality={personality} />
          </motion.section>

          {/* Trait Details */}
          <motion.section variants={fadeInUp}>
            <TraitDetails personality={personality} />
          </motion.section>

          {/* Life Scenes (Enhanced Details) */}
          {partner && (
            <motion.section variants={fadeInUp}>
              <LifeScenesCard partner={partner} />
            </motion.section>
          )}

          {/* Action Buttons */}
          <motion.section variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              分享我的 Echo
            </Button>
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-8 text-center text-sm text-muted-foreground border-t border-border/50"
      >
        <p>这是你灵魂的回声，独一无二的存在</p>
      </motion.footer>

      {/* Share Dialog */}
      {selectedImage && (
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

