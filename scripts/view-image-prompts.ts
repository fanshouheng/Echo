/**
 * 查看生图提示词
 * 运行此脚本可以查看实际生成的提示词
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

import { generateInitialImagePrompt, generateSceneVariationPrompt } from "../src/lib/prompts/generate-image-prompt";
import type { PartnerPersonalityProfile } from "../src/types/partner-personality";

// 示例人格档案（用于测试）
const testPartner: PartnerPersonalityProfile = {
  name: "小静",
  nickname: "静静",
  gender: "female",
  age: 25,
  vibe: "安静、温柔、有边界感",
  corePersonality: {
    primaryTraits: ["安静", "温柔", "有边界感"],
    secondaryTraits: ["可靠", "耐心", "情绪稳定"],
    bigFive: {
      openness: 0.6,
      conscientiousness: 0.8,
      extraversion: 0.3,
      agreeableness: 0.7,
      neuroticism: 0.2,
    },
  },
  lifestyleCompatibility: {
    dailyRhythm: "早睡早起，规律作息",
    hobbySharing: "阅读、听音乐、安静的活动",
  },
  dailyLifeScenes: {
    morningRoutine: "清晨的窗边，静坐思考",
    eveningRoutine: "夜晚的书房，安静阅读",
    weekendActivity: "午后的咖啡角，享受独处时光",
    quietMoments: "安静的角落，专注自己的事情",
  },
  visualProfile: {
    primaryScene: "午后窗边的咖啡角",
    secondaryScene: "夜晚的书房",
  },
} as PartnerPersonalityProfile;

async function main() {
  console.log("=".repeat(60));
  console.log("🎨 Echo 生图提示词查看工具");
  console.log("=".repeat(60));
  console.log();

  try {
    // 1. 生成首次提示词
    console.log("【1️⃣ 首次形象提示词生成】");
    console.log("-".repeat(60));
    console.log("人物信息：");
    console.log(`  名字：${testPartner.name}（${testPartner.nickname}）`);
    console.log(`  性别：${testPartner.gender === "female" ? "女孩" : "青年"}`);
    console.log(`  性格：${testPartner.corePersonality.primaryTraits.join("、")}`);
    console.log();
    
    const firstPrompt = await generateInitialImagePrompt(testPartner, "9:16");
    console.log("✅ 生成的提示词：");
    console.log(firstPrompt);
    console.log(`📏 长度：${firstPrompt.length} 字符`);
    console.log();

    // 2. 生成后续场景提示词（多个）
    console.log("【2️⃣ 后续场景提示词生成】");
    console.log("-".repeat(60));
    
    for (let i = 0; i < 5; i++) {
      console.log(`\n场景 ${i + 1}（场景索引：${i}）：`);
      const scenePrompt = await generateSceneVariationPrompt(
        firstPrompt,
        undefined,
        undefined,
        i,
        testPartner
      );
      console.log("✅ 生成的提示词：");
      console.log(scenePrompt);
      console.log(`📏 长度：${scenePrompt.length} 字符`);
    }

    console.log();
    console.log("=".repeat(60));
    console.log("✅ 提示词查看完成");
    console.log("=".repeat(60));
    console.log();
    console.log("💡 提示：");
    console.log("   - 首次提示词由 DeepSeek 根据人格档案生成");
    console.log("   - 后续场景提示词基于首次提示词，保持形象一致");
    console.log("   - 场景会根据场景索引自动变化，确保多样性");
    console.log("   - 实际生成图片时，这些提示词会发送给豆包 AI");

  } catch (error) {
    console.error("❌ 错误：", error);
    if (error instanceof Error) {
      console.error("错误信息：", error.message);
      console.error("错误堆栈：", error.stack);
    }
    process.exit(1);
  }
}

main();

