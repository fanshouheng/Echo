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
  
  // 提取人物描述部分（从原始提示词中提取人物的动作/状态描述）
  // 提取"。"后到"色调"或"氛围"之前的部分，排除场景描述
  const parts = originalPrompt.split("。");
  let characterDescription = "";
  
  if (parts.length > 1) {
    const scenePart = parts[1]; // 场景描述后的部分
    // 提取人物相关的描述（在场景描述之后，色调之前）
    // 格式通常是：场景描述，人物动作/状态，色调，氛围
    const sceneEndIndex = scenePart.indexOf("，色调") || scenePart.indexOf("色调");
    if (sceneEndIndex > 0) {
      // 提取场景描述后的部分（人物描述）
      const afterScene = scenePart.substring(sceneEndIndex - 20, sceneEndIndex).trim();
      // 尝试提取人物描述（去掉场景描述）
      const characterMatch = afterScene.match(/([^，]+(?:(?:女孩|青年|年轻人)[^，]*)?)/);
      if (characterMatch && characterMatch[1]) {
        characterDescription = characterMatch[1].trim();
        // 如果包含场景关键词，去掉
        const sceneKeywords = ["厨房", "咖啡", "书店", "客厅", "公园", "窗边", "阳台", "书房"];
        if (sceneKeywords.some(keyword => characterDescription.includes(keyword))) {
          characterDescription = `${genderTerm}在其中`;
        }
      }
    }
  }
  
  // 如果没有提取到特征，使用通用描述
  if (!characterDescription || characterDescription.length < 5) {
    characterDescription = `${genderTerm}在其中`;
  }
  
  return { stylePart, genderTerm, characterDescription };
}

const SCENE_VARIATION_SYSTEM_PROMPT = `你是一个专业的AI图像生成提示词设计师。你的任务是根据人物的人格档案，生成丰富多样、有创意的场景描述，用于生成新的形象图片。

**核心要求：**
1. 根据人格档案中的信息（性格特质、兴趣爱好、生活方式、日常活动等），生成多样化的场景描述
2. 场景要丰富多样，不要局限于室内日常场景（如卧室、厨房、咖啡厅）
3. 可以包括：
   - 户外场景：公园、街道、商场、书店、电影院、游戏厅、网吧、便利店、地铁站等
   - 特殊天气：雨天、晴天、傍晚、夜晚等
   - 不同活动：购物、娱乐、学习、工作、休闲、社交等
   - 不同情绪：放松、专注、开心、安静等
4. 每次必须生成完全不同的场景，避免重复（特别是当场景索引不同时）
5. 场景要符合人物的性格特质和生活方式
6. 只输出场景描述部分，不要包含其他内容

**输出格式：**
- 简洁的场景描述，包含时间、地点、人物动作
- 控制在15-25字之间
- 格式示例：
  - "下雨天在商场下避雨"
  - "在网吧专注打游戏"
  - "在游戏厅抓娃娃"
  - "午后的书店，安静挑选书籍"
  - "夜晚的便利店，购买零食"
  - "傍晚的公园，慢慢散步"
  - "电影院的出口，看完电影后"
  - "地铁站台，等待地铁"
  - "超市的货架前，挑选商品"
- 不要包含"保持形象不变"、"色调温暖"等提示词部分

**示例（正确的输出）：**
- "下雨天在商场下避雨"
- "在网吧专注打游戏"
- "在游戏厅抓娃娃"
- "午后的书店，安静挑选书籍"
- "夜晚的便利店，购买零食"
- "傍晚的公园，慢慢散步"

只输出场景描述，不要加任何说明文字或其他内容。`;

/**
 * 使用 DeepSeek 根据人格档案生成新的场景描述
 */
