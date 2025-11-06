/**
 * Test actual image generation with Doubao API
 * 直接调用豆包 API 生成图片，测试 DeepSeek 生成的提示词效果
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load env for DeepSeek
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

// 直接导入豆包 API 函数
const DOUBAO_API_KEY = "d4ece488-75bc-4ab7-945e-812dce2c492c";
const DOUBAO_ENDPOINT_ID = "ep-20251103133548-j5md8";
const DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

async function generateImageWithDoubao(prompt: string, aspectRatio: string = "9:16") {
  const width = aspectRatio === "9:16" ? 1024 : aspectRatio === "16:9" ? 1920 : 1024;
  const height = aspectRatio === "9:16" ? 1824 : aspectRatio === "16:9" ? 1080 : 1024;
  
  const requestBody = {
    model: DOUBAO_ENDPOINT_ID,
    prompt: prompt,
    sequential_image_generation: "disabled",
    response_format: "url",
    size: "2K",
    stream: false,
    watermark: false,
    aspect_ratio: aspectRatio,
    width: width,
    height: height,
  };

  console.log("📡 调用豆包 API...");
  console.log("   提示词:", prompt.substring(0, 60) + "...");
  console.log("   尺寸:", `${width}x${height} (${aspectRatio})`);

  const response = await fetch(`${DOUBAO_API_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DOUBAO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`豆包 API 错误: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  
  if (data.data && Array.isArray(data.data) && data.data[0]) {
    return data.data.map((item: any) => item.url || item.b64_json);
  } else if (data.url) {
    return [data.url];
  } else {
    throw new Error("无法解析 API 响应: " + JSON.stringify(data));
  }
}

async function testImageGeneration() {
  console.log("\n" + "=".repeat(80));
  console.log("实际图片生成测试");
  console.log("=".repeat(80) + "\n");

  // 导入提示词生成函数
  const { generateInitialImagePrompt } = await import("../src/lib/prompts/generate-image-prompt");
  const { PartnerPersonalityProfile } = await import("../src/types/partner-personality");

  // 创建测试人格数据
  const testPartner: PartnerPersonalityProfile = {
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

  try {
    console.log("1️⃣ 使用 DeepSeek 生成首次提示词...");
    const firstPrompt = await generateInitialImagePrompt(testPartner, "9:16");
    console.log("✅ 生成的提示词：");
    console.log(firstPrompt);
    console.log(`长度: ${firstPrompt.length} 字符\n`);

    console.log("2️⃣ 调用豆包 API 生成图片...");
    console.log("⏳ 这可能需要 10-30 秒，请稍候...\n");
    
    const startTime = Date.now();
    const imageUrls = await generateImageWithDoubao(firstPrompt, "9:16");
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n✅ 图片生成成功！");
    console.log(`⏱️  耗时: ${elapsed} 秒`);
    console.log(`📸 图片数量: ${imageUrls.length}`);
    console.log("\n生成的图片 URL：");
    imageUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ 测试完成！");
    console.log("=".repeat(80));
    console.log("\n💡 提示：");
    console.log("   1. 复制上面的 URL 在浏览器中打开查看图片");
    console.log("   2. 图片会保存在豆包 CDN 上");
    console.log("   3. 如果图片效果不理想，可以调整提示词重新生成");

  } catch (error) {
    console.error("\n❌ 生成失败：");
    console.error(error);
    if (error instanceof Error) {
      console.error("错误信息:", error.message);
    }
  }
}

testImageGeneration().catch(console.error);

