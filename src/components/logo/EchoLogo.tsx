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
  sm: { icon: 32, text: "text-2xl" },
  md: { icon: 48, text: "text-3xl" },
  lg: { icon: 64, text: "text-4xl" },
  xl: { icon: 80, text: "text-5xl" },
};

export function EchoLogo({
  size = "md",
  variant = "full",
  className = "",
  animated = false,
}: EchoLogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  // Logo Icon - 声波共鸣设计（Soul 风格）
  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* 外圈 - 青色边框（Soul 风格） */}
      <circle
        cx="40"
        cy="40"
        r="38"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
      />
      
      {/* 中圈 - 灰色 */}
      <circle
        cx="40"
        cy="40"
        r="28"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground"
        opacity="0.5"
      />
      
      {/* 内圈 - 青色强调 */}
      <circle
        cx="40"
        cy="40"
        r="18"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
      />
      
      {/* 中心点 - 白色 */}
      <circle
        cx="40"
        cy="40"
        r="6"
        fill="currentColor"
        className="text-foreground"
      />
      
      {/* 声波线条 - 青色强调（类似 Soul 的视觉效果） */}
      {animated ? (
        <motion.path
          d="M 20 40 Q 30 30, 40 40 Q 50 50, 60 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ) : (
        <path
          d="M 20 40 Q 30 30, 40 40 Q 50 50, 60 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
        />
      )}
    </svg>
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

