/**
 * Test scene variation image generation
 * 使用后续场景提示词生成图片
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

// 豆包 API 配置
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

async function testSceneVariation() {
  console.log("\n" + "=".repeat(80));
  console.log("后续场景图片生成测试（基于首次提示词）");
  console.log("=".repeat(80) + "\n");

  // 首次提示词（从上次生成的结果）
  const firstPrompt = "写实插画，竖版，清晨柔和光线。简约厨房中女孩穿着家居服准备早餐，阳光从窗户洒入照亮台面的食材，画面仅出现这一位主角，色调温暖自然，氛围安静温馨。";

  console.log("📝 首次提示词：");
  console.log(firstPrompt);
  console.log("\n");

  // 导入场景变化函数
  const { generateSceneVariationPrompt } = await import("../src/lib/prompts/generate-image-prompt");

  // 生成多个不同的场景变化
  const scenes = [
    {
      name: "黄昏散步场景",
      description: "黄昏街区的石板路，手持咖啡缓步前行"
    },
    {
      name: "夜晚书店场景",
      description: undefined,
      userInput: "夜晚书店里，挑选喜欢的书籍"
    },
    {
      name: "午后咖啡场景",
      description: "午后窗边的咖啡角，静静阅读"
    }
  ];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    console.log(`${i + 1}️⃣ 生成场景：${scene.name}`);
    console.log("-".repeat(80));
    
    // 生成场景变化的提示词
    const variationPrompt = generateSceneVariationPrompt(
      firstPrompt,
      scene.description,
      scene.userInput
    );

    console.log("✅ 生成的提示词：");
    console.log(variationPrompt);
    console.log(`长度: ${variationPrompt.length} 字符\n`);

    try {
      console.log("⏳ 调用豆包 API 生成图片...");
      const startTime = Date.now();
      const imageUrls = await generateImageWithDoubao(variationPrompt, "9:16");
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`✅ 图片生成成功！耗时: ${elapsed} 秒`);
      console.log(`📸 图片 URL: ${imageUrls[0]}`);
      console.log("\n");

    } catch (error) {
      console.error(`❌ 生成失败:`, error);
      console.log("\n");
    }
  }

  console.log("=".repeat(80));
  console.log("✅ 测试完成！");
  console.log("=".repeat(80));
  console.log("\n💡 提示：");
  console.log("   - 后续场景基于首次提示词生成");
  console.log("   - 保持形象不变，只更换场景和穿搭");
  console.log("   - 可以在浏览器中打开图片 URL 查看效果");
}

testSceneVariation().catch(console.error);

