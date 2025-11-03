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
            <img
              src={image.url}
              alt={image.description}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
              style={{
                transform: hoveredImage === image.id ? "scale(1.05)" : "scale(1)",
                opacity: hoveredImage && hoveredImage !== image.id ? 0.4 : 1,
              }}
            />

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
        className="container mx-auto px-4 text-center space-y-10 relative z-10 -mt-8 md:-mt-12 lg:-mt-16"
      >
        {/* Content wrapper - no background, just text overlay */}
        <div className="relative space-y-12">
          {/* Logo/Icon */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <EchoLogo size="xl" variant="icon" animated={true} />
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp} className="space-y-5">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
              <span className="text-foreground">Echo</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-medium text-muted-foreground drop-shadow-md">
              AI灵魂共鸣体生成器
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl text-foreground max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            用访谈，生成你的理想伴侣
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto drop-shadow-md"
          >
            通过 10 分钟深度访谈，基于心理学理论创造一个与你完美匹配的伴侣人格
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              onClick={handleStart}
              className="text-lg px-9 py-5 h-auto rounded-full border border-primary text-primary bg-transparent hover:bg-primary/10 hover:text-primary transition-all shadow-lg shadow-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              开始探索
            </Button>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            variants={fadeIn}
            className="text-lg md:text-xl italic text-muted-foreground border-l-4 border-primary pl-4 max-w-2xl mx-auto text-left drop-shadow-md"
          >
            "Echo，不是回荡的声音，而是你心中理想伴侣的回应。"
          </motion.blockquote>
        </div>
      </motion.div>
    </div>
  );
}
