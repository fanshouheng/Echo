/**
 * Background Images Generation Script
 * 生成 9 张背景图片的辅助脚本
 * 
 * 使用方法：
 * 1. 运行此脚本生成所有图片 URL
 * 2. 将生成的 URL 复制到 background-images.ts
 */

import { generateImageWithPollinations } from "@/lib/api/pollinations";
import { backgroundImagePrompts } from "@/data/background-image-prompts";

/**
 * 生成所有背景图片
 * @returns 生成的图片 URL 数组
 */
export async function generateAllBackgroundImages(): Promise<{
  id: string;
  url: string;
  prompt: string;
}[]> {
  console.log("🎨 开始生成 9 张背景图片...\n");

  const results: { id: string; url: string; prompt: string }[] = [];

  for (let i = 0; i < backgroundImagePrompts.length; i++) {
    const promptData = backgroundImagePrompts[i];
    console.log(`📸 生成图片 ${i + 1}/9: ${promptData.category} - ${promptData.description}`);

    try {
      // 生成图片 URL
      const imageUrls = await generateImageWithPollinations(
        promptData.prompt,
        {
          width: 1920,
          height: 1080, // 16:9 比例，适合背景
          model: "turbo", // 快速模型，也可以使用 "anime" 获得更像素的风格
          nologo: true,
          enhance: false, // 不使用增强，保持原始风格
          seed: Date.now() + i, // 每张图不同的 seed
        }
      );

      if (imageUrls.length > 0) {
        results.push({
          id: promptData.id,
          url: imageUrls[0],
          prompt: promptData.prompt,
        });
        console.log(`✅ 图片 ${i + 1} 生成成功`);
        console.log(`   URL: ${imageUrls[0]}\n`);
      } else {
        console.error(`❌ 图片 ${i + 1} 生成失败：无返回 URL\n`);
      }
    } catch (error: any) {
      console.error(`❌ 图片 ${i + 1} 生成失败:`, error?.message || error);
      console.log(`   提示词: ${promptData.prompt.substring(0, 100)}...\n`);
    }

    // 延迟一下，避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n✅ 生成完成！共成功生成 ${results.length}/9 张图片`);
  console.log("\n📋 生成的图片 URL：\n");
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.id}:`);
    console.log(`   ${result.url}\n`);
  });

  return results;
}

/**
 * 生成单个背景图片（用于测试）
 */
export async function generateSingleBackgroundImage(
  index: number = 0
): Promise<string | null> {
  if (index < 0 || index >= backgroundImagePrompts.length) {
    console.error("❌ 索引超出范围");
    return null;
  }

  const promptData = backgroundImagePrompts[index];
  console.log(`📸 生成图片: ${promptData.category} - ${promptData.description}`);
  console.log(`   提示词: ${promptData.prompt.substring(0, 100)}...`);

  try {
    const imageUrls = await generateImageWithPollinations(
      promptData.prompt,
      {
        width: 1920,
        height: 1080,
        model: "turbo",
        nologo: true,
        enhance: false,
      }
    );

    if (imageUrls.length > 0) {
      console.log(`✅ 生成成功: ${imageUrls[0]}`);
      return imageUrls[0];
    }
  } catch (error: any) {
    console.error(`❌ 生成失败:`, error?.message || error);
  }

  return null;
}

