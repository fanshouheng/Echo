/**
 * Test actual image generation with DeepSeek prompts
 * 实际测试图片生成效果
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load env
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
} catch (error) {}

// 模拟一个简化的人格数据用于测试
const testPersonality = {
  name: "Echo-测试",
  tagline: "温暖而独立的伴侣",
  keywords: ["温柔", "细腻", "独立"],
  communicationStyle: "温和清晰，习惯用文字表达深度思考",
  values: "优质时间，服务行动",
  whyMatch: "都重视安全感和独立性的平衡",
  uniqueTraits: "善于倾听，文字表达能力强，有自己独立的节奏",
};

const testPartner = {
  name: "Echo-测试",
  nickname: "Echo",
  age: "24岁",
  vibe: "温暖而独立",
  tagline: "一个能在深夜给你发长消息的伴侣",
  gender: "female",
  visualProfile: {
    apparentAge: "22-26岁",
    occupation: "自由撰稿人",
    primaryScene: "午后窗边的咖啡角，安静阅读",
  },
  corePersonality: {
    attachmentStyle: "安全型",
    primaryTraits: ["温柔", "细腻", "独立"],
    complementaryTraits: ["理性"],
    lovingStyle: "通过细节表达"
  },
  emotionalSupport: {
    whenYouAnxious: "安静陪伴",
    whenYouSad: "深夜发消息安慰",
    whenYouHappy: "一起笑",
    dailySupport: "准备温热茶"
  },
  communicationStyle: {
    speakingPattern: "温和清晰",
    listeningStyle: "专注耐心",
    conflictHandling: "冷静表达",
    expressionStyle: "行动表达"
  },
  lifestyleCompatibility: {
    dailyRhythm: "习惯早起",
    socialStyle: "小范围深度交流",
    hobbySharing: "阅读、咖啡",
    spaceBalance: "需要个人空间"
  },
  uniqueQualities: {
    strengths: ["善于倾听"],
    adorableFlaws: ["沉浸自己世界"],
    dailyHabits: ["早晨写日记"]
  },
  relationshipDynamics: {
    intimacyLevel: "深度连接",
    growthTogether: "相互支持",
    conflictResolution: "冷静沟通",
    futureVision: "共同成长"
  },
  whyPerfectMatch: {
    attachmentMatch: "平衡",
    emotionalMatch: "理解",
    communicationMatch: "用心",
    lifestyleMatch: "相似",
    growthMatch: "支持"
  },
  loveLanguage: {
    primary: "优质时间",
    secondary: "服务行动",
    expression: "行动表达"
  },
  dailyLifeScenes: {
    morningRoutine: "清晨厨房准备早餐",
    eveningRoutine: "晚上整理照片",
    weekendActivity: "逛书店",
    cookingTogether: "一起做饭",
    quietMoments: "午后窗边各自做事",
    playfulMoments: "逛小店"
  },
  interactionDetails: {
    howTheyGreet: "温暖笑容",
    howTheySayGoodbye: "轻轻拥抱",
    howTheyShowCare: "记住小事",
    howTheyApologize: "认真表达",
    howTheyCelebrate: "有意义礼物",
    howTheyComfort: "安静陪伴"
  },
  livingTogether: {
    morningScene: "准备早餐",
    eveningScene: "各自做自己的事",
    weekendScene: "书店看书",
    choreDistribution: "分工合作",
    personalSpace: "各自书房",
    sharedActivities: ["读书", "看电影"]
  },
  deeperTraits: {
    hiddenTalents: ["写小诗"],
    quirks: ["做笔记"],
    petPeeves: ["吵闹环境"],
    randomFacts: ["喜欢秋天"]
  },
  conversationExamples: {
    dailyCheckIn: "今天怎么样",
    deepTalk: "理解世界",
    playfulTeasing: "调侃",
    conflictExample: "冷静沟通",
    supportiveWords: "我相信你"
  }
};

async function testImageGeneration() {
  console.log("\n" + "=".repeat(80));
  console.log("测试实际图片生成（使用 DeepSeek 生成的提示词）");
  console.log("=".repeat(80) + "\n");

  // 检查是否有豆包 API 配置
  const doubaoKey = process.env.DOUBAO_API_KEY || "";
  const doubaoEndpoint = process.env.DOUBAO_ENDPOINT_ID || "";
  
  if (!doubaoKey || !doubaoEndpoint) {
    console.error("❌ 豆包 AI 未配置！需要设置 DOUBAO_API_KEY 和 DOUBAO_ENDPOINT_ID");
    console.log("\n提示：在实际应用中，图片生成会在前端调用 API 路由完成。");
    console.log("这里仅演示提示词生成流程。");
    return;
  }

  console.log("✅ 检测到豆包 AI 配置");
  console.log("\n注意：此脚本仅用于测试提示词生成。");
  console.log("实际图片生成需要启动 Next.js 开发服务器，然后通过前端调用 API。\n");

  // 测试提示词生成
  const { generateInitialImagePrompt } = await import("../src/lib/prompts/generate-image-prompt");
  
  console.log("1. 生成首次提示词...");
  const firstPrompt = await generateInitialImagePrompt(testPartner as any, "9:16");
  console.log("生成的提示词：");
  console.log(firstPrompt);
  console.log(`长度: ${firstPrompt.length} 字符\n`);

  console.log("2. 生成后续场景提示词...");
  const { generateSceneVariationPrompt } = await import("../src/lib/prompts/generate-image-prompt");
  const scenePrompt = generateSceneVariationPrompt(
    firstPrompt,
    "黄昏街区的石板路，手持咖啡缓步前行"
  );
  console.log("场景变化后的提示词：");
  console.log(scenePrompt);
  console.log(`长度: ${scenePrompt.length} 字符\n`);

  console.log("=".repeat(80));
  console.log("✅ 提示词生成测试完成");
  console.log("=".repeat(80));
  console.log("\n要实际生成图片，请：");
  console.log("1. 启动开发服务器: npm run dev");
  console.log("2. 在浏览器中访问应用");
  console.log("3. 完成访谈并生成人格");
  console.log("4. 在档案页点击'生成首张形象'");
  console.log("=".repeat(80));
}

testImageGeneration().catch(console.error);

