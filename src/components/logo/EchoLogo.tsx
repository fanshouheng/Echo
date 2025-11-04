/**
 * Echo Logo Component
 * Soul App Inspired Design: Black, White, Gray + Cyan
 * Modern, Minimalist, Tech-forward
 */

import { motion } from "framer-motion";

interface EchoLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  sm: { icon: 32, text: "text-xl" },
  md: { icon: 48, text: "text-2xl" },
  lg: { icon: 64, text: "text-3xl" },
  xl: { icon: 80, text: "text-4xl" },
};

export function EchoLogo({
  size = "md",
  variant = "full",
  className = "",
  animated = false,
}: EchoLogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  // Logo Icon - 简化为带有渐变强调的 Echo 字首
  const LogoIcon = () => (
    <span
      className={`${textSize} font-bold tracking-tight ${className}`}
      style={{
        background: "linear-gradient(120deg, rgba(255,255,255,0.85), rgba(0,191,255,0.95))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      E
    </span>
  );

  // Logo Text - "Echo"
  const LogoText = () => (
    <span
      className={`${textSize} font-bold tracking-tight ${className}`}
      style={{
        background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 80%, #00BFFF 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Echo
    </span>
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <LogoText />
      </div>
    );
  }

  // Full version: Icon + Text
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}

