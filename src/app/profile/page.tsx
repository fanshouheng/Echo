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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Coffee, Moon, Home, MessageSquare, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [sceneDialogOpen, setSceneDialogOpen] = useState(false);
  const [customSceneInput, setCustomSceneInput] = useState("");

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

  const handleGenerateNewScene = () => {
    setSceneDialogOpen(true);
  };

  const handleGenerateFirstImage = async () => {
    try {
      setGenerationError(null);
      // 直接生成第一张图片，不需要用户输入场景描述
      await generateImages(1, "9:16");
    } catch (error) {
      console.error("Generate first image failed:", error);
      setGenerationError("生成失败，请稍后重试");
      alert("生成失败，请稍后重试");
    }
  };

  const handleConfirmGenerateScene = async () => {
    try {
      const userInput = customSceneInput.trim() || undefined;
      setSceneDialogOpen(false);
      setCustomSceneInput("");
      await generateImages(1, "9:16", undefined, userInput);
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

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6 md:space-y-8"
        >
          {/* 顶部区域：名字介绍 + 图片 - 左右布局 */}
          <motion.section variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-6">
            {/* 左侧：名字和介绍 */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6 flex flex-col justify-center">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {personality.name}
            </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  {personality.tagline}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
              {personality.keywords.map((keyword, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/20 text-primary text-sm md:text-base font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
            </div>

            {/* 右侧：图片区域 */}
            {hasAnyImages && (
              <div className="lg:col-span-7">
                <ImageGallery images={images} />
              </div>
            )}
          </motion.section>

          {/* 图片操作按钮 */}
          {hasAnyImages && (
            <motion.section variants={fadeInUp} className="flex flex-wrap justify-center gap-3 pb-6">
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
            </motion.section>
          )}

          {/* 生成新场景对话框 */}
          <Dialog open={sceneDialogOpen} onOpenChange={setSceneDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>生成新场景</DialogTitle>
                <DialogDescription>
                  输入你想要的场景描述（可选），或者留空让 AI 自动生成。例如："黄昏的咖啡厅"、"清晨的书房"等。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <textarea
                  value={customSceneInput}
                  onChange={(e) => setCustomSceneInput(e.target.value)}
                  placeholder="例如：黄昏的咖啡厅，安静的阅读时光..."
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
                  disabled={isGeneratingImages}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSceneDialogOpen(false);
                    setCustomSceneInput("");
                  }}
                  disabled={isGeneratingImages}
                >
                  取消
                </Button>
                <Button
                  onClick={handleConfirmGenerateScene}
                  disabled={isGeneratingImages}
                  className="gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {isGeneratingImages ? "生成中..." : "生成"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 如果没有图片，显示生成提示 */}
          {!hasAnyImages && (
            <motion.section
              variants={fadeInUp}
              className="rounded-2xl border border-border/60 bg-background/80 px-6 py-10 text-center shadow-lg"
            >
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">等待首张 Echo 形象</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  人格档案已经准备好，点击下方按钮生成 Echo 的首张形象。
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={handleGenerateFirstImage}
                  className="gap-2"
                  disabled={isGeneratingImages}
                >
                  <Wand2 className="w-4 h-4" />
                  {isGeneratingImages ? "生成中..." : "生成首张形象"}
              </Button>
                {generationError && (
                  <p className="text-sm text-destructive">{generationError}</p>
                )}
              </div>
            </motion.section>
          )}

          {/* 网格布局区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* 第一行：关于TA - 占满整行 */}
            <motion.div variants={fadeInUp} className="lg:col-span-12">
              <PersonalityCard personality={personality} />
            </motion.div>

            {/* 第二行：沟通风格 + 价值观 - 两个并排 */}
            <motion.div variants={fadeInUp} className="lg:col-span-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    沟通风格
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                    {personality.communicationStyle}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-span-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-secondary flex items-center gap-2">
                    <span className="w-1 h-6 bg-secondary rounded-full"></span>
                    价值观
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                    {personality.values}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 第三行：为什么是TA - 占满整行 */}
            <motion.div variants={fadeInUp} className="lg:col-span-12">
              <Card className="border-border/50 bg-gradient-to-r from-card/50 to-accent/5 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl md:text-2xl font-bold text-accent flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full"></span>
                    为什么是TA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                    {personality.whyMatch}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 第四行：独特之处 - 占满整行 */}
            <motion.div variants={fadeInUp} className="lg:col-span-12">
              <TraitDetails personality={personality} />
            </motion.div>

            {/* 如果有 partner 数据，显示生活场景 */}
            {partner && (
              <>
                {/* 第五行：日常生活场景 - 大卡片占满整行 */}
                {partner.dailyLifeScenes && (
                  <motion.div variants={fadeInUp} className="lg:col-span-12">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          日常生活场景
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                          {partner.dailyLifeScenes.morningRoutine && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-primary">
                                <Coffee className="w-4 h-4" />
                                <h3 className="text-base md:text-lg font-semibold">早晨时光</h3>
                              </div>
                              <p className="text-foreground/90 leading-relaxed text-sm md:text-base pl-6">
                                {partner.dailyLifeScenes.morningRoutine}
                              </p>
                            </div>
                          )}
                          {partner.dailyLifeScenes.eveningRoutine && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-secondary">
                                <Moon className="w-4 h-4" />
                                <h3 className="text-base md:text-lg font-semibold">夜晚时光</h3>
                              </div>
                              <p className="text-foreground/90 leading-relaxed text-sm md:text-base pl-6">
                                {partner.dailyLifeScenes.eveningRoutine}
                              </p>
                            </div>
                          )}
                          {partner.dailyLifeScenes.weekendActivity && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-accent">
                                <Calendar className="w-4 h-4" />
                                <h3 className="text-base md:text-lg font-semibold">周末时光</h3>
                              </div>
                              <p className="text-foreground/90 leading-relaxed text-sm md:text-base pl-6">
                                {partner.dailyLifeScenes.weekendActivity}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* 第六行：互动方式 + 一起生活 - 两个并排 */}
                {partner.interactionDetails && (
                  <motion.div variants={fadeInUp} className="lg:col-span-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          TA 的互动方式
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {partner.interactionDetails.howTheyGreet && (
                          <div className="space-y-2">
                            <h3 className="text-sm md:text-base font-semibold text-primary">如何打招呼</h3>
                            <p className="text-foreground/90 leading-relaxed text-sm">
                              {partner.interactionDetails.howTheyGreet}
                            </p>
                          </div>
                        )}
                        {partner.interactionDetails.howTheyShowCare && (
                          <div className="space-y-2 pt-2 border-t border-border/30">
                            <h3 className="text-sm md:text-base font-semibold text-secondary">如何表达关心</h3>
                            <p className="text-foreground/90 leading-relaxed text-sm">
                              {partner.interactionDetails.howTheyShowCare}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
            </motion.div>
          )}

                {partner.livingTogether && (
                  <motion.div variants={fadeInUp} className="lg:col-span-6">
                    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm shadow-lg h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                          <Home className="w-5 h-5 text-primary" />
                          一起生活
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {partner.livingTogether.morningScene && (
                          <div className="space-y-2">
                            <h3 className="text-sm md:text-base font-semibold text-primary">早晨</h3>
                            <p className="text-foreground/90 leading-relaxed text-sm">
                              {partner.livingTogether.morningScene}
                            </p>
                          </div>
                        )}
                        {partner.livingTogether.weekendScene && (
                          <div className="space-y-2 pt-2 border-t border-border/30">
                            <h3 className="text-sm md:text-base font-semibold text-accent">周末</h3>
                            <p className="text-foreground/90 leading-relaxed text-sm">
                              {partner.livingTogether.weekendScene}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* 第七行：更多细节 - 占满整行 */}
                {partner.deeperTraits && (
                  <motion.div variants={fadeInUp} className="lg:col-span-12">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                          <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          TA 的更多细节
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                          {partner.deeperTraits.hiddenTalents && partner.deeperTraits.hiddenTalents.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-primary">隐藏才能</h3>
                              <ul className="list-none space-y-1.5 text-foreground/90">
                                {partner.deeperTraits.hiddenTalents.slice(0, 3).map((talent, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <span className="text-primary mt-1">•</span>
                                    <span className="flex-1">{talent}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {partner.deeperTraits.quirks && partner.deeperTraits.quirks.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-secondary">小习惯</h3>
                              <ul className="list-none space-y-1.5 text-foreground/90">
                                {partner.deeperTraits.quirks.slice(0, 3).map((quirk, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <span className="text-secondary mt-1">•</span>
                                    <span className="flex-1">{quirk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {partner.deeperTraits.petPeeves && partner.deeperTraits.petPeeves.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-accent">小介意</h3>
                              <ul className="list-none space-y-1.5 text-foreground/90">
                                {partner.deeperTraits.petPeeves.slice(0, 3).map((peeve, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <span className="text-accent mt-1">•</span>
                                    <span className="flex-1">{peeve}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {partner.deeperTraits.randomFacts && partner.deeperTraits.randomFacts.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-primary">随机事实</h3>
                              <ul className="list-none space-y-1.5 text-foreground/90">
                                {partner.deeperTraits.randomFacts.slice(0, 3).map((fact, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <span className="text-primary mt-1">•</span>
                                    <span className="flex-1">{fact}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* 底部分享按钮 */}
          <motion.section
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
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
                onClick={handleGenerateFirstImage}
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
