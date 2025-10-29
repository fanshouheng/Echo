/**
 * API Connection Test Script
 * Run this to verify OpenAI and Replicate API connectivity
 * 
 * Usage:
 * 1. Ensure .env.local has OPENAI_API_KEY and REPLICATE_API_TOKEN
 * 2. Run: npx tsx scripts/test-api.ts
 */

import { generateCompletion, isOpenAIConfigured } from "../src/lib/api/openai";
import { isReplicateConfigured } from "../src/lib/api/replicate";

async function testOpenAI() {
  console.log("\n🔍 测试 OpenAI API 连接...\n");
  
  if (!isOpenAIConfigured()) {
    console.error("❌ OPENAI_API_KEY 未配置");
    return false;
  }
  
  try {
    const response = await generateCompletion([
      {
        role: "system",
        content: "你是一个测试助手，用中文回复。",
      },
      {
        role: "user",
        content: "请简单回复'连接成功'",
      },
    ], {
      maxTokens: 50,
    });
    
    console.log("✅ OpenAI API 连接成功");
    console.log(`📝 响应: ${response}\n`);
    return true;
  } catch (error) {
    console.error("❌ OpenAI API 连接失败:", error);
    return false;
  }
}

async function testReplicate() {
  console.log("\n🔍 测试 Replicate API 配置...\n");
  
  if (!isReplicateConfigured()) {
    console.error("❌ REPLICATE_API_TOKEN 未配置");
    return false;
  }
  
  console.log("✅ Replicate API Token 已配置");
  console.log("ℹ️  图像生成需要较长时间，跳过实际测试\n");
  return true;
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("     Echo API 连接测试");
  console.log("═══════════════════════════════════════");
  
  const openaiOk = await testOpenAI();
  const replicateOk = await testReplicate();
  
  console.log("═══════════════════════════════════════");
  console.log("\n📊 测试结果:");
  console.log(`  OpenAI: ${openaiOk ? "✅ 通过" : "❌ 失败"}`);
  console.log(`  Replicate: ${replicateOk ? "✅ 通过" : "❌ 失败"}`);
  console.log("\n═══════════════════════════════════════\n");
  
  if (openaiOk && replicateOk) {
    console.log("🎉 所有 API 配置正确！可以开始开发。\n");
    process.exit(0);
  } else {
    console.log("⚠️  请检查 .env.local 文件中的 API keys\n");
    process.exit(1);
  }
}

main();

