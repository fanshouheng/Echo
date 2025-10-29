/**
 * Image Generation Prompts
 * Prompt templates for Flux and SDXL
 */

import { PersonalityProfile } from "@/types/personality";

/**
 * Build Flux image generation prompt from personality
 */
export function buildFluxPrompt(personality: PersonalityProfile): string {
  const { name, tagline, keywords, communicationStyle, values, uniqueTraits } = personality;

  // Extract mood/atmosphere keywords
  const moodKeywords = keywords.slice(0, 3).join(", ");

  // Build detailed prompt
  return `Portrait of "${name}", a soulful AI persona embodying: ${tagline}.

Character essence: ${moodKeywords}
Emotional depth: ${communicationStyle.substring(0, 60)}...
Core values: ${values.substring(0, 60)}...
Unique trait: ${uniqueTraits.substring(0, 60)}...

Visual style:
- Ethereal, dreamlike atmosphere with soft focus
- Cinematic lighting with gentle glow and rim light
- Color palette: Deep purples, soft pinks, cool blues (OKLCH color space)
- Mood: Introspective, serene, emotionally resonant
- Composition: Medium portrait, eye-level, intimate connection
- Background: Abstract, bokeh, starlight particles
- Aesthetic: Modern digital art meets classical portraiture

Technical specs:
- Ultra high quality, 8K resolution
- Photorealistic with artistic enhancement
- Soft skin texture, expressive eyes
- Professional color grading
- Masterpiece quality

Avoid: overly cheerful expressions, bright colors, harsh lighting, generic stock photo look`;
}

/**
 * Build SDXL image generation prompt (fallback)
 */
export function buildSDXLPrompt(personality: PersonalityProfile): string {
  const { name, keywords } = personality;

  const mood = keywords[0] || "serene";

  return `Portrait of ${name}, ${mood} expression, ethereal digital art, soft lighting, deep purple and pink tones, dreamy atmosphere, high quality, cinematic, introspective mood, 8k, masterpiece`;
}

/**
 * Negative prompt for both models
 */
export const negativePrompt = `
ugly, deformed, noisy, blurry, low quality, jpeg artifacts, 
cartoon, anime, 3d render, doll, plastic, CGI, illustration,
overly saturated, neon colors, cheerful, happy, smiling broadly,
text, watermark, signature, logo, username, 
multiple people, cropped face, distorted features,
poor anatomy, bad proportions, worst quality
`.trim();

/**
 * Get aspect ratio based on device type
 */
export function getAspectRatio(deviceType: "mobile" | "desktop" = "mobile"): string {
  return deviceType === "mobile" ? "9:16" : "3:4";
}

/**
 * Build simplified prompt for Pollinations (URL length limit)
 */
export function buildPollinationsPrompt(personality: PersonalityProfile): string {
  const { name, keywords } = personality;
  
  // Keep it short and focused
  const mood = keywords.slice(0, 2).join(", ");
  
  return `Portrait of ${name}, ${mood}, ethereal digital art, soft cinematic lighting, deep purple and pink tones, dreamy bokeh, high quality, 8k, introspective mood`;
}

/**
 * Get image dimensions for generation
 */
export function getImageDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "9:16":
      return { width: 1024, height: 1824 }; // Mobile portrait
    case "3:4":
      return { width: 768, height: 1024 }; // Desktop portrait
    case "1:1":
      return { width: 1024, height: 1024 }; // Square
    default:
      return { width: 768, height: 1024 };
  }
}

