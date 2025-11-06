/**
 * Generate Image Prompt using DeepSeek
 * 使用 DeepSeek 生成形象生图的提示词
 */

import { generateCompletion } from "@/lib/api/openai";
import { PartnerPersonalityProfile } from "@/types/partner-personality";
import { backgroundImagePrompts } from "@/data/background-image-prompts";

const IMAGE_PROMPT_SYSTEM_PROMPT = `你是一个专业的AI图像生成提示词设计师。你的任务是根据人物的人格档案，生成详细、具体、有画面感的图像生成提示词。

**参考模板（这是理想的提示词风格）：**
"风格插画，日式动漫脸，日本街道上，天空阴沉，下着细雨，女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞，小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视。"

**模板结构分析：**
1. **风格**：风格插画，日式动漫脸
2. **场景**：日本街道上，天空阴沉，下着细雨（包含环境、天气、时间）
3. **人物外观**：女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞（详细描述人物外观、服装、配饰）
4. **动作**：她侧着身子蹲下，给一只小猫打伞（具体的人物动作和姿势）
5. **细节**：小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视（场景中的其他元素和互动）

**提示词要求：**

1. **格式结构**：按照以下顺序组织提示词
   - 风格描述（如"写实插画"、"风格插画"）
   - 构图（根据aspectRatio：9:16→"竖版"，16:9→"横版"，1:1→"方形"）
   - 场景描述（地点、环境、天气、时间，要具体）
   - 人物外观（性别、发型、服装、配饰、姿势）
   - 人物动作（具体在做什么）
   - 场景细节（场景中的其他元素、互动、氛围）

2. **场景描述要具体**：
   - ✅ 好的："日本街道上，天空阴沉，下着细雨"
   - ✅ 好的："咖啡厅里，午后阳光透过窗户洒进来"
   - ✅ 好的："书店角落，柔和的灯光，排列整齐的书架"
   - ❌ 不好的："咖啡厅"、"书店"（太简单）

3. **人物外观要详细**：
   - ✅ 好的："女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞"
   - ✅ 好的："青年穿着白色T恤和牛仔裤，坐在窗边，手里拿着咖啡杯"
   - ❌ 不好的："女孩"、"青年"（太简单）

4. **动作要具体**：
   - ✅ 好的："她侧着身子蹲下，给一只小猫打伞"
   - ✅ 好的："他坐在书桌前，专注地看着电脑屏幕"
   - ❌ 不好的："在做什么"、"站着"（太模糊）

5. **细节要丰富**：
   - ✅ 好的："小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视"
   - ✅ 好的："桌上放着笔记本和茶杯，窗外是朦胧的城市晨景"
   - ❌ 不好的：缺少细节描述

6. **光线根据场景变化**：
   - 清晨 → "清晨柔和光线"、"晨光"
   - 午后 → "午后柔和光线"、"午后阳光"
   - 傍晚 → "黄昏金色光线"、"夕阳"
   - 夜晚 → "夜晚灯光"、"室内灯光"
   - 雨天 → "雨天光线"、"柔和自然光"

**输出要求：**
- 只输出提示词，不要加任何说明文字
- 提示词要详细、具体，包含风格、场景、人物外观、动作、细节
- 提示词长度控制在80-150字之间
- 必须使用中文
- 参考模板风格，让描述有画面感和故事性`;

/**
 * 使用 DeepSeek 生成首次形象提示词
 */
