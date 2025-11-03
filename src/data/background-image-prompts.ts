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
  
pixelated, low resolution pixel art, blocky pixels, game sprite style, 
young adult woman with black shoulder-length hair, wearing school uniform, 
crouching down on rainy Japanese street, holding transparent umbrella over small tabby cat, 
both looking at each other with gentle expressions, 
rich vibrant colors, full body scene, rainy street with traditional Japanese buildings, 
healing pixel art, NOT realistic, NOT photorealistic, NOT smooth, NOT detailed rendering, Soul app inspired`,
  {
    id: "bg-prompt-1",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，柔和自然光。
傍晚的小雨街道，女孩蹲下撑透明雨伞为一只小猫挡雨，路面倒影清晰，街边日式房屋与暖光灯笼，细致笔触，真实氛围。`,
    category: "understanding",
    description: "通过心理学模型深度分析你的情感模式和依恋风格",
    gridPosition: { column: 1, row: 1 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult woman with medium-length hair, wearing casual clothes, 
sitting alone in cozy cafe corner, reading book with thoughtful expression, 
warm rich colors, full scene with cafe environment, colorful coffee cup, 
NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app style`,
  {
    id: "bg-prompt-2",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，午后咖啡馆。女孩坐在靠窗沙发读书，木质桌面放着拿铁和植物，窗外柔和光线洒入，色调温暖，氛围安静。`,
    category: "understanding",
    description: "理解你的内心需求和情感表达方式",
    gridPosition: { column: 2, row: 1 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult man with short neat hair, wearing modern casual clothes, 
sitting in modern apartment by window, looking at screen showing personality data with focused expression, 
rich colorful data visualization, vibrant apartment colors, full room scene, 
NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired`,
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
  
pixelated, blocky pixels, game sprite style, 
young adult woman with long hair, wearing jacket, standing on train platform during sunset, 
watching city with gentle expression, character appearing from light particles, 
vibrant sunset colors with orange pink purple sky, colorful city lights, full body view, 
NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app aesthetic`,
  {
    id: "bg-prompt-4",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，日落的地铁站月台。长发女孩穿外套望向远方的城市天际线，天空呈现橙紫渐变，站台灯光渐亮，气氛充满期待。`,
    category: "visualization",
    description: "AI 将抽象的人格特质转化为视觉形象",
    gridPosition: { column: 1, row: 2 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult woman with medium-length hair, wearing cardigan, standing in cozy bookstore, 
browsing books on shelf with gentle expression, rich colorful books, warm lighting, 
full scene showing bookstore interior, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired`,
  {
    id: "bg-prompt-5",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，暖色调的独立书店。女孩坐在靠窗的高背木椅上读书，桌上放着咖啡与手帐，周围是排列整齐的旧书和绿色植物，暖黄吊灯营造柔和光线。`,
    category: "visualization",
    description: "从数据分析到可视化呈现，让匹配结果具象化",
    gridPosition: { column: 2, row: 2 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult woman with flowing hair, wearing light dress, walking through peaceful garden park, 
cherry blossoms falling, vibrant pink cherry blossoms, green grass and trees, 
full body view in environment, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app style`,
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
  
pixelated, blocky pixels, game sprite style, 
young adult man with short hair, wearing athletic wear, playing basketball on outdoor court, 
dribbling ball with focused expression, vibrant outdoor colors, basketball court environment, 
full body action scene, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired`,
  {
    id: "bg-prompt-7",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，夏日户外篮球场。男生穿球衣在阳光下运球训练，背景有绿色树木和球场围栏，动作自然，汗光微亮。`,
    category: "resonance",
    description: "不是理想化的完美，而是真实的、有温度的情感连接",
    gridPosition: { column: 1, row: 3 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult woman with neat hair, wearing short casual home dress, sitting at gaming setup, 
playing video games with focused expression, colorful gaming equipment and screens, cozy room environment, 
full scene showing gaming setup, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app aesthetic`,
  {
    id: "bg-prompt-8",
    artStyle: "写实插画风格",
    prompt: `写实插画，16:9 横版，夜晚的电竞房。女孩坐在专业电竞椅前，屏幕色彩丰富，桌面有键盘手柄与喝了一半的饮料，灯光营造紫蓝渐变。`,
    category: "resonance",
    description: "与你产生真实的共鸣，理解你的情感需求",
    gridPosition: { column: 2, row: 3 },
  },
  
pixelated, blocky pixels, game sprite style, 
young adult man with slightly messy hair, wearing apron over casual clothes, 
standing in cozy home kitchen during morning, cooking breakfast with gentle expression, 
warm kitchen colors, colorful ingredients, bright morning light, full body view, 
NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired`,
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
  const normalized = prompt.prompt
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/,\s+/g, ', ') // Normalize commas
    .trim();
  
  // Extract key style name from artStyle
  const styleKeywords = prompt.artStyle.toLowerCase().match(/(akira|90s|cyberpunk|makoto shinkai|pixel|ukiyo-e|shonen|shojo|80s)/i) || [];
  const styleName = styleKeywords[0] || prompt.artStyle.split(' ')[0].toLowerCase();
  
  // Build simplified prompt with key elements
  let shortPrompt = normalized;
  
  if (shortPrompt.length > 200) {
    // Prioritize: style name, character description, scene, color
    const keyParts = [
      prompt.artStyle.split(' ')[0], // Style name
      normalized.match(/(young adult character|character)/i)?.[0] || 'character',
      normalized.match(/(monochrome|black white gray)/i)?.[0] || 'monochrome',
      normalized.match(/(cyan)/i)?.[0] || 'cyan accent',
      'Soul app style'
    ].filter(Boolean).join(', ');
    
    // Keep first 120 chars of original, then add key parts
    const firstPart = normalized.substring(0, 120);
    const lastComma = firstPart.lastIndexOf(',');
    shortPrompt = lastComma > 0 
      ? firstPart.substring(0, lastComma) + ', ' + keyParts
      : firstPart + ', ' + keyParts;
  }
  
  return {
    ...prompt,
    prompt: shortPrompt.substring(0, 250), // Increased limit slightly for style names
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

