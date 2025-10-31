/**
 * ShareCard Component
 * Beautiful share card for social platforms
 */

"use client";

import { PersonalityProfile } from "@/types/personality";
import Image from "next/image";

interface ShareCardProps {
  personality: PersonalityProfile;
  imageUrl: string;
  template?: "minimalist" | "elegant";
}

/**
 * Check if image URL is from Pollinations AI
 * Pollinations AI URLs don't need Next.js Image optimization proxy
 */
function isPollinationsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "image.pollinations.ai" || urlObj.hostname.includes("pollinations.ai");
  } catch {
    // If URL parsing fails, check if it contains pollinations
    return url.includes("pollinations.ai");
  }
}

export function ShareCard({ personality, imageUrl, template = "minimalist" }: ShareCardProps) {
  if (template === "elegant") {
    return <ElegantTemplate personality={personality} imageUrl={imageUrl} />;
  }

  return <MinimalistTemplate personality={personality} imageUrl={imageUrl} />;
}

/**
 * Minimalist Template
 */
function MinimalistTemplate({ personality, imageUrl }: Omit<ShareCardProps, "template">) {
  return (
    <div
      id="share-card"
      className="relative w-[800px] h-[1200px] bg-gradient-to-br from-[#0F0F1E] via-[#1A1A2E] to-[#0F0F1E] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#8B7FFF_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#FF9ECD_0%,transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-12">
        {/* Image */}
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-8">
          {isPollinationsUrl(imageUrl) ? (
            <img 
              src={imageUrl} 
              alt={personality.name} 
              className="absolute inset-0 w-full h-full object-cover" 
              crossOrigin="anonymous" 
            />
          ) : (
            <Image src={imageUrl} alt={personality.name} fill className="object-cover" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-6xl font-bold bg-gradient-to-r from-[#8B7FFF] via-[#FF9ECD] to-[#4ECDC4] bg-clip-text text-transparent">
              {personality.name}
            </h1>

            {/* Tagline */}
            <p className="text-3xl text-white/80 leading-relaxed">{personality.tagline}</p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-3">
              {personality.keywords.slice(0, 4).map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-[#8B7FFF]/20 border border-[#8B7FFF]/30 text-[#8B7FFF] text-xl"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <div className="text-white/60 text-xl">
              <p className="font-bold">Echo</p>
              <p className="text-lg">AI灵魂共鸣体生成器</p>
            </div>
            <div className="text-right text-white/40 text-lg">
              <p>用访谈，生成你的灵魂回声</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Elegant Template
 */
function ElegantTemplate({ personality, imageUrl }: Omit<ShareCardProps, "template">) {
  return (
    <div
      id="share-card"
      className="relative w-[800px] h-[1200px] bg-[#0F0F1E] overflow-hidden"
    >
      {/* Image Background */}
      <div className="absolute inset-0">
        {isPollinationsUrl(imageUrl) ? (
          <img src={imageUrl} alt={personality.name} className="w-full h-full object-cover opacity-30 blur-xl" crossOrigin="anonymous" />
        ) : (
          <Image src={imageUrl} alt={personality.name} fill className="object-cover opacity-30 blur-xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F1E]/80 to-[#0F0F1E]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-12">
        {/* Top: Image */}
        <div className="relative w-[500px] h-[500px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 mb-12">
          {isPollinationsUrl(imageUrl) ? (
            <img 
              src={imageUrl} 
              alt={personality.name} 
              className="absolute inset-0 w-full h-full object-cover" 
              crossOrigin="anonymous" 
            />
          ) : (
            <Image src={imageUrl} alt={personality.name} fill className="object-cover" />
          )}
        </div>

        {/* Bottom: Text */}
        <div className="flex-1 flex flex-col items-center text-center space-y-8">
          {/* Name */}
          <h1 className="text-7xl font-bold text-white drop-shadow-lg">{personality.name}</h1>

          {/* Tagline */}
          <p className="text-2xl text-white/90 italic max-w-xl leading-relaxed">
            "{personality.tagline}"
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-3 justify-center">
            {personality.keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={index}
                className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-12 space-y-2 text-white/60">
            <p className="text-2xl font-bold text-white/80">Echo</p>
            <p className="text-lg">AI灵魂共鸣体生成器</p>
          </div>
        </div>
      </div>
    </div>
  );
}

