/**
 * Regenerate Page
 * Allow users to regenerate personality or images
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, User, Image as ImageIcon } from "lucide-react";
import { useGeneratePersonality, useGenerateImages } from "@/hooks/useGeneration";
import { fadeInUp } from "@/lib/animations";

export default function RegeneratePage() {
  const router = useRouter();
  const { generate: generatePersonality, isLoading: isGeneratingPersonality } = useGeneratePersonality();
  const { generate: generateImages, isLoading: isGeneratingImages } = useGenerateImages();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegeneratePersonality = async () => {
    if (confirm("这将基于你的访谈答案重新生成人格，是否继续？")) {
      try {
        await generatePersonality();
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/generate");
        }, 1500);
      } catch (error) {
        alert("生成失败，请重试");
      }
    }
  };

  const handleRegenerateImages = async () => {
    if (confirm("这将重新生成形象（保持人格不变），是否继续？")) {
      try {
        // Pass undefined to use store personality
        await generateImages(3, "9:16");
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } catch (error) {
        console.error("Image regeneration error:", error);
        alert("生成失败，请重试");
      }
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl">✨</div>
          <h2 className="text-2xl font-bold text-foreground">生成完成！</h2>
          <p className="text-muted-foreground">正在跳转...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card p-4">
      <div className="container mx-auto max-w-4xl py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">重新生成</h1>
              <p className="text-muted-foreground">选择要重新生成的内容</p>
            </div>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Regenerate Personality */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  重新生成人格
                </CardTitle>
                <CardDescription>
                  基于你的访谈答案重新生成人格描述
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  onClick={handleRegeneratePersonality}
                  disabled={isGeneratingPersonality}
                  className="w-full gap-2"
                >
                  {isGeneratingPersonality ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重新生成人格
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  将生成不同风格的人格描述，但保持对你访谈的理解
                </p>
              </CardContent>
            </Card>

            {/* Regenerate Images */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-secondary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-secondary" />
                  重新生成形象
                </CardTitle>
                <CardDescription>
                  重新生成视觉形象，保持人格描述不变
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleRegenerateImages}
                  disabled={isGeneratingImages}
                  className="w-full gap-2"
                >
                  {isGeneratingImages ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重新生成形象
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  将生成 3 张新的形象，你可以选择最喜欢的
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/80">
                💡 <strong>提示：</strong>重新生成不会影响你的访谈答案，你可以无限次重新生成直到满意为止。
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

