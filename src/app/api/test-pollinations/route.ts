/**
 * Pollinations API Test Route
 * Test if Pollinations AI image generation works
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImageWithPollinations } from "@/lib/api/pollinations";

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    service: "Pollinations AI",
    apiKeyRequired: false,
    test: {} as Record<string, any>,
  };

  try {
    console.log("=== Testing Pollinations AI ===");

    // Test image generation
    console.log("Test: Generating a simple test image...");
    const startTime = Date.now();

    try {
      const testPrompt = "A beautiful sunset over mountains, digital art, high quality";
      
      const imageUrls = await generateImageWithPollinations(testPrompt, {
        width: 512,
        height: 512,
        model: "flux",
        nologo: true,
        enhance: true,
      });

      const duration = Date.now() - startTime;

      testResults.test = {
        success: true,
        duration: `${duration}ms`,
        model: "flux",
        imageCount: imageUrls.length,
        imageUrl: imageUrls[0],
        promptUsed: testPrompt,
        note: "Image URL is generated instantly - actual generation happens when accessed",
      };

      console.log("✅ Pollinations test passed!");
      console.log("Image URL:", imageUrls[0]);

      return NextResponse.json({
        success: true,
        message: "Pollinations AI 可用！完全免费，无需 API Key",
        results: testResults,
        advantages: [
          "✅ 完全免费",
          "✅ 无需 API Key",
          "✅ 无需注册",
          "✅ 支持中文 prompt",
          "✅ 多种模型可选（flux, flux-pro, flux-realism, flux-anime, turbo）",
          "✅ 按需生成，速度快",
        ],
        nextSteps: [
          "可以直接在生成流程中使用 Pollinations",
          "无需任何配置",
          "建议作为主要图像生成服务",
        ],
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;

      testResults.test = {
        success: false,
        duration: `${duration}ms`,
        errorType: error.constructor?.name,
        errorMessage: error.message,
        errorCode: error.code,
      };

      console.error("❌ Pollinations test failed:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Pollinations 测试失败",
          message: error.message,
          results: testResults,
          troubleshooting: [
            "检查网络连接",
            "尝试访问 https://image.pollinations.ai/ 验证服务是否可用",
            "如果网络问题，考虑使用代理",
          ],
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error during test:", error);
    return NextResponse.json(
      {
        success: false,
        error: "测试过程中发生意外错误",
        message: error.message,
        results: testResults,
      },
      { status: 500 }
    );
  }
}

