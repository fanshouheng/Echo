/**
 * Image Generation Prompts
 * Prompt templates for Flux and SDXL
 * Enhanced with PartnerPersonalityProfile support
 */

import { PersonalityProfile } from "@/types/personality";
import { PartnerPersonalityProfile } from "@/types/partner-personality";

type VisualProfileHints = {
  ageDescriptor: string;
  genderTerm: string;
  occupation?: string;
  outfit: string;
  accessories: string[];
  lighting: string;
  primaryScene?: string;
  alternateScenes: string[];
  moodKeywords: string[];
};

function cleanText(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatAgeDescriptor(raw?: string): string | undefined {
  const normalized = cleanText(raw);
  if (!normalized) return undefined;
  const digits = normalized.match(/\d+/g);
  if (digits && digits.length >= 2) {
    return `${digits[0]}-${digits[1]}岁`;
  }
  if (digits && digits.length === 1) {
    return `${digits[0]}岁左右`;
  }
  return normalized;
}

function defaultAgeDescriptor(preferredGender?: "male" | "female"): string {
  return preferredGender === "female" || preferredGender === "male"
    ? "十六岁以上的青年"
    : "十六岁以上的青年";
}

function resolveGenderTerm(preferredGender?: "male" | "female"): string {
  if (preferredGender === "female") return "年轻女性";
  if (preferredGender === "male") return "年轻男性";
  return "年轻人";
}

function deriveVisualHints(
  personality: PersonalityProfile | PartnerPersonalityProfile,
  preferredGender?: "male" | "female"
): VisualProfileHints {
  if ('corePersonality' in personality) {
    const partner = personality as PartnerPersonalityProfile;
    const vp = partner.visualProfile;
    const genderTerm = resolveGenderTerm(preferredGender || partner.gender);
    const ageDescriptor = cleanText(vp?.apparentAge) || formatAgeDescriptor(partner.age) || defaultAgeDescriptor(preferredGender);
    const occupation = cleanText(vp?.occupation);
    const outfit = cleanText(vp?.outfit) || "简洁的日常装束";
    const accessories = ((vp?.accessories ?? []) as Array<string | undefined>)
      .map((item) => cleanText(item))
      .filter((item): item is string => Boolean(item));
    const lighting = cleanText(vp?.lighting) || cleanText(vp?.timeOfDay) || "柔和自然光";
    const legacyPrimary = (vp as any)?.setting as string | undefined;
    const primaryScene = cleanText(vp?.primaryScene) || cleanText(legacyPrimary);
    const altCandidates = [vp?.secondaryScene, ...(vp?.additionalScenes ?? []), (vp as any)?.alternateScene] as Array<string | undefined>;
    const alternateScenes = altCandidates
      .map((item) => cleanText(item))
      .filter((item): item is string => Boolean(item));
    const moodKeywords = (vp?.moodKeywords ?? partner.corePersonality.primaryTraits.slice(0, 2))
      .map((item) => cleanText(item))
      .filter((item): item is string => Boolean(item));

    return {
      ageDescriptor,
      genderTerm,
      occupation,
      outfit,
      accessories,
      lighting,
      primaryScene,
      alternateScenes,
      moodKeywords,
    };
  }

  const legacy = personality as PersonalityProfile;
  const genderTerm = resolveGenderTerm(preferredGender);
  const moodKeywords = (legacy.keywords ?? []).slice(0, 2);

  return {
    ageDescriptor: defaultAgeDescriptor(preferredGender),
    genderTerm,
    occupation: undefined,
    outfit: "简洁的日常装束",
    accessories: [],
    lighting: "柔和自然光",
    primaryScene: undefined,
    alternateScenes: [],
    moodKeywords: moodKeywords.length ? moodKeywords : ["松弛感", "真实生活感"],
  };
}

function buildBaseInstructionFromHints(
  hints: VisualProfileHints,
  orientation: string,
  composition: string
): string {
  const occupationText = hints.occupation ? `，职业/身份：${hints.occupation}` : "";
  const outfitText = hints.outfit ? `，穿着${hints.outfit}` : "";
  const accessoriesText = hints.accessories.length ? `，可见${hints.accessories.join("、")}` : "";
  const lightingText = hints.lighting ? `，光线呈现${hints.lighting}` : "";
  const moodText = hints.moodKeywords.length ? `，氛围关键词：${hints.moodKeywords.join("、")}` : "";

  return `写实插画风格，${orientation}构图，人物为${hints.ageDescriptor}的${hints.genderTerm}${occupationText}${outfitText}${accessoriesText}。保持${composition}，场景简洁干净${lightingText}，画面仅出现这一位主角，禁止出现第二个清晰人物（背景人影需虚化不可辨认）。拒绝儿童化、老龄化、夸张漫画风、过度磨皮或商业滤镜${moodText}，整体表情放松自然。`;
}

/**
 * Build Flux image generation prompt from personality
 * Enhanced version supports both PersonalityProfile and PartnerPersonalityProfile
 */
export function buildFluxPrompt(
  personality: PersonalityProfile | PartnerPersonalityProfile
): string {
  // Check if it's PartnerPersonalityProfile
  const isPartnerProfile = 'corePersonality' in personality;
  
  if (isPartnerProfile) {
    const partner = personality as PartnerPersonalityProfile;
    return buildPartnerFluxPrompt(partner);
  }
  
  // Legacy PersonalityProfile
  const { name, tagline, keywords, communicationStyle, values, uniqueTraits } = personality as PersonalityProfile;
  const moodKeywords = keywords.slice(0, 3).join(", ");

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
 * Build enhanced Flux prompt from PartnerPersonalityProfile
 * Uses rich personality data to create more personalized visual description
 */
function buildPartnerFluxPrompt(partner: PartnerPersonalityProfile): string {
  const {
    name,
    nickname,
    vibe,
    tagline,
    corePersonality,
    emotionalSupport,
    communicationStyle,
    uniqueQualities,
  } = partner;

  // Extract visual characteristics from personality
  const primaryTraits = corePersonality.primaryTraits.slice(0, 4).join(", ");
  const emotionalMood = buildEmotionalMood(emotionalSupport);
  const expressionDetails = buildExpressionDetails(communicationStyle);
  const visualAtmosphere = buildVisualAtmosphere(corePersonality, vibe);
  const uniqueCharacteristics = uniqueQualities.strengths.slice(0, 2).join(", ");

  return `Portrait of "${name}" (${nickname}), an ideal partner embodying: ${tagline}.

Character essence: ${primaryTraits}
Personality vibe: ${vibe}
Emotional character: ${emotionalMood}
Expression style: ${expressionDetails}
Unique qualities: ${uniqueCharacteristics}

Visual appearance and atmosphere:
${visualAtmosphere}

Technical specifications:
- Ultra high quality, 8K resolution
- Photorealistic with artistic enhancement
- Soft, natural skin texture, expressive and warm eyes
- Professional color grading with emotional depth
- Masterpiece quality, intimate portrait composition

Avoid: overly cheerful expressions, bright neon colors, harsh lighting, generic stock photo look, cartoon style`;
}

/**
 * Build Doubao (豆包AI) prompt from personality profile
 * Produces Chinese realistic illustration instructions
 */
export function buildDoubaoPrompt(
  personality: PersonalityProfile | PartnerPersonalityProfile,
  sceneIndex: number = 0,
  aspectRatio: string = "9:16",
  preferredGender?: "male" | "female"
): string {
  const orientation = aspectRatio === "9:16" ? "竖版" : aspectRatio === "1:1" ? "方形" : "横版";
  const composition = aspectRatio === "9:16" ? "全身或大半身竖构图" : "带环境的宽幅构图";
  const hints = deriveVisualHints(personality, preferredGender);
  const baseInstruction = buildBaseInstructionFromHints(hints, orientation, composition);
  const isPartnerProfile = 'corePersonality' in personality;

  if (isPartnerProfile) {
    return buildPartnerDoubaoPrompt(
      personality as PartnerPersonalityProfile,
      hints,
      sceneIndex,
      baseInstruction,
      preferredGender
    );
  }

  return buildLegacyDoubaoPrompt(
    personality as PersonalityProfile,
    hints,
    sceneIndex,
    baseInstruction,
    preferredGender
  );
}

function buildPartnerDoubaoPrompt(
  partner: PartnerPersonalityProfile,
  hints: VisualProfileHints,
  sceneIndex: number,
  baseInstruction: string,
  preferredGender?: "male" | "female"
): string {
  const { name, nickname, vibe, corePersonality, lifestyleCompatibility } = partner;
  const traitSummary = corePersonality.primaryTraits.slice(0, 3).join("、") || corePersonality.primaryTraits.join("、");
  const lifestyle = lifestyleCompatibility?.dailyRhythm ? `日常节奏：${lifestyleCompatibility.dailyRhythm}。` : "";

  const derivedScenes = [
    hints.primaryScene ? ensureSoloDescription(hints.primaryScene, preferredGender) : undefined,
    ...hints.alternateScenes.map((scene) => ensureSoloDescription(scene, preferredGender)),
    ...getPartnerDoubaoScenes(partner, preferredGender),
  ].filter((item): item is string => Boolean(item));

  const scenes = derivedScenes.length ? derivedScenes : getDefaultDoubaoScenes(preferredGender);
  const scene = scenes[sceneIndex % scenes.length];
  const nameLabel = nickname ? `${name}（${nickname}）` : name;

  return `${baseInstruction}人物：${nameLabel}，性别设定：${hints.genderTerm}，整体气质：${vibe}，性格特质：${traitSummary}。${lifestyle}主要场景：${scene}。请保持姿态放松、表情真诚，与环境自然互动，让生活感自在流露。`;
}

function buildLegacyDoubaoPrompt(
  personality: PersonalityProfile,
  hints: VisualProfileHints,
  sceneIndex: number,
  baseInstruction: string,
  preferredGender?: "male" | "female"
): string {
  const fallbackScenes = getLegacyDoubaoScenes(personality, preferredGender);
  const scenes = [
    hints.primaryScene ? ensureSoloDescription(hints.primaryScene, preferredGender) : undefined,
    ...hints.alternateScenes.map((scene) => ensureSoloDescription(scene, preferredGender)),
    ...fallbackScenes,
  ].filter((item): item is string => Boolean(item));

  const sceneList = scenes.length ? scenes : getDefaultDoubaoScenes(preferredGender);
  const scene = sceneList[sceneIndex % sceneList.length];
  const moodKeywords = personality.keywords?.slice(0, 3).join("、") || personality.tagline;

  return `${baseInstruction}人物：${personality.name || hints.genderTerm}，气质关键词：${moodKeywords}。场景：${scene}。请让主体与环境自然互动，突出轻松真实的生活氛围。`;
}

function getPartnerDoubaoScenes(partner: PartnerPersonalityProfile, preferredGender?: "male" | "female"): string[] {
  const scenes: string[] = [];
  const { dailyLifeScenes, livingTogether, lifestyleCompatibility, uniqueQualities } = partner;

  const addScene = (text?: string, prefix?: string) => {
    if (!text) return;
    const clean = normalizeSceneText(text);
    if (!clean) return;
    scenes.push(prefix ? `${prefix}${ensureSoloDescription(clean, preferredGender)}` : ensureSoloDescription(clean, preferredGender));
  };

  addScene(dailyLifeScenes?.morningRoutine, "晨光厨房：");
  addScene(dailyLifeScenes?.quietMoments, "窗边时刻：");
  addScene(dailyLifeScenes?.weekendActivity, "周末慢生活：");
  addScene(dailyLifeScenes?.playfulMoments, "轻松互动：");
  addScene(livingTogether?.eveningScene, "傍晚客厅：");
  addScene(livingTogether?.weekendScene, "居家午后：");

  if (lifestyleCompatibility?.socialStyle) {
    scenes.push(ensureSoloDescription(`城市公共空间中，体现${normalizeSceneText(lifestyleCompatibility.socialStyle)}的社交方式`, preferredGender));
  }

  if (uniqueQualities?.strengths?.length) {
    scenes.push(ensureSoloDescription(`在个人擅长的领域中，展现${uniqueQualities.strengths.slice(0, 1).join("、")}特质的瞬间`, preferredGender));
  }

  const defaults = getDefaultDoubaoScenes(preferredGender);
  return scenes.length ? scenes : defaults;
}

function getLegacyDoubaoScenes(personality: PersonalityProfile, preferredGender?: "male" | "female"): string[] {
  const defaults = getDefaultDoubaoScenes(preferredGender);
  if (!personality.keywords?.length) {
    return defaults;
  }

  const scenes = [
    ensureSoloDescription(`午后靠窗的书桌，人物安静翻阅笔记`, preferredGender),
    ensureSoloDescription(`傍晚的公寓阳台，人物倚着栏杆望向城市`, preferredGender),
    ensureSoloDescription(`柔和灯光的客厅沙发，人物随手翻看杂志`, preferredGender),
  ];

  return scenes.length ? scenes : defaults;
}

function getDefaultDoubaoScenes(preferredGender?: "male" | "female"): string[] {
  return [
    ensureSoloDescription("清晨开放式厨房的阳光下，人物准备简单早餐", preferredGender),
    ensureSoloDescription("午后窗边的咖啡角，人物静静阅读", preferredGender),
    ensureSoloDescription("黄昏街区的石板路，人物手持咖啡缓步前行", preferredGender),
    ensureSoloDescription("夜晚客厅的柔光下，人物坐在沙发整理相册", preferredGender),
  ];
}

function ensureSoloDescription(scene: string, preferredGender?: "male" | "female"): string {
  const genderText = preferredGender === "female" ? "这位年轻女性" : preferredGender === "male" ? "这位年轻男性" : "这位年轻人";
  return `${scene}，场景保持简洁，画面仅聚焦${genderText}，不出现其他清晰角色`;
}

function normalizeSceneText(text: string): string {
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/^[\-*·•\s]+/, '')
    .trim();
}

/**
 * Build emotional mood description from emotional support patterns
 */
function buildEmotionalMood(emotionalSupport: PartnerPersonalityProfile['emotionalSupport']): string {
  const patterns = [
    emotionalSupport.whenYouAnxious,
    emotionalSupport.whenYouSad,
    emotionalSupport.whenYouHappy,
    emotionalSupport.dailySupport,
  ].join(" ").toLowerCase();

  if (patterns.includes("温柔") || patterns.includes("安静") || patterns.includes("稳定")) {
    return "gentle and stable presence, calming energy, serene emotional depth";
  }
  if (patterns.includes("活泼") || patterns.includes("快乐") || patterns.includes("开心")) {
    return "warm and cheerful energy, uplifting presence, joyful spirit";
  }
  if (patterns.includes("理性") || patterns.includes("分析") || patterns.includes("思考")) {
    return "thoughtful and composed, intelligent expression, calm wisdom";
  }
  if (patterns.includes("细腻") || patterns.includes("体贴") || patterns.includes("关怀")) {
    return "caring and attentive, empathetic expression, tender warmth";
  }
  return "emotionally resonant, authentic human expression, soulful presence";
}

/**
 * Build expression details from communication style
 */
function buildExpressionDetails(communicationStyle: PartnerPersonalityProfile['communicationStyle']): string {
  const speaking = communicationStyle.speakingPattern.toLowerCase();
  const listening = communicationStyle.listeningStyle.toLowerCase();
  const expression = communicationStyle.expressionStyle.toLowerCase();

  let details = "natural, authentic human expression, ";
  
  if (speaking.includes("温和") || speaking.includes("轻柔")) {
    details += "gentle smile, soft and warm eyes, ";
  } else if (speaking.includes("活泼") || speaking.includes("快")) {
    details += "bright and cheerful expression, sparkling eyes, ";
  } else if (speaking.includes("认真") || speaking.includes("专注")) {
    details += "serious and thoughtful gaze, focused eyes, ";
  }
  
  if (listening.includes("专注") || listening.includes("认真")) {
    details += "attentive listening posture, ";
  }
  
  if (expression.includes("行动") || expression.includes("细节")) {
    details += "practical and caring demeanor";
  } else if (expression.includes("言语") || expression.includes("话语")) {
    details += "expressive and communicative presence";
  } else {
    details += "warm and approachable presence";
  }
  
  return details;
}

/**
 * Build visual atmosphere from core personality
 */
function buildVisualAtmosphere(
  corePersonality: PartnerPersonalityProfile['corePersonality'],
  vibe: string
): string {
  const traits = corePersonality.primaryTraits.join(" ").toLowerCase();
  const attachmentStyle = corePersonality.attachmentStyle.toLowerCase();
  
  // Determine color palette based on personality
  let colorPalette = "Deep purples, soft pinks, cool blues";
  let lighting = "soft cinematic lighting with gentle glow";
  let mood = "introspective, serene, emotionally resonant";
  
  if (traits.includes("温柔") || traits.includes("温暖") || attachmentStyle.includes("安全")) {
    colorPalette = "Warm purples, soft pinks, golden amber accents";
    lighting = "warm, soft lighting with golden rim light";
    mood = "warm, comforting, emotionally safe";
  } else if (traits.includes("冷静") || traits.includes("理性") || attachmentStyle.includes("回避")) {
    colorPalette = "Cool blues, silver grays, soft whites";
    lighting = "cool, soft lighting with silver accents";
    mood = "calm, composed, peacefully distant";
  } else if (traits.includes("活泼") || traits.includes("外向")) {
    colorPalette = "Vibrant purples, coral pinks, sunset oranges";
    lighting = "warm, vibrant lighting with colorful rim light";
    mood = "energetic, warm, emotionally vibrant";
  }
  
  // Composition based on vibe
  let composition = "Medium portrait, eye-level, intimate connection";
  if (vibe.includes("神秘") || vibe.includes("深邃")) {
    composition = "Medium portrait, slightly elevated angle, mysterious and intriguing";
  } else if (vibe.includes("阳光") || vibe.includes("明亮")) {
    composition = "Medium portrait, eye-level, bright and open connection";
  }
  
  return `- Ethereal, dreamlike atmosphere with soft focus and depth of field
- ${lighting}
- Color palette: ${colorPalette} (OKLCH color space for natural tones)
- Mood: ${mood}
- Composition: ${composition}
- Background: Abstract, soft bokeh, starlight particles, atmospheric depth
- Aesthetic: Modern digital art meets classical portraiture, emotional realism`;
}

/**
 * Build SDXL image generation prompt (fallback)
 * Enhanced version supports both PersonalityProfile and PartnerPersonalityProfile
 */
export function buildSDXLPrompt(
  personality: PersonalityProfile | PartnerPersonalityProfile
): string {
  // Check if it's PartnerPersonalityProfile
  const isPartnerProfile = 'corePersonality' in personality;
  
  if (isPartnerProfile) {
    const partner = personality as PartnerPersonalityProfile;
    const primaryTraits = partner.corePersonality.primaryTraits.slice(0, 2).join(", ");
    const vibe = partner.vibe;
    
    return `Portrait of ${partner.name}, ${vibe}, ${primaryTraits}, ethereal digital art, soft lighting, deep purple and pink tones, dreamy atmosphere, high quality, cinematic, introspective mood, 8k, masterpiece`;
  }
  
  // Legacy PersonalityProfile
  const { name, keywords } = personality as PersonalityProfile;
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
 * Build simplified prompt for Pollinations (URL length limit ~2000 chars)
 * Enhanced version using partner personality data when available
 * PIXEL ART + ANIME STYLE + STORY SCENES
 */
export function buildPollinationsPrompt(
  personality: PersonalityProfile | PartnerPersonalityProfile,
  sceneIndex: number = 0,
  preferredGender?: "male" | "female"
): string {
  // Check if it's PartnerPersonalityProfile
  const isPartnerProfile = 'corePersonality' in personality;
  
  if (isPartnerProfile) {
    const partner = personality as PartnerPersonalityProfile;
    return buildPartnerPollinationsScenePrompt(partner, sceneIndex, preferredGender);
  }
  
  // Legacy PersonalityProfile
  const { name, keywords } = personality as PersonalityProfile;
  const mood = keywords.slice(0, 2).join(", ");
  
  const genderToken = preferredGender === "female" ? "solo female" : preferredGender === "male" ? "solo male" : "solo person";
  const scenes = [
    `${genderToken} ${name} in modern office, working at desk, ${mood}, professional setting, pixel art`,
    `${genderToken} ${name} in cozy cafe, reading book, ${mood}, warm lighting, pixel art`,
    `${genderToken} ${name} on city street, casual walking, ${mood}, urban setting, pixel art`,
    `${genderToken} ${name} in bookstore, browsing, ${mood}, soft lighting, pixel art`,
    `${genderToken} ${name} in park, enjoying nature, ${mood}, outdoor scene, pixel art`
  ];
  
  return scenes[sceneIndex % scenes.length];
}

/**
 * Build enhanced Pollinations scene prompt from PartnerPersonalityProfile
 * Pixel art + Anime style + Story-driven scenes
 */
function buildPartnerPollinationsScenePrompt(
  partner: PartnerPersonalityProfile, 
  sceneIndex: number = 0,
  preferredGender?: "male" | "female"
): string {
  const { name, nickname } = partner;
  
  // Generate different story scenes based on partner's life data
  const scenes = generateStoryScenes(partner);
  
  // Select scene by index (cycle through)
  const selectedScene = scenes[sceneIndex % scenes.length];
  const genderToken = preferredGender === "female" || partner.gender === "female"
    ? "solo female"
    : preferredGender === "male" || partner.gender === "male"
      ? "solo male"
      : "solo adult";

  // Build very concise prompt - maximum 100 characters to avoid URL issues
  // Use English as much as possible to reduce URL encoding overhead
  // Ensure young adult appearance (college age or above)
  let prompt = `Pixel art, ${genderToken} ${selectedScene}, young adult, 16-bit anime style, single character`;
  
  // If still too long, truncate scene description
  if (prompt.length > 100) {
    const sceneParts = selectedScene.split(',');
    const shortScene = sceneParts[0] + ', ' + (sceneParts[1] || ''); // First two parts
    prompt = `Pixel art, ${shortScene}, young adult, 16-bit`;
  }
  
  return prompt;
}

/**
 * Generate story scenes based on partner's life data
 * Diversified scenes based on personality, not limited to school
 */
function generateStoryScenes(partner: PartnerPersonalityProfile): string[] {
  const { 
    name, 
    nickname, 
    age,
    dailyLifeScenes, 
    livingTogether, 
    lifestyleCompatibility,
    uniqueQualities,
    deeperTraits
  } = partner;
  
  const scenes: string[] = [];
  
  // Determine age group (ensure high school or above)
  const ageGroup = inferAgeGroup(age);
  
  // Extract personality traits for scene diversity
  const traits = uniqueQualities.strengths.join(" ").toLowerCase();
  const socialStyle = lifestyleCompatibility.socialStyle?.toLowerCase() || "";
  const dailyRhythm = lifestyleCompatibility.dailyRhythm?.toLowerCase() || "";
  
  // Scene 1: Work/Study scene (varied based on personality)
  if (traits.includes("工作") || socialStyle.includes("职场") || dailyRhythm.includes("办公室")) {
    scenes.push(`${name} ${ageGroup} in modern office, working at desk with laptop`);
  } else if (dailyLifeScenes.morningRoutine?.includes("教室") || dailyLifeScenes.morningRoutine?.includes("学习")) {
    scenes.push(`${name} ${ageGroup} in university classroom, studying at desk`);
  } else {
    scenes.push(`${name} ${ageGroup} in cozy cafe, working on laptop`);
  }
  
  // Scene 2: Leisure/Reading scene (varied based on lifestyle)
  if (dailyLifeScenes.quietMoments?.includes("图书馆") || dailyLifeScenes.quietMoments?.includes("书店")) {
    scenes.push(`${name} ${ageGroup} in bookstore or library, reading quietly`);
  } else if (dailyLifeScenes.quietMoments?.includes("咖啡") || dailyLifeScenes.quietMoments?.includes("咖啡店")) {
    scenes.push(`${name} ${ageGroup} in cozy coffee shop, reading book`);
  } else if (traits.includes("艺术") || deeperTraits.hiddenTalents?.some(t => t.includes("画") || t.includes("艺术"))) {
    scenes.push(`${name} ${ageGroup} in art studio, painting or drawing`);
  } else {
    scenes.push(`${name} ${ageGroup} in park, reading on bench`);
  }
  
  // Scene 3: Social/Outdoor scene (varied based on social style)
  if (socialStyle.includes("散步") || socialStyle.includes("公园") || dailyLifeScenes.weekendActivity?.includes("公园")) {
    scenes.push(`${name} ${ageGroup} walking in city park, autumn leaves`);
  } else if (socialStyle.includes("购物") || dailyLifeScenes.weekendActivity?.includes("购物")) {
    scenes.push(`${name} ${ageGroup} in shopping district, casual stroll`);
  } else if (socialStyle.includes("运动") || dailyLifeScenes.weekendActivity?.includes("运动")) {
    scenes.push(`${name} ${ageGroup} in gym or sports center, exercising`);
  } else if (lifestyleCompatibility.hobbySharing?.includes("电影") || dailyLifeScenes.weekendActivity?.includes("电影")) {
    scenes.push(`${name} ${ageGroup} in cinema lobby, waiting for movie`);
  } else {
    scenes.push(`${name} ${ageGroup} on city street, casual walking`);
  }
  
  // Scene 4: Home/Cooking scene (if available)
  if (dailyLifeScenes.cookingTogether || dailyLifeScenes.weekendActivity?.includes("做饭")) {
    scenes.push(`${name} ${ageGroup} in modern kitchen, cooking together`);
  } else if (livingTogether.morningScene?.includes("早晨") || dailyLifeScenes.morningRoutine?.includes("早晨")) {
    scenes.push(`${name} ${ageGroup} in apartment, morning routine`);
  }
  
  // Scene 5: Evening/Night scene
  if (dailyLifeScenes.eveningRoutine?.includes("酒吧") || socialStyle.includes("酒吧")) {
    scenes.push(`${name} ${ageGroup} in cozy bar, evening drink`);
  } else if (dailyLifeScenes.eveningRoutine?.includes("散步") || livingTogether.eveningScene?.includes("散步")) {
    scenes.push(`${name} ${ageGroup} on evening street, city lights`);
  } else {
    scenes.push(`${name} ${ageGroup} in cozy apartment, evening relaxing`);
  }
  
  // If we don't have enough scenes, add diversified defaults
  if (scenes.length < 3) {
    // More adult/mature scenes
    if (scenes.length === 0) {
      scenes.push(`${name} ${ageGroup} in modern office, professional setting`);
      scenes.push(`${name} ${ageGroup} in bookstore cafe, reading`);
      scenes.push(`${name} ${ageGroup} on city street, urban setting`);
    } else if (scenes.length === 1) {
      scenes.push(`${name} ${ageGroup} in art gallery or museum`);
      scenes.push(`${name} ${ageGroup} in park, enjoying nature`);
    } else {
      scenes.push(`${name} ${ageGroup} in restaurant, dining`);
    }
  }
  
  return scenes.slice(0, 5); // Return up to 5 scenes
}

/**
 * Infer age group from age string (ensure high school or above)
 */
function inferAgeGroup(age: string): string {
  if (!age) return "young adult";
  
  const ageLower = age.toLowerCase();
  
  // High school age (16-18)
  if (ageLower.includes("高中") || ageLower.includes("16") || ageLower.includes("17") || ageLower.includes("18")) {
    return "high school student";
  }
  
  // University/College age (19-22)
  if (ageLower.includes("大学") || ageLower.includes("19") || ageLower.includes("20") || ageLower.includes("21") || ageLower.includes("22")) {
    return "university student";
  }
  
  // Young adult (23-30)
  if (ageLower.includes("23") || ageLower.includes("24") || ageLower.includes("25") || 
      ageLower.includes("26") || ageLower.includes("27") || ageLower.includes("28") || 
      ageLower.includes("29") || ageLower.includes("30") || ageLower.includes("年轻")) {
    return "young adult";
  }
  
  // Default: young adult (ensures at least high school age)
  return "young adult";
}

/**
 * Extract scene description from text (simplified extraction)
 * Keep it very short to avoid URL length issues
 */
function extractSceneFromText(text: string): string {
  if (!text) return "";
  
  // Keep it very short - max 40 characters to avoid URL issues
  const maxLength = 40;
  let scene = text.substring(0, maxLength);
  
  // Remove trailing incomplete sentences
  const lastPeriod = scene.lastIndexOf("。");
  const lastComma = scene.lastIndexOf("，");
  const lastSentence = Math.max(lastPeriod, lastComma);
  
  if (lastSentence > 10) {
    scene = scene.substring(0, lastSentence);
  }
  
  return scene.trim();
}

/**
 * Infer emotional mood from emotional support patterns
 */
function inferEmotionalMood(emotionalSupport: PartnerPersonalityProfile['emotionalSupport']): string {
  const patterns = [
    emotionalSupport.whenYouAnxious,
    emotionalSupport.whenYouSad,
    emotionalSupport.whenYouHappy,
  ].join(" ").toLowerCase();
  
  if (patterns.includes("温柔") || patterns.includes("安静") || patterns.includes("稳定")) {
    return "gentle, serene";
  }
  if (patterns.includes("活泼") || patterns.includes("快乐") || patterns.includes("开心")) {
    return "warm, cheerful";
  }
  if (patterns.includes("理性") || patterns.includes("分析") || patterns.includes("思考")) {
    return "thoughtful, calm";
  }
  return "emotionally resonant";
}

/**
 * Infer expression style from communication style
 */
function inferExpressionStyle(communicationStyle: PartnerPersonalityProfile['communicationStyle']): string {
  const speaking = communicationStyle.speakingPattern.toLowerCase();
  
  if (speaking.includes("温和") || speaking.includes("轻柔") || speaking.includes("慢")) {
    return "gentle smile, warm eyes";
  }
  if (speaking.includes("活泼") || speaking.includes("快") || speaking.includes("兴奋")) {
    return "bright expression, sparkling eyes";
  }
  if (speaking.includes("认真") || speaking.includes("专注") || speaking.includes("深沉")) {
    return "serious expression, thoughtful gaze";
  }
  return "natural expression, expressive eyes";
}

/**
 * Infer visual style from core personality and vibe
 */
function inferVisualStyle(
  corePersonality: PartnerPersonalityProfile['corePersonality'],
  vibe: string
): string {
  const traits = corePersonality.primaryTraits.join(" ").toLowerCase();
  const style = corePersonality.attachmentStyle.toLowerCase();
  
  // Color palette based on personality
  let colorPalette = "deep purple and pink tones";
  
  if (traits.includes("温柔") || traits.includes("温暖") || style.includes("安全")) {
    colorPalette = "warm purples, soft pinks, golden accents";
  } else if (traits.includes("冷静") || traits.includes("理性") || style.includes("回避")) {
    colorPalette = "cool blues, silver tones, soft grays";
  } else if (traits.includes("活泼") || traits.includes("外向")) {
    colorPalette = "vibrant purples, coral pinks, sunset tones";
  }
  
  return `ethereal digital art, ${colorPalette}, dreamy bokeh`;
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