export async function generateInitialImagePrompt(
  partner: PartnerPersonalityProfile,
  aspectRatio: string = "9:16"
): Promise<string> {
  const orientation = aspectRatio === "9:16" ? "竖版" : aspectRatio === "16:9" ? "横版" : "方形";
  const genderTerm = partner.gender === "female" ? "女孩" : partner.gender === "male" ? "青年" : "年轻人";
  
  const userPrompt = `请为以下人物生成一个形象生图的提示词，参考提供的模板风格：

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

**参考模板格式：**
"风格插画，日式动漫脸，日本街道上，天空阴沉，下着细雨，女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞，小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视。"

**要求：**
1. 按照模板的结构：风格 → 构图 → 场景（地点、环境、天气） → 人物外观（发型、服装、配饰） → 动作（具体在做什么） → 细节（场景中的其他元素）
2. 场景描述要具体（如"咖啡厅里，午后阳光透过窗户"）
3. 人物外观要详细（如"黑色长发，穿着白色T恤和牛仔裤"）
4. 动作要具体（如"坐在窗边，手里拿着咖啡杯"）
5. 包含场景细节（如"桌上放着笔记本和茶杯"）

请根据这个人物的人格特质，生成一个详细、具体、有画面感的图像提示词。选择一个最能体现人物性格特质的场景。`;

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
  orientation: string; // 构图方向
} {
  // 提取构图方向（竖版、横版、方形）
  let orientation = "竖版";
  if (originalPrompt.includes("横版")) {
    orientation = "横版";
  } else if (originalPrompt.includes("方形")) {
    orientation = "方形";
  }
  
  // 提取风格部分（只保留构图，不保留光线，因为光线要根据场景变化）
  const stylePart = orientation;
  
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
  
  return { stylePart, genderTerm, characterDescription, orientation };
}

const SCENE_VARIATION_SYSTEM_PROMPT = `你是一个专业的AI图像生成提示词设计师。你的任务是根据人物的人格档案，生成详细、具体、有画面感的场景描述，用于生成新的形象图片。

**参考模板（理想的场景描述风格）：**
"日本街道上，天空阴沉，下着细雨，女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞，小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视。"

**模板结构分析：**
1. **场景**：日本街道上，天空阴沉，下着细雨（地点、天气、环境）
2. **人物外观**：女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞（发型、服装、配饰、姿势）
3. **动作**：她侧着身子蹲下，给一只小猫打伞（具体动作）
4. **细节**：小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视（场景中的其他元素和互动）

**核心要求：**
1. **场景要具体**：包含地点、环境、天气、时间
   - ✅ 好的："商场的书店区域，柔和的灯光，排列整齐的书架"
   - ✅ 好的："下雨天的街道，天空阴沉，路面有倒影"
   - ❌ 不好的："商场"、"书店"（太简单）

2. **人物外观要详细**：包含发型、服装、配饰、姿势
   - ✅ 好的："女孩黑色长发，穿着白色T恤和牛仔裤，坐在窗边，手里拿着咖啡杯"
   - ✅ 好的："青年穿着运动服，背着双肩包，站在地铁站台"
   - ❌ 不好的："女孩"、"青年"（太简单）

3. **动作要具体**：详细描述人物在做什么
   - ✅ 好的："她侧着身子蹲下，给一只小猫打伞"
   - ✅ 好的："他坐在书桌前，专注地看着电脑屏幕，手指在键盘上敲击"
   - ❌ 不好的："在做什么"、"站着"（太模糊）

4. **包含场景细节**：场景中的其他元素、物品、互动
   - ✅ 好的："桌上放着笔记本和茶杯，窗外是朦胧的城市晨景"
   - ✅ 好的："周围是排列整齐的书本，柔和的灯光洒在书架上"
   - ❌ 不好的：缺少细节

5. 根据人格档案中的信息（性格特质、兴趣爱好、生活方式、日常活动等），生成多样化的场景
6. 场景要丰富多样，不要局限于室内日常场景（如卧室、厨房、咖啡厅）
7. 每次必须生成完全不同的场景，避免重复（特别是当场景索引不同时）
8. 场景要符合人物的性格特质和生活方式

**输出格式：**
- 详细的场景描述，包含场景、人物外观、动作、细节
- 控制在30-60字之间
- 格式示例（参考模板风格）：
  - "商场的书店区域，柔和的灯光，女孩黑色长发，穿着白色T恤和牛仔裤，站在书架前安静翻阅书籍，周围是排列整齐的书本"
  - "夜晚的电竞房，屏幕色彩丰富，女孩穿着休闲T恤，坐在专业电竞椅前专注打游戏，桌面有键盘和饮料"
  - "下雨天的街道，天空阴沉，女孩穿着雨衣，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞"
  - "午后的咖啡厅，阳光透过窗户，女孩坐在靠窗位置，手里拿着咖啡杯，桌上放着笔记本和茶杯"
- 不要包含"保持形象不变"、"色调温暖"等提示词部分

**示例（正确的输出）：**
- "商场的书店区域，柔和的灯光，女孩黑色长发，穿着白色T恤和牛仔裤，站在书架前安静翻阅书籍，周围是排列整齐的书本"
- "夜晚的电竞房，屏幕色彩丰富，女孩穿着休闲T恤，坐在专业电竞椅前专注打游戏，桌面有键盘和饮料"
- "下雨天的街道，天空阴沉，女孩穿着雨衣，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞"

只输出场景描述，不要加任何说明文字或其他内容。`;

