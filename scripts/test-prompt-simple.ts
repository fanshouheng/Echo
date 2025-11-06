/**
 * Simple test for prompt generation
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

import { generateInitialImagePrompt } from "../src/lib/prompts/generate-image-prompt";
import { PartnerPersonalityProfile } from "../src/types/partner-personality";

const samplePartner: PartnerPersonalityProfile = {
  name: "Echo-01",
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

async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("DeepSeek 生成的提示词示例");
  console.log("=".repeat(70) + "\n");

  console.log("测试 1: 竖版（9:16）");
  console.log("-".repeat(70));
  const prompt1 = await generateInitialImagePrompt(samplePartner, "9:16");
  console.log(prompt1);
  console.log(`长度: ${prompt1.length} 字符\n`);

  console.log("测试 2: 横版（16:9）");
  console.log("-".repeat(70));
  const prompt2 = await generateInitialImagePrompt(samplePartner, "16:9");
  console.log(prompt2);
  console.log(`长度: ${prompt2.length} 字符\n`);

  console.log("=".repeat(70));
  console.log("完成");
  console.log("=".repeat(70));
}

main().catch(console.error);

