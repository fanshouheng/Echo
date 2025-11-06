/**
 * Generate Image Prompt using DeepSeek
 * 使用 DeepSeek 生成形象生图的提示词
 */

import { generateCompletion } from "@/lib/api/openai";
import { PartnerPersonalityProfile } from "@/types/partner-personality";
import { backgroundImagePrompts } from "@/data/background-image-prompts";

const IMAGE_PROMPT_SYSTEM_PROMPT = `你是一个专业的AI图像生成提示词设计师。你的任务是根据人物的人格档案，生成简洁、准确、有创意的图像生成提示词。

**风格参考（以下9个提示词展示了我们期望的风格和格式）：**

${backgroundImagePrompts.map((bg, i) => `${i + 1}. ${bg.prompt}`).join('\n\n')}

**提示词要求：**

1. **格式简洁**：参考上面的示例，使用"写实插画，[构图]，[光线]。[场景描述]，[人物动作]，色调[描述]，氛围[描述]。"的格式
2. **构图**：根据aspectRatio选择：
   - 9:16 → "竖版" 
   - 16:9 → "横版"
   - 1:1 → "方形"
3. **光线**：根据场景时间自然描述（如"柔和自然光"、"黄昏金色光线"、"午后柔和光线"等）
4. **场景描述**：简洁描述场景环境，1-2句话
5. **人物描述**：根据性别和人格特质，描述人物在场景中的动作和状态
6. **色调和氛围**：简洁描述整体的色调和氛围感
7. **单人物**：必须强调"画面仅出现这一位主角"，不出现其他清晰人物

**输出要求：**
- 只输出提示词，不要加任何说明文字
- 提示词长度控制在50-100字之间
- 必须使用中文
- 保持与参考示例相似的简洁风格`;

/**
 * 使用 DeepSeek 生成首次形象提示词
 */
