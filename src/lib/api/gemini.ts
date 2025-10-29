/**
 * Google Gemini API Client
 * Handles image generation using Imagen 4
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY 环境变量未设置");
    }

    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

/**
 * Generate image using Imagen 4
 * @param prompt - Image generation prompt
 * @param options - Generation options
 * @returns Promise<string> - Base64 encoded image
 */
export async function generateImageWithImagen(
  prompt: string,
  options: {
    negativePrompt?: string;
    aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    numberOfImages?: number;
    model?: "imagen-4.0-standard-generate-001" | "imagen-4.0-fast-generate-001" | "imagen-4.0-ultra-generate-001";
  } = {}
): Promise<string[]> {
  const {
    negativePrompt = "",
    aspectRatio = "9:16",
    numberOfImages = 1,
    model = "imagen-4.0-standard-generate-001", // Standard model (balanced quality & speed)
  } = options;

  console.log("🔧 Gemini Imagen API Configuration:");
  console.log("  Model:", model);
  console.log("  Aspect Ratio:", aspectRatio);
  console.log("  Number of Images:", numberOfImages);
  console.log("  API Key configured:", !!process.env.GOOGLE_GEMINI_API_KEY);
  console.log("  API Key length:", process.env.GOOGLE_GEMINI_API_KEY?.length || 0);

  const client = getGeminiClient();
  const imageModel = client.getGenerativeModel({ model });

  try {
    // Build the full prompt with negative prompt
    const fullPrompt = negativePrompt
      ? `${prompt}\n\nNegative prompt: ${negativePrompt}`
      : prompt;

    console.log("📝 Calling Gemini API...");
    console.log("  Prompt length:", fullPrompt.length);

    // Generate images
    const result = await imageModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        // Imagen 4 specific configuration
        candidateCount: numberOfImages,
      },
    });

    const response = await result.response;
    const images: string[] = [];

    // Extract base64 images from response
    if (response.candidates) {
      for (const candidate of response.candidates) {
        if (candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              // Return base64 data URL
              const mimeType = part.inlineData.mimeType || "image/png";
              images.push(`data:${mimeType};base64,${part.inlineData.data}`);
            }
          }
        }
      }
    }

    if (images.length === 0) {
      throw new Error("Imagen 未返回有效图像");
    }

    console.log(`✅ Successfully generated ${images.length} images`);
    console.log(`  Image sizes: ${images.map(img => `${Math.round(img.length / 1024)}KB`).join(", ")}`);
    
    return images;
  } catch (error: any) {
    console.error("❌ Imagen generation error:");
    console.error("  Error type:", error?.constructor?.name);
    console.error("  Error message:", error?.message);
    console.error("  Error code:", error?.code);
    console.error("  Error status:", error?.status || error?.response?.status);
    
    // Log detailed error information
    if (error?.response) {
      console.error("  Response status:", error.response.status);
      console.error("  Response data:", error.response.data);
    }
    
    // Check for specific error types
    if (error?.status === 503 || error?.response?.status === 503) {
      console.error("  ⚠️ Gemini API 服务暂时不可用 (503)");
      console.error("  可能原因:");
      console.error("    1. Gemini API 服务器过载或维护中");
      console.error("    2. API Key 无效或额度不足");
      console.error("    3. Imagen 4 模型尚未在你的区域可用");
    }
    
    if (error?.status === 400 || error?.response?.status === 400) {
      console.error("  ⚠️ 请求参数错误 (400)");
      console.error("  可能原因:");
      console.error("    1. Prompt 格式不正确");
      console.error("    2. 模型名称错误");
      console.error("    3. 配置参数不支持");
    }
    
    throw new Error(
      `Imagen 图像生成失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GOOGLE_GEMINI_API_KEY;
}

