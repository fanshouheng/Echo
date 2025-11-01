/**
 * Background Image Generation Prompts
 * 9 prompts for AI-generated background images
 * Style: Soul App inspired (Black, White, Gray + Cyan)
 * Format: Pixel Art / Abstract / Minimalist
 */

export interface BackgroundImagePrompt {
  id: string;
  prompt: string;
  category: "understanding" | "visualization" | "resonance";
  description: string;
  gridPosition: { column: number; row: number };
}

/**
 * Background Image Prompts
 * Optimized for Pollinations AI or similar services
 * Style: Minimalist, abstract, black/white/gray with cyan accents
 */
export const backgroundImagePrompts: BackgroundImagePrompt[] = [
  // === 深度理解 (Understanding) - Row 1 ===
  
  {
    id: "bg-prompt-1",
    prompt: `Minimalist abstract composition, neural network visualization, brain pattern connections, 
monochrome black and white, single bright cyan accent line, geometric shapes, 
pixel art style, high contrast, clean modern aesthetic, Soul app inspired, 
suitable as background, subtle texture`,
    category: "understanding",
    description: "通过心理学模型深度分析你的情感模式和依恋风格",
    gridPosition: { column: 1, row: 1 },
  },
  
  {
    id: "bg-prompt-2",
    prompt: `Abstract emotional wave pattern, flowing lines, monochrome gradient from black to gray,
single cyan highlight curve, minimalist design, geometric abstraction,
pixel art aesthetic, soft edges, modern digital art, Soul app style,
background suitable, subtle depth`,
    category: "understanding",
    description: "理解你的内心需求和情感表达方式",
    gridPosition: { column: 2, row: 1 },
  },
  
  {
    id: "bg-prompt-3",
    prompt: `Minimalist data visualization, grid pattern, binary code aesthetic,
black and white composition, cyan accent dots, geometric grid lines,
pixel art style, scientific diagram feeling, modern tech aesthetic,
Soul app inspired, background texture, subtle pattern`,
    category: "understanding",
    description: "基于 Big Five 人格理论和依恋理论进行科学匹配",
    gridPosition: { column: 3, row: 1 },
  },

  // === 具象化 (Visualization) - Row 2 ===
  
  {
    id: "bg-prompt-4",
    prompt: `Abstract AI generation process, transformation visualization,
geometric shapes morphing, black to white gradient, cyan pulse effect,
pixel art animation still, minimalist composition, digital art style,
Soul app aesthetic, abstract tech background, subtle movement`,
    category: "visualization",
    description: "AI 将抽象的人格特质转化为像素艺术风格的视觉形象",
    gridPosition: { column: 1, row: 2 },
  },
  
  {
    id: "bg-prompt-5",
    prompt: `Minimalist data visualization, abstract chart pattern,
monochrome bars and lines, single cyan highlight, clean geometric shapes,
pixel art style, high contrast black and white, modern infographic aesthetic,
Soul app inspired, background suitable, minimalist design`,
    category: "visualization",
    description: "从数据分析到可视化呈现，让匹配结果具象化",
    gridPosition: { column: 2, row: 2 },
  },
  
  {
    id: "bg-prompt-6",
    prompt: `Abstract scene composition, fragmented reality aesthetic,
pixel art style, black white gray palette, cyan accent elements,
geometric scene fragments, minimalist story visualization,
modern digital art, Soul app style, abstract background,
subtle narrative elements`,
    category: "visualization",
    description: "生成多场景故事画面，展现真实的生活片段",
    gridPosition: { column: 3, row: 2 },
  },

  // === 真实共鸣 (Resonance) - Row 3 ===
  
  {
    id: "bg-prompt-7",
    prompt: `Abstract emotional connection visualization, two circles converging,
monochrome composition, black to gray gradient, cyan connection line,
pixel art style, minimalist geometric design, emotional resonance symbol,
modern digital art, Soul app aesthetic, background texture,
subtle warmth feeling`,
    category: "resonance",
    description: "不是理想化的完美，而是真实的、有温度的情感连接",
    gridPosition: { column: 1, row: 3 },
  },
  
  {
    id: "bg-prompt-8",
    prompt: `Abstract harmony pattern, flowing waves meeting,
black and white minimalist composition, cyan resonance pulse,
geometric wave patterns, pixel art aesthetic, emotional synchronization,
modern abstract art, Soul app style, background suitable,
subtle rhythm feeling`,
    category: "resonance",
    description: "与你产生真实的共鸣，理解你的情感需求",
    gridPosition: { column: 2, row: 3 },
  },
  
  {
    id: "bg-prompt-9",
    prompt: `Abstract complementary shapes, puzzle pieces fitting together,
monochrome black white gray, cyan accent connection, minimalist design,
pixel art style, geometric harmony, perfect match visualization,
modern digital composition, Soul app inspired, background texture,
subtle balance feeling`,
    category: "resonance",
    description: "一个有缺点但真实可爱的伴侣，与你完美互补",
    gridPosition: { column: 3, row: 3 },
  },
];

/**
 * Get simplified prompts for URL generation (shorter, for Pollinations)
 * These are optimized versions that fit URL length constraints
 */
export const backgroundImagePromptsShort: BackgroundImagePrompt[] = backgroundImagePrompts.map(prompt => ({
  ...prompt,
  prompt: prompt.prompt
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/,\s+/g, ', ') // Normalize commas
    .trim()
    .substring(0, 200), // Limit to 200 chars for URL safety
}));

/**
 * Get full detailed prompts for high-quality generation services
 * (e.g., Midjourney, DALL-E, Stable Diffusion)
 */
export const backgroundImagePromptsDetailed: BackgroundImagePrompt[] = backgroundImagePrompts.map(prompt => ({
  ...prompt,
  prompt: `${prompt.prompt}

Technical specifications:
- Resolution: 1920x1080 or higher
- Style: Minimalist, abstract, monochrome
- Color palette: Black (#000000), White (#FFFFFF), Gray scale, Cyan accent (#00BFFF)
- Aesthetic: Soul app inspired, modern, clean
- Composition: Suitable as background, text overlay friendly
- Mood: Subtle, sophisticated, tech-forward
- Avoid: Bright colors (except cyan), busy patterns, distracting elements`,
}));

