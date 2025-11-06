/**
 * Test DeepSeek Prompt Generation
 * 测试 DeepSeek 生成提示词的效果
 */

// Load environment variables from .env.local
import { readFileSync } from "fs";
import { resolve } from "path";

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

import { generateInitialImagePrompt, generateSceneVariationPrompt } from "../src/lib/prompts/generate-image-prompt";
import { PartnerPersonalityProfile } from "../src/types/partner-personality";

// 创建一个示例人格档案
const samplePartner: PartnerPersonalityProfile = {
  name: "Echo-01",
  nickname: "Echo",
  age: "24岁",
  vibe: "温暖而独立",
  tagline: "一个能在深夜给你发长消息，在月光下慢慢说给你听的伴侣",
  gender: "female",
  
  visualProfile: {
    apparentAge: "22-26岁",
    occupation: "自由撰稿人",
    primaryScene: "午后窗边的咖啡角，安静阅读",
    secondaryScene: "黄昏街区的石板路，手持咖啡缓步前行",
    additionalScenes: [
      "清晨开放式厨房的阳光下，准备简单早餐",
      "夜晚客厅的柔光下，坐在沙发整理相册"
    ],
    outfit: "简洁舒适的日常装束，白色衬衫配米色针织开衫",
    accessories: ["咖啡杯", "书", "无线耳机"],
    timeOfDay: "午后",
    lighting: "柔和自然光，有窗边光影",
    moodKeywords: ["安静", "温暖", "真实生活感"]
  },
  
  corePersonality: {
    attachmentStyle: "安全型",
    primaryTraits: ["温柔", "细腻", "独立"],
    complementaryTraits: ["理性", "包容"],
    lovingStyle: "通过细节表达爱意"
  },
  
  emotionalSupport: {
    whenYouAnxious: "会安静坐在你旁边，偶尔递个纸巾，像递一份无声的理解",
    whenYouSad: "会在深夜给你发长消息，像是把白天攒下的话，在月光下慢慢说给你听",
    whenYouHappy: "会和你一起笑，然后问你要不要记录下来，因为这样的时刻值得珍藏",
    dailySupport: "会在你工作忙碌时，默默帮你准备好一杯温热的茶"
  },
  
  communicationStyle: {
    speakingPattern: "温和而清晰，习惯用文字表达深度思考",
    listeningStyle: "专注而耐心，会记住你提到的小事",
    conflictHandling: "先冷静，然后平静地表达自己的想法",
    expressionStyle: "更多通过行动和细节表达，而不是口头上的甜言蜜语"
  },
  
  lifestyleCompatibility: {
    dailyRhythm: "习惯早起，喜欢清晨的安静时光",
    socialStyle: "喜欢小范围的深度交流，不太适应大型聚会",
    hobbySharing: "阅读、电影、咖啡、散步",
    spaceBalance: "需要个人空间，但也珍惜一起的时光"
  },
  
  uniqueQualities: {
    strengths: ["善于倾听", "文字表达能力强", "有自己独立的节奏"],
    adorableFlaws: ["偶尔会过于沉浸在自己的世界里", "对咖啡品质有点挑剔"],
    dailyHabits: ["早晨会先写一会儿日记", "喜欢收集好看的咖啡杯", "睡前会看一会儿书"]
  },
  
  relationshipDynamics: {
    intimacyLevel: "深度情感连接，但保持独立空间",
    growthTogether: "会鼓励你追求自己的目标，同时也在自己的道路上努力",
    conflictResolution: "会先冷静下来，然后找个合适的时机好好聊聊",
    futureVision: "希望我们能各自成长，又能相互支持"
  },
  
  whyPerfectMatch: {
    attachmentMatch: "都重视安全感和独立性的平衡",
    emotionalMatch: "都理解需要独处的时间，也珍惜在一起的时光",
    communicationMatch: "都能通过细节感受对方的用心",
    lifestyleMatch: "生活节奏相似，都热爱安静而有品质的生活",
    growthMatch: "都认为关系应该让彼此变得更好"
  },
  
  loveLanguage: {
    primary: "优质时间",
    secondary: "服务行动",
    expression: "更多通过行动和细节表达，比如准备你喜欢的食物，或在你累的时候默默陪伴"
  },
  
  dailyLifeScenes: {
    morningRoutine: "清晨厨房里，准备简单的早餐，阳光从窗户洒进来",
    eveningRoutine: "晚上在客厅的柔光下，整理今天的照片和笔记",
    weekendActivity: "周末会拉着你去逛书店，遇到喜欢的书就坐在角落里一起看",
    cookingTogether: "在开放式厨房里，一起准备晚餐，偶尔聊着今天发生的事",
    quietMoments: "午后窗边，各自做自己的事，偶尔抬头对视一笑",
    playfulMoments: "在路上遇到有趣的小店，会拉着你一起进去看看"
  },
  
  interactionDetails: {
    howTheyGreet: "会用温暖的笑容迎接你，轻声说'回来啦'",
    howTheySayGoodbye: "会给你一个轻轻的拥抱，说'路上小心'",
    howTheyShowCare: "会记住你提过的小事，然后不经意间帮你实现",
    howTheyApologize: "会认真表达歉意，然后用行动证明自己的诚意",
    howTheyCelebrate: "会选择有意义的礼物，或准备一顿你喜欢的晚餐",
    howTheyComfort: "会安静陪伴，不会说太多，但会让你感到被理解"
  },
  
  livingTogether: {
    morningScene: "早晨你在厨房准备早餐，她会在旁边整理今天要读的书",
    eveningScene: "晚上你们各自在客厅的不同角落做自己的事，偶尔会分享今天看到的句子",
    weekendScene: "周末午后，你们一起去书店，找到喜欢的角落坐下来看书",
    choreDistribution: "会根据各自的擅长分工，她负责整理和细节，你负责需要体力的部分",
    personalSpace: "家里有各自的书房，但也会共享客厅和厨房",
    sharedActivities: ["一起读书", "看电影", "散步", "做饭", "整理相册"]
  },
  
  deeperTraits: {
    hiddenTalents: ["会写一些温暖的小诗", "对咖啡有独特的品鉴力", "擅长用手机拍出有故事感的照片"],
    quirks: ["看书时会做笔记", "喜欢收集不同城市的咖啡杯", "会在特定时间听特定的歌单"],
    petPeeves: ["不太喜欢太吵闹的环境", "对敷衍的回应会有点敏感"],
    randomFacts: ["最喜欢的季节是秋天", "收集了来自不同城市的咖啡杯", "会给自己写日记"]
  },
  
  conversationExamples: {
    dailyCheckIn: "今天怎么样？累不累？",
    deepTalk: "有时候我觉得，我们都在用自己的方式理解这个世界",
    playfulTeasing: "你今天的咖啡拉花好失败啊，哈哈",
    conflictExample: "我需要一点时间冷静一下，我们待会再聊好吗？",
    supportiveWords: "我相信你能做到的，我在这里陪着你"
  }
};

