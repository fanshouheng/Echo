/**
 * Landing Page
 * Echo - AI Soul Resonance Generator
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";

export default function HomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Generate stars only on client side to avoid hydration mismatch
  const stars = useMemo(() => {
    if (!isMounted) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleStart = () => {
    router.push("/interview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container mx-auto px-4 text-center space-y-12 relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div variants={fadeIn} className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Echo
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
            AI灵魂共鸣体生成器
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed"
        >
          用访谈，生成你的理想伴侣
        </motion.p>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          通过 10 分钟深度访谈，基于心理学理论创造一个与你完美匹配的伴侣人格
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeInUp}>
          <Button
            size="lg"
            onClick={handleStart}
            className="text-lg px-8 py-6 h-auto rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            开始探索
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-4xl">💝</div>
            <h3 className="text-lg font-semibold text-foreground">科学匹配</h3>
            <p className="text-sm text-muted-foreground">
              基于依恋理论和人格心理学，精准匹配你的情感需求
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-4xl">🎨</div>
            <h3 className="text-lg font-semibold text-foreground">视觉呈现</h3>
            <p className="text-sm text-muted-foreground">
              AI生成理想伴侣的形象，让抽象的匹配具象化
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-4xl">💕</div>
            <h3 className="text-lg font-semibold text-foreground">完美互补</h3>
            <p className="text-sm text-muted-foreground">
              不是完美的理想化，而是真实可爱、与你互补的伴侣
            </p>
          </motion.div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          variants={fadeIn}
          className="text-base md:text-lg italic text-muted-foreground border-l-4 border-primary pl-4 max-w-2xl mx-auto text-left"
        >
          "Echo，不是回荡的声音，而是你心中理想伴侣的回应。"
        </motion.blockquote>
      </motion.div>
    </div>
  );
}
