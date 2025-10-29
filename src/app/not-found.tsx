/**
 * 404 Not Found Page
 */

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-8 max-w-md"
      >
        {/* Icon */}
        <div className="text-8xl">🌌</div>

        {/* 404 */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">页面不存在</h2>
          <p className="text-muted-foreground">
            这片灵魂空间尚未被探索...
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/")} className="gap-2">
            <Home className="w-4 h-4" />
            返回首页
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            返回上一页
          </Button>
        </div>

        {/* Quote */}
        <p className="text-sm text-muted-foreground italic pt-8">
          "迷路并非终点，而是新的开始"
        </p>
      </motion.div>
    </div>
  );
}

