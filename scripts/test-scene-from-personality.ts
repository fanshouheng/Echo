/**
 * Test Scene Generation from Personality Profile
 * 测试基于人格档案的场景生成功能
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
  console.log("✅ 环境变量已加载");
} catch (error) {
  console.warn("⚠️ 无法加载 .env.local，将使用系统环境变量");
}

import { generateSceneVariationPrompt } from "../src/lib/prompts/generate-image-prompt";
import type { PartnerPersonalityProfile } from "../src/types/partner-personality";

// 创建一个示例人格档案
const samplePartner: PartnerPersonalityProfile = {
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
    secondaryScene: "黄昏的开放式厨房，准备晚餐",
    additionalScenes: ["清晨的书房，专注写作", "夜晚的客厅，放松休息"],
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
    listeningStyle: "专注倾听",
    conflictHandling: "冷静沟通",
    expressionStyle: "习惯用文字表达深度思考"
  },
  lifestyleCompatibility: {
    dailyRhythm: "喜欢早晨安静时光，晚上舒适放松",
    socialStyle: "少数深度朋友",
    hobbySharing: "阅读、写作、电影",
    spaceBalance: "需要独立空间，也享受共处"
  },
  uniqueQualities: {
    strengths: ["善于倾听", "文字表达能力强"],
    adorableFlaws: ["偶尔会想太多"],
    dailyHabits: ["做笔记", "喜欢记录生活"]
  },
  relationshipDynamics: {
    intimacyLevel: "深度情感连接",
    growthTogether: "互相支持成长",
    conflictResolution: "冷静沟通",
    futureVision: "共同规划未来"
  },
  whyPerfectMatch: {
    attachmentMatch: "都重视安全感",
    emotionalMatch: "情感表达方式互补",
    communicationMatch: "都喜欢深度交流",
    lifestyleMatch: "生活节奏相似",
    growthMatch: "都重视个人成长"
  },
  loveLanguage: {
    primary: "优质时间",
    secondary: "服务行动",
    expression: "通过细节表达关心"
  },
  dailyLifeScenes: {
    morningRoutine: "清晨的窗边，一边喝咖啡一边阅读",
    eveningRoutine: "夜晚的客厅，安静地整理一天的思绪",
    weekendActivity: "周末的咖啡厅，享受独处的时光",
    cookingTogether: "黄昏的厨房，一起准备简单的晚餐",
    quietMoments: "午后的书房，安静地写作或阅读",
    playfulMoments: "轻松时刻，分享有趣的文字或图片，或者去游戏厅抓娃娃"
  },
  interactionDetails: {
    howTheyGreet: "温柔的问候",
    howTheySayGoodbye: "不舍的告别",
    howTheyShowCare: "通过细节表达",
    howTheyApologize: "真诚的道歉",
    howTheyCelebrate: "分享喜悦",
    howTheyComfort: "安静的陪伴"
  },
  livingTogether: {
    morningScene: "清晨的客厅，各自做着自己的事情，偶尔交流",
    eveningScene: "夜晚的客厅，一起看电视或各自阅读",
    weekendScene: "周末的家中，一起做家务或各自享受时光，偶尔也会去商场购物或游戏厅",
    choreDistribution: "自然分工",
    personalSpace: "尊重各自的独立空间",
    sharedActivities: ["一起做饭", "看电影", "散步", "阅读", "聊天", "去游戏厅", "逛商场"]
  },
  deeperTraits: {
    hiddenTalents: ["写小诗", "摄影", "插花"],
    quirks: ["做笔记", "喜欢收集文字", "对细节敏感"],
    petPeeves: ["吵闹环境", "打断思考"],
    randomFacts: ["喜欢秋天", "收集书签", "喜欢深夜写作"]
  },
  conversationExamples: {
    dailyCheckIn: "今天怎么样",
    deepTalk: "理解世界",
    playfulTeasing: "调侃",
    conflictExample: "冷静沟通",
    supportiveWords: "我相信你"
  }
};

async function testSceneGeneration() {
  console.log("\n" + "=".repeat(80));
  console.log("测试基于人格档案的场景生成");
  console.log("=".repeat(80) + "\n");

  // 模拟首次生成的提示词
  const firstPrompt = "写实插画，竖版构图，柔和自然光。午后窗边的咖啡角，安静阅读，女孩在其中，色调温暖，氛围真实自然，画面仅出现这一位主角。";

  console.log("📝 首次生成的提示词：");
  console.log(firstPrompt);
  console.log("\n" + "-".repeat(80) + "\n");

  // 测试生成多个不同的场景
  console.log("🎨 基于人格档案生成多个场景变化：\n");

  for (let i = 0; i < 5; i++) {
    try {
      console.log(`\n场景 ${i + 1}:`);
      console.log("正在生成...");
      
      const scenePrompt = await generateSceneVariationPrompt(
        firstPrompt,
        undefined,
        undefined,
        i,
        samplePartner
      );
      
      console.log("✅ 生成的场景提示词：");
      console.log(scenePrompt);
      console.log("-".repeat(80));
    } catch (error) {
      console.error(`❌ 场景 ${i + 1} 生成失败:`, error);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("测试完成");
  console.log("=".repeat(80) + "\n");
}

// 运行测试
testSceneGeneration().catch(console.error);

