/**
 * Background Image Generation Prompts
 * 9 prompts for AI-generated background images
 * These images showcase example generated partner characters (例图)
 * Style: Soul App inspired (Black, White, Gray + Cyan)
 * Format: 9 different anime art styles with diverse scenes
 */

export interface BackgroundImagePrompt {
  id: string;
  prompt: string;
  category: "understanding" | "visualization" | "resonance";
  description: string;
  gridPosition: { column: number; row: number };
  artStyle: string; // Art style name for reference
}

/**
 * Background Image Prompts
 * Showcasing example generated partner characters in different scenes
 * Each image uses a different anime art style with diverse scenarios
 * Optimized for Pollinations AI or similar services
 * Color palette: Rich and vibrant colors, can include cyan accents (Soul App inspired)
 */
export const backgroundImagePrompts: BackgroundImagePrompt[] = [
  // === 深度理解 (Understanding) - Row 1 ===
  // 展示：单个生成的伴侣形象，通过心理学分析理解你的情感
  {
    id: "bg-prompt-1",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，柔和自然光。傍晚的小雨街道，女孩蹲下撑透明雨伞为一只小猫挡雨，路面倒影清晰，街边日式房屋与暖光灯笼，细致笔触，真实氛围。`,
    category: "understanding",
    description: "通过心理学模型深度分析你的情感模式和依恋风格",
    gridPosition: { column: 1, row: 1 },
  },
  {
    id: "bg-prompt-2",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，午后咖啡馆。女孩坐在靠窗沙发读书，木质桌面放着拿铁和植物，窗外柔和光线洒入，色调温暖，氛围安静。`,
    category: "understanding",
    description: "理解你的内心需求和情感表达方式",
    gridPosition: { column: 2, row: 1 },
  },
  {
    id: "bg-prompt-3",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，夜晚的都市公寓。青年坐在工作桌前，多个屏幕显示数据图表和色彩丰富的分析界面，窗外是城市夜景，室内灯光柔和。`,
    category: "understanding",
    description: "基于 Big Five 人格理论和依恋理论进行科学匹配",
    gridPosition: { column: 3, row: 1 },
  },

  // === 具象化 (Visualization) - Row 2 ===
  // 展示：AI 生成的具象化伴侣形象，在不同真实生活场景中
  {
    id: "bg-prompt-4",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，日落的地铁站月台。长发女孩穿外套望向远方的城市天际线，天空呈现橙紫渐变，站台灯光渐亮，气氛充满期待。`,
    category: "visualization",
    description: "AI 将抽象的人格特质转化为视觉形象",
    gridPosition: { column: 1, row: 2 },
  },
  {
    id: "bg-prompt-5",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，暖色调的独立书店。女孩坐在靠窗的高背木椅上读书，桌上放着咖啡与手帐，周围是排列整齐的旧书和绿色植物，暖黄吊灯营造柔和光线。`,
    category: "visualization",
    description: "从数据分析到可视化呈现，让匹配结果具象化",
    gridPosition: { column: 2, row: 2 },
  },
  {
    id: "bg-prompt-6",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，春天的公园。女孩穿着浅色连衣裙在樱花树下漫步，花瓣飘落，背景是草地与远处建筑，光线柔和，色彩清新。`,
    category: "visualization",
    description: "生成多场景故事画面，展现真实的生活片段",
    gridPosition: { column: 3, row: 2 },
  },

  // === 真实共鸣 (Resonance) - Row 3 ===
  // 展示：单个生成的伴侣形象，在真实情感场景中展现共鸣
  {
    id: "bg-prompt-7",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，夏日户外篮球场。男生穿球衣在阳光下运球训练，背景有绿色树木和球场围栏，动作自然，汗光微亮。`,
    category: "resonance",
    description: "不是理想化的完美，而是真实的、有温度的情感连接",
    gridPosition: { column: 1, row: 3 },
  },
  {
    id: "bg-prompt-8",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，夜晚的电竞房。女孩坐在专业电竞椅前，屏幕色彩丰富，桌面有键盘手柄与喝了一半的饮料，灯光营造紫蓝渐变。`,
    category: "resonance",
    description: "与你产生真实的共鸣，理解你的情感需求",
    gridPosition: { column: 2, row: 3 },
  },
  {
    id: "bg-prompt-9",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，清晨的家庭厨房。男生围着围裙煎蛋，阳光从窗户洒进来，台面摆着新鲜蔬果和早餐，色调温暖真实。`,
    category: "resonance",
    description: "一个有缺点但真实可爱的伴侣，与你完美互补",
    gridPosition: { column: 3, row: 3 },
  },
];

/**
 * Get simplified prompts for URL generation (shorter, for Pollinations)
 * These are optimized versions that fit URL length constraints
 * Key elements (art style, character, monochrome, cyan) are preserved
 */
export const backgroundImagePromptsShort: BackgroundImagePrompt[] = backgroundImagePrompts.map((prompt) => {
  const normalized = prompt.prompt.replace(/\s+/g, ' ').trim();
  const firstSentence = normalized.split(/[。.!?？]/)[0] || normalized;
  const shortPromptBase = `${prompt.artStyle}，${firstSentence}`;
  const shortPrompt = shortPromptBase.length > 220
    ? shortPromptBase.substring(0, 217) + '…'
    : shortPromptBase;

  return {
    ...prompt,
    prompt: shortPrompt,
  };
});

/**
 * Get full detailed prompts for high-quality generation services
 * (e.g., Midjourney, DALL-E, Stable Diffusion)
 */
export const backgroundImagePromptsDetailed: BackgroundImagePrompt[] = backgroundImagePrompts.map(prompt => ({
  ...prompt,
  prompt: `${prompt.prompt}

Technical specifications:
- Resolution: 1920x1080 or higher (16:9 aspect ratio)
- Art Style: ${prompt.artStyle}
- Color palette: Rich and vibrant colors, warm tones, can include cyan accents - Soul App inspired
- Character: Young adult (high school age or above), mature appearance, authentic and imperfect
- Composition: Character-focused scene, suitable as background, text overlay friendly
- Mood: Authentic, emotional, genuine connection, not idealized perfection
- Scene diversity: Each image shows different life scenario based on category
- Avoid: Childlike characters, overly complex backgrounds, realistic photography style, overly cheerful expressions`,
}));