/**
 * 使用 DeepSeek 根据人格档案生成新的场景描述
 */
async function generateSceneFromPersonality(
  partner: PartnerPersonalityProfile,
  originalPrompt: string,
  sceneIndex: number
): Promise<string> {
  const { stylePart, genderTerm, characterDescription, orientation } = extractCharacterFeatures(originalPrompt);
  
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
  
  const userPrompt = `请为以下人物生成一个新的场景描述（场景索引：${sceneIndex}，**必须生成与之前完全不同的场景**），参考提供的模板风格：

**人物信息：**
- 名字：${partner.name}（${partner.nickname}）
- 性别：${partner.gender === "female" ? "女孩" : partner.gender === "male" ? "青年" : "年轻人"}
- 性格特质：${partner.corePersonality.primaryTraits.slice(0, 3).join("、")}
- 生活方式：${partner.lifestyleCompatibility?.dailyRhythm || "日常"}
- 兴趣爱好：${partner.lifestyleCompatibility?.hobbySharing || partner.deeperTraits?.hiddenTalents?.slice(0, 3).join("、") || "日常活动"}

**可用场景信息：**
${sceneSources.length > 0 ? sceneSources.map((s, idx) => `${idx + 1}. ${s}`).join("\n") : "日常生活场景"}

**参考模板格式：**
"日本街道上，天空阴沉，下着细雨，女生黑色长发，穿着一套制服，左手背着制服包，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞，小猫是黑灰色的狸花猫，它坐在地上，女生和小猫对视。"

**场景索引 ${sceneIndex} 的强制要求：**
根据场景索引 ${sceneIndex}，**必须**使用场景类型："${selectedType}"（这是索引 ${sceneIndex} 的强制要求，不能选择其他场景类型！）

**场景类型 "${selectedType}" 的示例场景：**
${(() => {
  let example = "";
  if (selectedType === '商场') example = '商场的书店区域，柔和的灯光，女孩黑色长发，穿着白色T恤和牛仔裤，站在书架前安静翻阅书籍，周围是排列整齐的书本';
  else if (selectedType === '网吧') example = '夜晚的电竞房，屏幕色彩丰富，女孩穿着休闲T恤，坐在专业电竞椅前专注打游戏，桌面有键盘和饮料';
  else if (selectedType === '游戏厅') example = '游戏厅的抓娃娃机前，彩色灯光闪烁，女孩穿着运动装，专注地操作摇杆，周围是其他游戏机和玩家';
  else if (selectedType === '地铁站') example = '地铁站台，灯光明亮，女孩穿着职业装，背着公文包，站在站台边缘等待地铁，周围是其他乘客和广告牌';
  else if (selectedType === '便利店') example = '夜晚的便利店，明亮的灯光，女孩穿着休闲装，站在货架前挑选零食，收银台有店员在忙碌';
  else if (selectedType === '雨天') example = '下雨天的街道，天空阴沉，路面有倒影，女孩穿着雨衣，右手拿着一把透明的雨伞，她侧着身子蹲下，给一只小猫打伞';
  else if (selectedType === '公园') example = '春天的公园，樱花盛开，女孩穿着连衣裙，在樱花树下慢慢散步，手里拿着相机，周围是其他游客';
  else if (selectedType === '书店') example = '书店的安静角落，柔和的灯光，女孩黑色长发，穿着白色连衣裙，站在书架前专注翻阅书籍，周围是排列整齐的文学类书籍';
  else if (selectedType === '电影院') example = '电影院散场后的走廊，灯光昏暗，女孩穿着简约连衣裙，安静地站在角落等待人群散去，手里拿着电影票根，目光柔和地观察墙上的电影海报';
  else if (selectedType === '咖啡厅') example = '午后的咖啡厅，阳光透过窗户，女孩坐在靠窗位置，手里拿着咖啡杯，桌上放着笔记本和茶杯，窗外是繁忙的街道';
  else if (selectedType === 'KTV') example = 'KTV包厢，彩色灯光闪烁，女孩穿着休闲装，坐在沙发上专注唱歌，手里拿着麦克风，屏幕上显示歌词';
  else if (selectedType === '超市') example = '超市的生鲜区，明亮的灯光，女孩推着购物车，站在货架前仔细挑选商品，周围是其他顾客和商品';
  else if (selectedType === '花店') example = '花店的展示区，柔和的灯光，女孩穿着连衣裙，站在花架前仔细挑选鲜花，手里拿着几支花，周围是各种鲜花和绿植';
  else if (selectedType === '甜品店') example = '甜品店的角落，柔和的灯光，女孩穿着淡色连衣裙，坐在角落位置小口品尝草莓蛋糕，桌上放着书本和耳机';
  else if (selectedType === '餐厅') example = '安静的餐厅角落，柔和的灯光，女孩穿着简约的连衣裙，独自坐在餐桌前，一边听着耳机里的轻音乐，一边慢慢翻阅手中的诗集';
  else if (selectedType === '酒吧') example = '酒吧的吧台，昏暗的灯光，女孩穿着休闲装，坐在高脚凳上小酌，手里拿着酒杯，周围是其他客人和调酒师';
  else if (selectedType === '公交站') example = '公交站台，路灯明亮，女孩穿着职业装，背着双肩包，站在站台等待公交车，手里拿着手机，周围是其他乘客';
  else if (selectedType === '机场') example = '机场候机厅，明亮的灯光，女孩穿着旅行装，坐在候机椅上，手里拿着登机牌，周围是其他旅客和行李';
  else if (selectedType === '火车站') example = '火车站候车室，灯光明亮，女孩穿着休闲装，坐在候车椅上，手里拿着车票，周围是其他旅客和行李';
  else if (selectedType === '广场') example = '城市广场，阳光明媚，女孩穿着连衣裙，在广场上慢慢散步，手里拿着相机，周围是其他游客和建筑';
  else example = `在${selectedType}，女孩穿着休闲装，专注地做着自己的事情，周围是相关的场景元素`;
  return `示例："${example}"`;
})()}

**重要要求：**
1. **必须使用场景类型 "${selectedType}"**，不能选择其他场景类型！
2. **按照模板的结构生成**：场景（地点、环境、天气） → 人物外观（发型、服装、配饰） → 动作（具体在做什么） → 细节（场景中的其他元素）
3. **场景描述要具体**：包含地点、环境、天气、时间（如"商场的书店区域，柔和的灯光"）
4. **人物外观要详细**：包含发型、服装、配饰、姿势（如"女孩黑色长发，穿着白色T恤和牛仔裤"）
5. **动作要具体**：详细描述人物在做什么（如"站在书架前安静翻阅书籍"）
6. **包含场景细节**：场景中的其他元素、物品、互动（如"周围是排列整齐的书本"）
7. **绝对不要包含原始首次场景的任何内容**（如"窗边"、"静坐思考"、"晨光"等），只生成全新的场景描述
8. 场景要符合人物的性格特质、兴趣爱好和生活方式，但场景类型必须是 "${selectedType}"，不能更改
9. 只输出场景描述部分，不要包含其他内容（如"写实插画"、"色调温暖"等）`;

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
    
    // 移除可能包含的原始提示词中的光线描述（如"清晨柔和光线"）
    const lightPatterns = [
      /清晨柔和光线/g,
      /午后柔和光线/g,
      /黄昏金色光线/g,
      /夜晚灯光/g,
      /雨天柔和光线/g,
      /室内柔和光线/g,
      /柔和自然光/g,
    ];
    lightPatterns.forEach(pattern => {
      cleanedScene = cleanedScene.replace(pattern, '').trim();
    });
    
    // 移除可能包含的原始提示词中的场景描述
    const originalParts = originalPrompt.split("。");
    if (originalParts.length > 1) {
      const originalScenePart = originalParts[1];
      // 提取原始场景的核心部分（去掉人物描述和色调）
      const originalSceneCore = originalScenePart
        .split("，色调")[0]
        .split("，氛围")[0]
        .split("，保持")[0]
        .trim();
      
      // 如果生成的场景包含了原始场景的核心部分，移除它
      if (originalSceneCore && cleanedScene.includes(originalSceneCore)) {
        cleanedScene = cleanedScene.replace(originalSceneCore, '').trim();
        // 清理多余的标点
        cleanedScene = cleanedScene.replace(/^[，,。]\s*/, '').replace(/\s*[，,。]\s*$/, '').trim();
      }
    }
    
    // 移除可能包含的原始提示词中的人物描述（更彻底的清理）
    // 匹配各种可能的人物描述模式
    const characterPatterns = [
      /(?:女孩|青年|年轻人)[^，。]*?(?:坐在|站在|在)[^，。]*?/g,
      /(?:女孩|青年|年轻人)[^，。]*?(?:静坐|思考|阅读|工作|休息)[^，。]*?/g,
      /(?:坐在|站在)[^，。]*?(?:窗边|沙发|椅子|桌前)[^，。]*?/g,
    ];
    
    characterPatterns.forEach(pattern => {
      const matches = originalPrompt.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (cleanedScene.includes(match.trim())) {
            cleanedScene = cleanedScene.replace(match.trim(), '').trim();
            cleanedScene = cleanedScene.replace(/^[，,。]\s*/, '').replace(/\s*[，,。]\s*$/, '').trim();
          }
        });
      }
    });
    
    // 如果清理后场景描述中仍然包含原始提示词的关键词，进一步清理
    const originalKeywords = originalPrompt.split("。")[1]?.split("，") || [];
    originalKeywords.forEach(keyword => {
      const trimmedKeyword = keyword.trim();
      // 如果关键词长度大于5且场景描述中包含它，移除
      if (trimmedKeyword.length > 5 && cleanedScene.includes(trimmedKeyword)) {
        // 检查是否是场景相关的关键词（如"窗边"、"思考"等），如果是则移除
        if (trimmedKeyword.includes("窗边") || trimmedKeyword.includes("思考") || trimmedKeyword.includes("静坐") || trimmedKeyword.includes("晨光") || trimmedKeyword.includes("椅子") || trimmedKeyword.includes("茶杯") || trimmedKeyword.includes("目光")) {
          cleanedScene = cleanedScene.replace(trimmedKeyword, '').trim();
          cleanedScene = cleanedScene.replace(/^[，,。]\s*/, '').replace(/\s*[，,。]\s*$/, '').trim();
        }
      }
    });
    
    // 最后检查：移除所有包含原始场景关键词和光线描述的句子
    const originalSceneFull = originalPrompt.split("。")[1];
    if (originalSceneFull) {
      // 提取原始场景的所有关键词
      const originalSceneKeywords = originalSceneFull.split("，").map(k => k.trim()).filter(k => k.length > 3);
      const matchedKeywords = originalSceneKeywords.filter(k => cleanedScene.includes(k));
      
      // 移除所有包含光线描述和原始场景关键词的句子
      const sentences = cleanedScene.split(/[，,。]/);
      cleanedScene = sentences
        .filter(s => {
          const sentence = s.trim();
          if (!sentence) return false;
          
          // 如果句子包含光线描述（如"清晨柔和光线"），移除
          const hasLight = sentence.includes("清晨柔和光线") || sentence.includes("午后柔和光线") || sentence.includes("黄昏金色光线") || sentence.includes("夜晚灯光");
          if (hasLight) {
            return false;
          }
          
          // 如果句子包含原始场景关键词，移除
          if (matchedKeywords.length > 0) {
            const hasOriginalKeywords = matchedKeywords.some(k => sentence.includes(k));
            if (hasOriginalKeywords) {
              return false;
            }
          }
          
          return true;
        })
        .join("，")
        .trim();
      
      // 最后清理：移除所有光线描述（因为光线会在后面统一添加）
      cleanedScene = cleanedScene.replace(/清晨柔和光线/g, '').replace(/午后柔和光线/g, '').replace(/黄昏金色光线/g, '').replace(/夜晚灯光/g, '').trim();
      cleanedScene = cleanedScene.replace(/^[，,。]\s*/, '').replace(/\s*[，,。]\s*$/, '').trim();
      
      // 如果清理后场景描述为空或过短，尝试提取新场景部分
      if (!cleanedScene || cleanedScene.length < 5) {
        const newSceneMatch = cleanedScene.match(/([^，。]+(?:商场|书店|电影院|餐厅|甜品店|网吧|游戏厅|公园|地铁站|便利店|唱片店|角落|散场|品尝|享用|试听|挑选|翻阅|聆听|用餐|听音乐)[^，。]*)/);
        if (newSceneMatch && newSceneMatch[1]) {
          cleanedScene = newSceneMatch[1].trim();
        }
      }
    }
    
    // 去掉"保持形象不变"、"色调温暖"等提示词部分
    if (cleanedScene.includes("，保持形象不变") || cleanedScene.includes("保持形象不变")) {
      cleanedScene = cleanedScene.split("，保持形象不变")[0].split("保持形象不变")[0].trim();
    }
    if (cleanedScene.includes("，色调") || cleanedScene.includes("色调")) {
      cleanedScene = cleanedScene.split("，色调")[0].split("色调")[0].trim();
    }
    if (cleanedScene.includes("，氛围") || cleanedScene.includes("氛围")) {
      cleanedScene = cleanedScene.split("，氛围")[0].split("氛围")[0].trim();
    }
    
    // 清理多余的标点和空格
    cleanedScene = cleanedScene.replace(/^[，,。]\s*/, '').replace(/\s*[，,。]\s*$/, '').trim();
    
    // 确保场景描述不为空
    if (!cleanedScene || cleanedScene.length < 5) {
      throw new Error("生成的场景描述为空或过短");
    }

    // 根据场景描述推断光线和时间
    let lightDescription = "柔和自然光";
    let toneAndMood = ""; // 色调和氛围，根据场景决定是否添加
    
    // 根据场景描述推断光线（更全面的判断）
    if (cleanedScene.includes("清晨") || cleanedScene.includes("早晨") || cleanedScene.includes("晨光")) {
      lightDescription = "清晨柔和光线";
    } else if (cleanedScene.includes("午后") || cleanedScene.includes("下午")) {
      lightDescription = "午后柔和光线";
    } else if (cleanedScene.includes("傍晚") || cleanedScene.includes("黄昏") || cleanedScene.includes("夕阳")) {
      lightDescription = "黄昏金色光线";
    } else if (cleanedScene.includes("夜晚") || cleanedScene.includes("晚上") || cleanedScene.includes("夜间") || cleanedScene.includes("电竞房") || cleanedScene.includes("网吧")) {
      lightDescription = "夜晚灯光";
    } else if (cleanedScene.includes("雨天") || cleanedScene.includes("下雨")) {
      lightDescription = "雨天柔和光线";
    } else if (cleanedScene.includes("电影院") || cleanedScene.includes("散场")) {
      lightDescription = "夜晚灯光";
    } else if (cleanedScene.includes("商场") || cleanedScene.includes("书店") || cleanedScene.includes("咖啡厅") || cleanedScene.includes("餐厅") || cleanedScene.includes("甜品店")) {
      // 商业场所，根据场景索引随机选择时间
      const timeOptions = ["午后柔和光线", "柔和自然光", "室内柔和光线"];
      lightDescription = timeOptions[sceneIndex % timeOptions.length];
    } else {
      // 默认根据场景索引变化
      const timeOptions = ["柔和自然光", "午后柔和光线", "室内柔和光线"];
      lightDescription = timeOptions[sceneIndex % timeOptions.length];
    }
    
    // 根据场景决定是否添加色调和氛围（可选）
    // 如果场景描述已经很完整，可以不添加
    const shouldAddToneMood = Math.random() > 0.3; // 70% 概率添加
    if (shouldAddToneMood) {
      if (cleanedScene.includes("夜晚") || cleanedScene.includes("晚上")) {
        toneAndMood = "，色调柔和，氛围安静";
      } else if (cleanedScene.includes("雨天") || cleanedScene.includes("下雨")) {
        toneAndMood = "，色调淡雅，氛围宁静";
      } else {
        toneAndMood = "，色调温暖，氛围真实自然";
      }
    }

    // 检查场景描述是否已经完整（包含场景、人物外观、动作、细节）
    // 如果场景描述已经包含了人物外观和动作，说明是完整的，直接使用
    const hasCharacterAppearance = cleanedScene.includes("女孩") || cleanedScene.includes("青年") || cleanedScene.includes("年轻人");
    const hasCharacterAction = cleanedScene.includes("站在") || cleanedScene.includes("坐在") || cleanedScene.includes("蹲下") || cleanedScene.includes("拿着") || cleanedScene.includes("穿着");
    
    if (hasCharacterAppearance && hasCharacterAction) {
      // 场景描述已经完整，按照模板风格组合：风格 → 构图 → 场景描述
      // 从原始提示词中提取风格（如果有）
      const styleMatch = originalPrompt.match(/^(写实插画|风格插画|日式动漫脸)/);
      const style = styleMatch ? styleMatch[1] : "写实插画";
      
      return `${style}，${orientation}，${cleanedScene}。`;
    } else {
      // 场景描述不完整，需要补充
      // 尝试从原始提示词中提取人物外观和动作
      const characterMatch = originalPrompt.match(/([^，。]+(?:女孩|青年|年轻人)[^，。]+(?:穿着|坐在|站在|拿着|背着)[^，。]*)/);
      if (characterMatch && characterMatch[1]) {
        const styleMatch = originalPrompt.match(/^(写实插画|风格插画|日式动漫脸)/);
        const style = styleMatch ? styleMatch[1] : "写实插画";
        return `${style}，${orientation}，${cleanedScene}，${characterMatch[1].trim()}。`;
      } else {
        // 使用通用描述
        const styleMatch = originalPrompt.match(/^(写实插画|风格插画|日式动漫脸)/);
        const style = styleMatch ? styleMatch[1] : "写实插画";
        return `${style}，${orientation}，${cleanedScene}，${genderTerm}在其中。`;
      }
    }
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
  const { stylePart, genderTerm, characterDescription, orientation } = extractCharacterFeatures(originalPrompt);
  
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
  
  // 根据场景推断光线
  const inferLight = (scene: string): string => {
    if (scene.includes("清晨") || scene.includes("早晨")) {
      return "清晨柔和光线";
    } else if (scene.includes("午后") || scene.includes("下午")) {
      return "午后柔和光线";
    } else if (scene.includes("傍晚") || scene.includes("黄昏")) {
      return "黄昏金色光线";
    } else if (scene.includes("夜晚") || scene.includes("晚上")) {
      return "夜晚灯光";
    }
    return "柔和自然光";
  };
  
  // 如果没有场景信息，使用默认场景
  if (scenes.length === 0) {
    const defaultScenes = [
      "清晨的窗边，静坐思考",
      "午后的咖啡角，安静阅读",
      "黄昏的客厅，放松休息",
      "夜晚的书房，专注工作",
    ];
    const selectedScene = defaultScenes[sceneIndex % defaultScenes.length];
    const light = inferLight(selectedScene);
    const hasCharacterAction = selectedScene.includes("女孩") || selectedScene.includes("青年") || selectedScene.includes("年轻人");
    if (hasCharacterAction) {
      return `写实插画，${orientation}，${light}。${selectedScene}。`;
    } else {
      return `写实插画，${orientation}，${light}。${selectedScene}，${genderTerm}在其中。`;
    }
  }
  
  // 根据 sceneIndex 选择场景（循环使用）
  const selectedSceneInfo = scenes[sceneIndex % scenes.length];
  // 提取场景描述（去掉前缀）
  const sceneDescription = selectedSceneInfo.split("：")[1] || selectedSceneInfo;
  const light = inferLight(sceneDescription);
  
  const hasCharacterAction = sceneDescription.includes("女孩") || sceneDescription.includes("青年") || sceneDescription.includes("年轻人");
  if (hasCharacterAction) {
    return `写实插画，${orientation}，${light}。${sceneDescription}。`;
  } else {
    return `写实插画，${orientation}，${light}。${sceneDescription}，${genderTerm}在其中。`;
  }
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
  const { stylePart, genderTerm, characterDescription, orientation } = extractCharacterFeatures(originalPrompt);
  
  // 根据场景推断光线的辅助函数
  const inferLight = (scene: string): string => {
    if (scene.includes("清晨") || scene.includes("早晨") || scene.includes("晨光")) {
      return "清晨柔和光线";
    } else if (scene.includes("午后") || scene.includes("下午")) {
      return "午后柔和光线";
    } else if (scene.includes("傍晚") || scene.includes("黄昏") || scene.includes("夕阳")) {
      return "黄昏金色光线";
    } else if (scene.includes("夜晚") || scene.includes("晚上") || scene.includes("夜间")) {
      return "夜晚灯光";
    } else if (scene.includes("雨天") || scene.includes("下雨")) {
      return "雨天柔和光线";
    } else if (scene.includes("室内") || scene.includes("房间")) {
      return "室内柔和光线";
    }
    return "柔和自然光";
  };
  
  // 优先使用用户输入
  if (userInput && userInput.trim()) {
    const light = inferLight(userInput);
    const hasCharacterAction = userInput.includes("女孩") || userInput.includes("青年") || userInput.includes("年轻人");
    if (hasCharacterAction) {
      return `写实插画，${orientation}，${light}。${userInput.trim()}。`;
    } else {
      const characterAction = originalPrompt.match(/[，,]([^，,]+(?:女孩|青年|年轻人)[^，,]+)/);
      if (characterAction && characterAction[1]) {
        return `写实插画，${orientation}，${light}。${userInput.trim()}，${characterAction[1].trim()}。`;
      } else {
        return `写实插画，${orientation}，${light}。${userInput.trim()}，${genderTerm}在其中。`;
      }
    }
  }
  
  // 如果有新的场景描述，替换场景部分
  if (newSceneDescription && newSceneDescription.trim()) {
    const light = inferLight(newSceneDescription);
    const hasCharacterAction = newSceneDescription.includes("女孩") || newSceneDescription.includes("青年") || newSceneDescription.includes("年轻人");
    if (hasCharacterAction) {
      return `写实插画，${orientation}，${light}。${newSceneDescription.trim()}。`;
    } else {
      const characterAction = originalPrompt.match(/[，,]([^，,]+(?:女孩|青年|年轻人)[^，,]+)/);
      if (characterAction && characterAction[1]) {
        return `写实插画，${orientation}，${light}。${newSceneDescription.trim()}，${characterAction[1].trim()}。`;
      } else {
        return `写实插画，${orientation}，${light}。${newSceneDescription.trim()}，${genderTerm}在其中。`;
      }
    }
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
  
  // 改进格式：简化结尾，去掉技术性说明
  return `写实插画，${orientation}，柔和自然光。${scene}，${genderTerm}在其中，色调温暖，氛围真实自然。`;
}

