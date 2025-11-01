/**
 * Echo Logo Icon (Simplified)
 * Pure SVG icon component for use in favicon, app icons, etc.
 * Soul App inspired: Minimal, geometric, cyan accent
 */

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 80, className = "" }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外圈 - 青色边框（Soul 风格） */}
      <circle
        cx="40"
        cy="40"
        r="38"
        stroke="url(#cyan-gradient)"
        strokeWidth="2"
      />
      
      {/* 中圈 - 灰色 */}
      <circle
        cx="40"
        cy="40"
        r="28"
        stroke="#666666"
        strokeWidth="1.5"
        opacity="0.5"
      />
      
      {/* 内圈 - 青色强调 */}
      <circle
        cx="40"
        cy="40"
        r="18"
        stroke="url(#cyan-gradient)"
        strokeWidth="2"
      />
      
      {/* 中心点 - 白色 */}
      <circle
        cx="40"
        cy="40"
        r="6"
        fill="#FFFFFF"
      />
      
      {/* 声波线条 - 青色 */}
      <path
        d="M 20 40 Q 30 30, 40 40 Q 50 50, 60 40"
        stroke="url(#cyan-gradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* 青色渐变定义 */}
      <defs>
        <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

