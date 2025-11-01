/**
 * Theme Toggle Component
 * Button to switch between light and dark mode
 * Soul App inspired design
 */

"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={`w-10 h-10 p-0 ${className}`}
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={`${sizeClasses[size]} p-0 rounded-full hover:bg-muted transition-colors ${className}`}
      aria-label={`切换到${theme === "dark" ? "浅色" : "深色"}模式`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className={iconSizes[size]} />
          ) : (
            <Moon className={iconSizes[size]} />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