export async function generateInitialImagePrompt(
  partner: PartnerPersonalityProfile,
  aspectRatio: string = "9:16"
): Promise<string> {
  const orientation = aspectRatio === "9:16" ? "竖版" : aspectRatio === "16:9" ? "横版" : "方形";
  const genderTerm = partner.gender === "female" ? "女孩" : partner.gender === "male" ? "青年" : "年轻人";
  
  const userPrompt = `请为以下人物生成一个形象生图的提示词：

**人物信息：**
- 名字：${partner.name}（${partner.nickname}）
- 性别：${genderTerm}
- 年龄：${partner.age}
- 整体气质：${partner.vibe}
- 性格特质：${partner.corePersonality.primaryTraits.slice(0, 3).join("、")}
- 生活节奏：${partner.lifestyleCompatibility?.dailyRhythm || "日常"}
- 典型场景：${partner.dailyLifeScenes?.morningRoutine || partner.dailyLifeScenes?.quietMoments || "日常生活场景"}

**构图要求：**
- 使用"${orientation}"构图

请根据这个人物的人格特质，参考上面提供的9个示例风格，生成一个简洁、真实、有生活感的图像提示词。选择一个最能体现人物性格特质的场景。`;

  try {
    console.log("🎨 使用 DeepSeek 生成首次形象提示词...");
    
    const prompt = await generateCompletion(
      [
        {
          role: "system",
          content: IMAGE_PROMPT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      {
        temperature: 0.8, // 稍微高一点，让提示词更有创意
        maxTokens: 500,
        enableThinking: false, // 不需要推理模式，速度快一点
      }
    );

    // 清理输出：去掉可能的markdown标记和多余文字
    const cleanedPrompt = prompt
      .trim()
      .replace(/^```(?:json|text)?\s*\n?/g, '')
      .replace(/\n?```\s*$/g, '')
      .replace(/^提示词[：:]\s*/g, '')
      .replace(/^生成的提示词[：:]\s*/g, '')
      .trim();

    return cleanedPrompt;
  } catch (error) {
    console.error("❌ DeepSeek 生成提示词失败:", error);
    // Fallback to default prompt
    return generateFallbackPrompt(partner, aspectRatio);
  }
}

/**
 * 从首次提示词中提取人物形象特征
 * 用于后续场景生成时保持形象一致性
 */
function extractCharacterFeatures(originalPrompt: string): {
  stylePart: string;
  genderTerm: string;
  characterDescription: string;
} {
  // 提取风格部分（写实插画，构图，光线）
  const styleMatch = originalPrompt.match(/写实插画，([^。]+)/);
  const stylePart = styleMatch ? styleMatch[1] : "竖版构图，柔和自然光";
  
  // 提取人物性别词汇
  let genderTerm = "年轻人";
  if (originalPrompt.includes("女孩") || originalPrompt.includes("年轻女性") || originalPrompt.includes("女性")) {
    genderTerm = "女孩";
  } else if (originalPrompt.includes("青年") || originalPrompt.includes("年轻男性") || originalPrompt.includes("男性")) {
    genderTerm = "青年";
  }
  
  // 提取人物描述部分（尝试从提示词中提取人物的外貌、动作等特征）
  // 通常格式：场景描述，人物动作/状态，色调，氛围
  const parts = originalPrompt.split("。");
  let characterDescription = "";
  
  if (parts.length > 1) {
    const scenePart = parts[1]; // 场景描述后的部分
    // 尝试提取人物相关的描述（可能包含外貌、动作等）
    const characterMatch = scenePart.match(/([^，]+，)?.*?(女孩|青年|年轻人).*?/);
    if (characterMatch) {
      // 保留人物特征描述，去除场景部分
      characterDescription = scenePart
        .replace(/[^，]*厨房[^，]*/g, "")
        .replace(/[^，]*咖啡[^，]*/g, "")
        .replace(/[^，]*书店[^，]*/g, "")
        .replace(/[^，]*客厅[^，]*/g, "")
        .replace(/[^，]*公园[^，]*/g, "")
        .replace(/午后|黄昏|夜晚/g, "")
        .trim();
    }
  }
  
  // 如果没有提取到特征，使用通用描述
  if (!characterDescription || characterDescription.length < 10) {
    characterDescription = `${genderTerm}在其中`;
  }
  
  return { stylePart, genderTerm, characterDescription };
}

/**
 * 生成后续场景的提示词（基于首次提示词修改）
 * 保持人物形象不变，只更换场景、光线、穿搭等
 * @param originalPrompt 首次生成的提示词
 * @param newSceneDescription 新的场景描述（可选）
 * @param userInput 用户自定义输入（可选）
 * @param sceneIndex 场景索引，用于生成不同的场景变化（可选）
 */
export function generateSceneVariationPrompt(
  originalPrompt: string,
  newSceneDescription?: string,
  userInput?: string,
  sceneIndex: number = 0
): string {
  const { stylePart, genderTerm, characterDescription } = extractCharacterFeatures(originalPrompt);
  
  // 优先使用用户输入
  if (userInput && userInput.trim()) {
    return `写实插画，${stylePart}。${userInput.trim()}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  }
  
  // 如果有新的场景描述，替换场景部分
  if (newSceneDescription && newSceneDescription.trim()) {
    return `写实插画，${stylePart}。${newSceneDescription.trim()}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  }
  
  // 如果没有新输入，基于原始提示词生成不同的场景变化
  // 提取场景描述（在第一个句号后的部分，到第一个逗号前）
  const promptAfterStyle = originalPrompt.split("。")[1]; // 获取"。"后的内容
  let baseScene = promptAfterStyle ? promptAfterStyle.split("，")[0] : "日常生活场景";
  
  // 如果场景太复杂，简化为核心场景词
  if (baseScene.includes("厨房")) {
    baseScene = "开放式厨房";
  } else if (baseScene.includes("咖啡")) {
    baseScene = "咖啡角";
  } else if (baseScene.includes("书店")) {
    baseScene = "书店";
  } else if (baseScene.includes("客厅")) {
    baseScene = "客厅";
  } else if (baseScene.includes("公园")) {
    baseScene = "公园";
  } else if (baseScene.includes("窗边")) {
    baseScene = "窗边";
  } else if (baseScene.includes("阳台")) {
    baseScene = "阳台";
  } else if (baseScene.includes("书房")) {
    baseScene = "书房";
  }
  
  // 定义不同的场景变化组合
  const sceneVariations = [
    { time: "午后", action: "安静阅读" },
    { time: "黄昏", action: "慢慢踱步" },
    { time: "夜晚", action: "静坐思考" },
    { time: "清晨", action: "准备早餐" },
    { time: "午后", action: "专注工作" },
    { time: "黄昏", action: "放松休息" },
    { time: "夜晚", action: "独自沉思" },
    { time: "午后", action: "享受时光" },
    { time: "黄昏", action: "整理物品" },
  ];
  
  // 根据 sceneIndex 选择场景变化（循环使用）
  const variation = sceneVariations[sceneIndex % sceneVariations.length];
  
  // 生成多种不同的场景描述
  const sceneDescriptions = [
    `${variation.time}的${baseScene}，${variation.action}`,
    `${variation.time}时分，${baseScene}一角`,
    `${baseScene}，${variation.time}的光线透过窗户`,
    `${variation.time}的${baseScene}，${variation.action}`,
    `${baseScene}，${variation.time}的静谧时光`,
  ];
  
  const selectedScene = sceneDescriptions[sceneIndex % sceneDescriptions.length];
  
  return `写实插画，${stylePart}。${selectedScene}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
}

/**
 * Fallback: 如果 DeepSeek 失败，使用简单的程序生成
 */
function generateFallbackPrompt(
  partner: PartnerPersonalityProfile,
  aspectRatio: string
): string {
  const orientation = aspectRatio === "9:16" ? "竖版" : aspectRatio === "16:9" ? "横版" : "方形";
  const genderTerm = partner.gender === "female" ? "女孩" : partner.gender === "male" ? "青年" : "年轻人";
  const scene = partner.dailyLifeScenes?.morningRoutine 
    ? partner.dailyLifeScenes.morningRoutine 
    : partner.dailyLifeScenes?.quietMoments 
    ? partner.dailyLifeScenes.quietMoments 
    : "日常生活场景";
  
  return `写实插画，${orientation}构图，柔和自然光。${scene}，${genderTerm}在其中，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
}

