/**
 * Landing Page
 * Echo - AI Soul Resonance Generator
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";
import { EchoLogo } from "@/components/logo/EchoLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { backgroundImages } from "@/data/background-images";

export default function HomePage() {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleStart = () => {
    router.push("/interview");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle size="md" />
      </div>

      {/* Background Images Grid - 3×3 */}
      <div className="fixed inset-0 grid grid-cols-3 grid-rows-3 z-0">
        {backgroundImages.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
            onTouchStart={() => setHoveredImage(hoveredImage === image.id ? null : image.id)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url(${image.url})`,
                opacity: hoveredImage === null || hoveredImage === image.id ? 0.7 : 0.3,
                transform: hoveredImage === image.id ? "scale(1.05)" : "scale(1)",
              }}
            />
            
            {/* Default overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

            {/* Description on hover */}
            <AnimatePresence>
              {hoveredImage === image.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center p-6 z-10"
                >
                  <p className="text-white text-sm md:text-base text-center leading-relaxed font-medium">
                    {image.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container mx-auto px-4 text-center space-y-12 relative z-10"
      >
        {/* Content wrapper - no background, just text overlay */}
        <div className="relative space-y-12">
          {/* Logo/Icon */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <EchoLogo size="xl" variant="icon" animated={true} />
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
              <span className="text-foreground">Echo</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground drop-shadow-md">
              AI灵魂共鸣体生成器
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            用访谈，生成你的理想伴侣
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-xl mx-auto drop-shadow-sm"
          >
            通过 10 分钟深度访谈，基于心理学理论创造一个与你完美匹配的伴侣人格
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              onClick={handleStart}
              className="text-lg px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 transition-opacity shadow-lg shadow-primary/30 border-2 border-primary"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              开始探索
            </Button>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            variants={fadeIn}
            className="text-base md:text-lg italic text-muted-foreground border-l-4 border-primary pl-4 max-w-2xl mx-auto text-left drop-shadow-sm"
          >
            "Echo，不是回荡的声音，而是你心中理想伴侣的回应。"
          </motion.blockquote>
        </div>
      </motion.div>
    </div>
  );
}