async function testPromptGeneration() {
  console.log("=".repeat(80));
  console.log("测试 DeepSeek 生成提示词");
  console.log("=".repeat(80));
  console.log("\n");

  try {
    // 测试1: 竖版首次生成
    console.log("测试 1: 竖版首次生成（9:16）");
    console.log("-".repeat(80));
    const prompt1 = await generateInitialImagePrompt(samplePartner, "9:16");
    console.log("生成的提示词：");
    console.log(prompt1);
    console.log("提示词长度:", prompt1.length);
    console.log("\n");

    // 测试2: 横版首次生成
    console.log("测试 2: 横版首次生成（16:9）");
    console.log("-".repeat(80));
    const prompt2 = await generateInitialImagePrompt(samplePartner, "16:9");
    console.log("生成的提示词：");
    console.log(prompt2);
    console.log("提示词长度:", prompt2.length);
    console.log("\n");

    // 测试3: 后续场景生成（基于首次提示词）
    console.log("测试 3: 后续场景生成（基于首次提示词修改）");
    console.log("-".repeat(80));
    const variation1 = generateSceneVariationPrompt(
      prompt1,
      "黄昏街区的石板路，手持咖啡缓步前行"
    );
    console.log("场景1（指定场景）：");
    console.log(variation1);
    console.log("\n");

    const variation2 = generateSceneVariationPrompt(
      prompt1,
      undefined,
      "夜晚书店里，挑选喜欢的书籍"
    );
    console.log("场景2（用户输入）：");
    console.log(variation2);
    console.log("\n");

    const variation3 = generateSceneVariationPrompt(
      prompt1
    );
    console.log("场景3（自动变化）：");
    console.log(variation3);
    console.log("\n");

    console.log("=".repeat(80));
    console.log("测试完成！");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("测试失败:", error);
    if (error instanceof Error) {
      console.error("错误信息:", error.message);
      console.error("错误堆栈:", error.stack);
    }
    process.exit(1);
  }
}

// 运行测试
testPromptGeneration().catch(console.error);