async function generateSceneFromPersonality(
  partner: PartnerPersonalityProfile,
  originalPrompt: string,
  sceneIndex: number
): Promise<string> {
  const { stylePart, genderTerm, characterDescription } = extractCharacterFeatures(originalPrompt);
  
  // 收集人格档案中的所有场景信息
  const sceneSources: string[] = [];
  
  if (partner.dailyLifeScenes) {
    if (partner.dailyLifeScenes.morningRoutine) sceneSources.push(`早晨：${partner.dailyLifeScenes.morningRoutine}`);
    if (partner.dailyLifeScenes.eveningRoutine) sceneSources.push(`晚上：${partner.dailyLifeScenes.eveningRoutine}`);
    if (partner.dailyLifeScenes.weekendActivity) sceneSources.push(`周末：${partner.dailyLifeScenes.weekendActivity}`);
    if (partner.dailyLifeScenes.cookingTogether) sceneSources.push(`一起做饭：${partner.dailyLifeScenes.cookingTogether}`);
    if (partner.dailyLifeScenes.quietMoments) sceneSources.push(`安静时刻：${partner.dailyLifeScenes.quietMoments}`);
    if (partner.dailyLifeScenes.playfulMoments) sceneSources.push(`轻松时刻：${partner.dailyLifeScenes.playfulMoments}`);
  }
  
  if (partner.livingTogether) {
    if (partner.livingTogether.morningScene) sceneSources.push(`共同生活早晨：${partner.livingTogether.morningScene}`);
    if (partner.livingTogether.eveningScene) sceneSources.push(`共同生活晚上：${partner.livingTogether.eveningScene}`);
    if (partner.livingTogether.weekendScene) sceneSources.push(`共同生活周末：${partner.livingTogether.weekendScene}`);
    if (partner.livingTogether.sharedActivities && partner.livingTogether.sharedActivities.length > 0) {
      sceneSources.push(`共同活动：${partner.livingTogether.sharedActivities.slice(0, 5).join("、")}`);
    }
  }
  
  if (partner.visualProfile) {
    if (partner.visualProfile.primaryScene) sceneSources.push(`主要场景：${partner.visualProfile.primaryScene}`);
    if (partner.visualProfile.secondaryScene) sceneSources.push(`次要场景：${partner.visualProfile.secondaryScene}`);
    if (partner.visualProfile.additionalScenes && partner.visualProfile.additionalScenes.length > 0) {
      sceneSources.push(`其他场景：${partner.visualProfile.additionalScenes.slice(0, 3).join("、")}`);
    }
  }
  
  // 添加兴趣爱好和生活方式信息，用于生成更丰富的场景
  if (partner.lifestyleCompatibility?.hobbySharing) {
    sceneSources.push(`兴趣爱好：${partner.lifestyleCompatibility.hobbySharing}`);
  }
  if (partner.deeperTraits?.hiddenTalents && partner.deeperTraits.hiddenTalents.length > 0) {
    sceneSources.push(`隐藏才能：${partner.deeperTraits.hiddenTalents.slice(0, 3).join("、")}`);
  }
  if (partner.uniqueQualities?.strengths && partner.uniqueQualities.strengths.length > 0) {
    sceneSources.push(`特长：${partner.uniqueQualities.strengths.slice(0, 3).join("、")}`);
  }
  
  // 如果没有场景信息，使用生活方式信息
  if (sceneSources.length === 0) {
    if (partner.lifestyleCompatibility?.dailyRhythm) {
      sceneSources.push(`生活节奏：${partner.lifestyleCompatibility.dailyRhythm}`);
    }
    if (partner.lifestyleCompatibility?.hobbySharing) {
      sceneSources.push(`共同爱好：${partner.lifestyleCompatibility.hobbySharing}`);
    }
  }
  
  // 根据 sceneIndex 选择场景类型类别，确保多样性
  const sceneTypeCategories = [
    // 0-2: 户外商业场景
    ["商场", "书店", "电影院", "游戏厅", "超市", "花店"],
    // 3-5: 娱乐休闲场景
    ["网吧", "KTV", "咖啡厅", "甜品店", "餐厅", "酒吧"],
    // 6-8: 交通和公共空间
    ["地铁站", "公交站", "机场", "火车站", "公园", "广场"],
    // 9-11: 特殊天气和时间
    ["雨天", "雪天", "傍晚", "夜晚", "清晨", "午后"],
    // 12+: 创意和特殊场景
    ["便利店", "图书馆", "博物馆", "展览馆", "工作室", "天台"],
  ];
  
  const categoryIndex = Math.floor(sceneIndex / 3) % sceneTypeCategories.length;
  const suggestedTypes = sceneTypeCategories[categoryIndex];
  
  // 根据 sceneIndex 在类别内选择具体场景类型（确保每次不同）
  const typeIndexInCategory = sceneIndex % suggestedTypes.length;
  const selectedType = suggestedTypes[typeIndexInCategory];
  
  const userPrompt = `请为以下人物生成一个新的场景描述（场景索引：${sceneIndex}，**必须生成与之前完全不同的场景**）：

**人物信息：**
- 名字：${partner.name}（${partner.nickname}）
- 性别：${partner.gender === "female" ? "女孩" : partner.gender === "male" ? "青年" : "年轻人"}
- 性格特质：${partner.corePersonality.primaryTraits.slice(0, 3).join("、")}
- 生活方式：${partner.lifestyleCompatibility?.dailyRhythm || "日常"}
- 兴趣爱好：${partner.lifestyleCompatibility?.hobbySharing || partner.deeperTraits?.hiddenTalents?.slice(0, 3).join("、") || "日常活动"}

**可用场景信息：**
${sceneSources.length > 0 ? sceneSources.map((s, idx) => `${idx + 1}. ${s}`).join("\n") : "日常生活场景"}

**原始首次场景：**
${originalPrompt.split("。")[1]?.split("，")[0] || "午后窗边的咖啡角"}

**场景索引 ${sceneIndex} 的强制要求：**
根据场景索引 ${sceneIndex}，**必须**使用场景类型："${selectedType}"（这是索引 ${sceneIndex} 的强制要求，不能选择其他场景类型！）

**场景类型 "${selectedType}" 的示例场景：**
${(() => {
  let example = "";
  if (selectedType === '商场') example = '下雨天在商场下避雨';
  else if (selectedType === '网吧') example = '在网吧专注打游戏';
  else if (selectedType === '游戏厅') example = '在游戏厅抓娃娃';
  else if (selectedType === '地铁站') example = '地铁站台等待地铁';
  else if (selectedType === '便利店') example = '夜晚的便利店购买零食';
  else if (selectedType === '雨天') example = '下雨天在商场下避雨';
  else if (selectedType === '公园') example = '公园里慢慢散步';
  else if (selectedType === '书店') example = '书店里安静阅读';
  else if (selectedType === '电影院') example = '电影院看完电影后';
  else if (selectedType === '咖啡厅') example = '咖啡厅里享受下午茶';
  else if (selectedType === 'KTV') example = 'KTV包厢里唱歌';
  else if (selectedType === '超市') example = '超市里挑选商品';
  else if (selectedType === '花店') example = '花店里挑选鲜花';
  else if (selectedType === '甜品店') example = '甜品店里品尝甜点';
  else if (selectedType === '餐厅') example = '餐厅里用餐';
  else if (selectedType === '酒吧') example = '酒吧里小酌';
  else if (selectedType === '公交站') example = '公交站等待公交车';
  else if (selectedType === '机场') example = '机场候机厅';
  else if (selectedType === '火车站') example = '火车站候车室';
  else if (selectedType === '广场') example = '广场上漫步';
  else example = `在${selectedType}...`;
  return `示例："${example}"`;
})()}

**重要要求：**
1. **必须使用场景类型 "${selectedType}"**，不能选择其他场景类型！不能将 "${selectedType}" 与其他场景类型组合（如"商场书店"、"电影院书店"等）
2. **场景描述必须明确包含 "${selectedType}"** 这个关键词
3. 可以根据人物的兴趣爱好和性格特质，在 "${selectedType}" 场景类型下自由发挥生成有趣的场景（如"下雨天在商场下避雨"、"在网吧专注打游戏"、"在游戏厅抓娃娃"等）
4. 场景要符合人物的性格特质、兴趣爱好和生活方式，但场景类型必须是 "${selectedType}"，不能更改
5. 只输出场景描述部分（如"下雨天在商场下避雨"、"在网吧专注打游戏"、"在游戏厅抓娃娃"），不要包含其他内容
6. 要具体、有画面感，包含时间、地点、人物动作`;

  try {
    const sceneDescription = await generateCompletion(
      [
        {
          role: "system",
          content: SCENE_VARIATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      {
        temperature: 1.0, // 提高到 1.0，让场景更有创意和多样性
        maxTokens: 200,
        enableThinking: false,
      }
    );

    // 清理输出：去掉可能的markdown标记和多余文字
    let cleanedScene = sceneDescription
      .trim()
      .replace(/^```(?:json|text)?\s*\n?/g, '')
      .replace(/\n?```\s*$/g, '')
      .replace(/^场景描述[：:]\s*/g, '')
      .replace(/^生成的场景[：:]\s*/g, '')
      .replace(/^场景[：:]\s*/g, '')
      .trim();
    
    // 移除可能包含的原始提示词内容
    // 如果包含了原始提示词中的场景描述，只保留新生成的场景部分
    const originalScenePart = originalPrompt.split("。")[1]?.split("，")[0] || "";
    if (originalScenePart && cleanedScene.includes(originalScenePart)) {
      // 如果包含了原始场景，尝试提取后面的部分
      const index = cleanedScene.indexOf(originalScenePart);
      if (index > 0) {
        cleanedScene = cleanedScene.substring(index + originalScenePart.length).trim();
        // 去除可能的逗号
        cleanedScene = cleanedScene.replace(/^[，,]\s*/, '').trim();
      }
    }
    
    // 如果清理后的场景描述包含了提示词部分，提取核心场景部分
    // 去掉"保持形象不变"、"色调温暖"等提示词部分
    if (cleanedScene.includes("，保持形象不变") || cleanedScene.includes("保持形象不变")) {
      cleanedScene = cleanedScene.split("，保持形象不变")[0].split("保持形象不变")[0].trim();
    }
    if (cleanedScene.includes("，色调温暖") || cleanedScene.includes("色调温暖")) {
      cleanedScene = cleanedScene.split("，色调温暖")[0].split("色调温暖")[0].trim();
    }
    if (cleanedScene.includes("，氛围真实自然") || cleanedScene.includes("氛围真实自然")) {
      cleanedScene = cleanedScene.split("，氛围真实自然")[0].split("氛围真实自然")[0].trim();
    }
    
    // 移除可能包含的原始提示词中的其他内容（如"安静阅读"等动作描述）
    // 这些应该由新场景描述本身包含
    const originalActionKeywords = originalPrompt.match(/[，,]([^，,]+(?:阅读|思考|整理|准备|工作|休息)[^，,]*) /);
    if (originalActionKeywords && originalActionKeywords[1]) {
      cleanedScene = cleanedScene.replace(new RegExp(originalActionKeywords[1].trim(), 'g'), '').trim();
      // 清理多余的逗号
      cleanedScene = cleanedScene.replace(/^[，,]\s*/, '').replace(/\s*[，,]\s*$/, '').trim();
    }
    
    // 确保场景描述不为空
    if (!cleanedScene || cleanedScene.length < 5) {
      throw new Error("生成的场景描述为空或过短");
    }

    return `写实插画，${stylePart}。${cleanedScene}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  } catch (error) {
    console.error("❌ DeepSeek 生成场景失败:", error);
    // Fallback: 使用人格档案中的场景信息
    return generateFallbackSceneVariation(partner, originalPrompt, sceneIndex);
  }
}

/**
 * Fallback: 基于人格档案中的场景信息生成场景变化
 */
function generateFallbackSceneVariation(
  partner: PartnerPersonalityProfile,
  originalPrompt: string,
  sceneIndex: number
): string {
  const { stylePart, genderTerm, characterDescription } = extractCharacterFeatures(originalPrompt);
  
  // 收集所有场景信息
  const scenes: string[] = [];
  
  if (partner.dailyLifeScenes) {
    if (partner.dailyLifeScenes.morningRoutine) scenes.push(`清晨：${partner.dailyLifeScenes.morningRoutine}`);
    if (partner.dailyLifeScenes.eveningRoutine) scenes.push(`夜晚：${partner.dailyLifeScenes.eveningRoutine}`);
    if (partner.dailyLifeScenes.weekendActivity) scenes.push(`周末：${partner.dailyLifeScenes.weekendActivity}`);
    if (partner.dailyLifeScenes.quietMoments) scenes.push(`安静时刻：${partner.dailyLifeScenes.quietMoments}`);
    if (partner.dailyLifeScenes.playfulMoments) scenes.push(`轻松时刻：${partner.dailyLifeScenes.playfulMoments}`);
  }
  
  if (partner.livingTogether) {
    if (partner.livingTogether.morningScene) scenes.push(`共同生活早晨：${partner.livingTogether.morningScene}`);
    if (partner.livingTogether.eveningScene) scenes.push(`共同生活夜晚：${partner.livingTogether.eveningScene}`);
    if (partner.livingTogether.weekendScene) scenes.push(`共同生活周末：${partner.livingTogether.weekendScene}`);
  }
  
  if (partner.visualProfile) {
    if (partner.visualProfile.secondaryScene) scenes.push(`次要场景：${partner.visualProfile.secondaryScene}`);
    if (partner.visualProfile.additionalScenes && partner.visualProfile.additionalScenes.length > 0) {
      partner.visualProfile.additionalScenes.forEach(s => scenes.push(`其他场景：${s}`));
    }
  }
  
  // 如果没有场景信息，使用默认场景
  if (scenes.length === 0) {
    const defaultScenes = [
      "清晨的窗边，静坐思考",
      "午后的咖啡角，安静阅读",
      "黄昏的客厅，放松休息",
      "夜晚的书房，专注工作",
    ];
    const selectedScene = defaultScenes[sceneIndex % defaultScenes.length];
    return `写实插画，${stylePart}。${selectedScene}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  }
  
  // 根据 sceneIndex 选择场景（循环使用）
  const selectedSceneInfo = scenes[sceneIndex % scenes.length];
  // 提取场景描述（去掉前缀）
  const sceneDescription = selectedSceneInfo.split("：")[1] || selectedSceneInfo;
  
  return `写实插画，${stylePart}。${sceneDescription}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
}

/**
 * 生成后续场景的提示词（基于首次提示词修改）
 * 保持人物形象不变，只更换场景、光线、穿搭等
 * @param originalPrompt 首次生成的提示词
 * @param newSceneDescription 新的场景描述（可选）
 * @param userInput 用户自定义输入（可选）
 * @param sceneIndex 场景索引，用于生成不同的场景变化（可选）
 * @param partner 人格档案数据（可选，如果提供则基于人格档案生成场景）
 */
export async function generateSceneVariationPrompt(
  originalPrompt: string,
  newSceneDescription?: string,
  userInput?: string,
  sceneIndex: number = 0,
  partner?: PartnerPersonalityProfile
): Promise<string> {
  const { stylePart, genderTerm, characterDescription } = extractCharacterFeatures(originalPrompt);
  
  // 优先使用用户输入
  if (userInput && userInput.trim()) {
    return `写实插画，${stylePart}。${userInput.trim()}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  }
  
  // 如果有新的场景描述，替换场景部分
  if (newSceneDescription && newSceneDescription.trim()) {
    return `写实插画，${stylePart}。${newSceneDescription.trim()}，${characterDescription}，保持形象不变，只更换场景和穿搭，色调温暖，氛围真实自然，画面仅出现这一位主角。`;
  }
  
  // 如果提供了人格档案，使用 DeepSeek 根据人格档案生成场景
  if (partner) {
    return await generateSceneFromPersonality(partner, originalPrompt, sceneIndex);
  }
  
  // Fallback: 使用简单程序生成
  return generateFallbackSceneVariation(partner || {} as any, originalPrompt, sceneIndex);
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

