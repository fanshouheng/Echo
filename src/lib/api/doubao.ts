/**
 * Doubao AI API Client (豆包AI)
 * Volcano Engine Doubao Image Generation API
 * Docs: https://www.volcengine.com/docs/82379/1541523
 */

import { AppError, ErrorCode } from "./error-handler";

const DOUBAO_API_KEY = "d4ece488-75bc-4ab7-945e-812dce2c492c";
const DOUBAO_ENDPOINT_ID = "ep-20251103133548-j5md8";
const DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

/**
 * Generate image using Doubao AI
 * @param prompt - Image generation prompt (中文提示词)
 * @param options - Generation options
 * @returns Promise<string[]> - Array of image URLs
 */
export async function generateImageWithDoubao(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    size?: "1K" | "2K";
    watermark?: boolean;
    responseFormat?: "url" | "b64_json";
    aspectRatio?: "16:9" | "9:16" | "1:1" | string;
  } = {}
): Promise<string[]> {
  const {
    width = 1920,
    height = 1080,
    size,
    watermark = false, // 默认不去水印
    responseFormat = "url",
    aspectRatio = "16:9",
  } = options;

  console.log("🎨 Doubao AI Configuration:");
  console.log("  Endpoint ID:", DOUBAO_ENDPOINT_ID);
  console.log("  Dimensions:", `${width}x${height}`);
  console.log("  Prompt length:", prompt.length);
  console.log("  Prompt (preview):", prompt.substring(0, 100) + "...");

  try {
    const url = `${DOUBAO_API_BASE_URL}/images/generations`;
    
    // 确定size参数
    let imageSize: "1K" | "2K" = size || "2K";
    if (!size) {
      if (width === 1920 && height === 1080) {
        imageSize = "2K";
      } else if (width === 1024 && height === 1024) {
        imageSize = "1K";
      } else if (width === 2048 && height === 2048) {
        imageSize = "2K";
      }
    }

    const requestBody: any = {
      model: DOUBAO_ENDPOINT_ID, // 推理点ID作为model参数
      prompt: prompt,
      sequential_image_generation: "disabled",
      response_format: responseFormat,
      size: imageSize,
      stream: false,
      watermark: watermark,
      aspect_ratio: aspectRatio,
    };

    // 显式传递宽高，确保 16:9 输出
    if (width && height) {
      requestBody.width = width;
      requestBody.height = height;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DOUBAO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Doubao API Error Response:", errorText);
      throw new Error(`Doubao API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📝 Doubao API Response:", JSON.stringify(data, null, 2));

    // 解析响应中的图片URL
    let imageUrls: string[] = [];

    if (data.data && Array.isArray(data.data) && data.data[0]) {
      // 标准格式：{ data: [{ url: "..." }] }
      imageUrls = data.data.map((item: any) => item.url || item.b64_json || item);
    } else if (data.url) {
      imageUrls = [data.url];
    } else if (data.image) {
      imageUrls = [data.image];
    } else {
      console.warn("⚠️ Unexpected response format:", data);
      throw new Error("无法解析API响应中的图片数据");
    }

    console.log(`✅ Generated ${imageUrls.length} image(s) successfully`);
    return imageUrls;
  } catch (error: any) {
    console.error("❌ Doubao generation error:");
    console.error("  Error type:", error?.constructor?.name);
    console.error("  Error message:", error?.message);
    console.error("  Error code:", error?.code);

    throw new AppError(
      ErrorCode.GENERATION_FAILED,
      `豆包AI图像生成失败: ${error instanceof Error ? error.message : "未知错误"}`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Check if Doubao API is configured
 */
export function isDoubaoConfigured(): boolean {
  return !!DOUBAO_API_KEY && !!DOUBAO_ENDPOINT_ID;
}

