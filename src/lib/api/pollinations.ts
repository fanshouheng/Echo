/**
 * Pollinations AI API Client
 * Free image generation service - no API key required!
 * Docs: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md
 */

import { AppError, ErrorCode } from "./error-handler";

/**
 * Generate image using Pollinations AI
 * @param prompt - Image generation prompt
 * @param options - Generation options
 * @returns Promise<string[]> - Array of image URLs
 */
export async function generateImageWithPollinations(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    seed?: number;
    model?: "flux" | "flux-pro" | "flux-realism" | "turbo" | "flux-anime";
    nologo?: boolean;
    enhance?: boolean;
  } = {}
): Promise<string[]> {
  const {
    width = 1024,
    height = 1824, // 9:16 aspect ratio
    seed,
    model = "flux", // Default to flux model
    nologo = true, // Remove watermark
    enhance = true, // Enhance prompt automatically
  } = options;

  console.log("🎨 Pollinations AI Configuration:");
  console.log("  Model:", model);
  console.log("  Dimensions:", `${width}x${height}`);
  console.log("  Enhance:", enhance);
  console.log("  Prompt length:", prompt.length);

  try {
    // URL encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Build the URL with parameters
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      nologo: nologo.toString(),
      enhance: enhance.toString(),
      model: model,
    });

    if (seed !== undefined) {
      params.append("seed", seed.toString());
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    
    console.log("📝 Generated Pollinations URL");
    console.log("  URL:", imageUrl);
    console.log("  URL length:", imageUrl.length);

    // Pollinations generates images on-demand, no need to pre-check
    // Just return the URL directly
    console.log(`✅ Image URL generated successfully`);

    // Return the image URL (Pollinations generates on-the-fly)
    return [imageUrl];
  } catch (error: any) {
    console.error("❌ Pollinations generation error:");
    console.error("  Error type:", error?.constructor?.name);
    console.error("  Error message:", error?.message);
    console.error("  Error code:", error?.code);

    throw new AppError(
      ErrorCode.GENERATION_FAILED,
      `Pollinations 图像生成失败: ${error instanceof Error ? error.message : "未知错误"}`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Generate multiple images with different seeds
 */
export async function generateMultipleImagesWithPollinations(
  prompt: string,
  count: number = 3,
  options: Parameters<typeof generateImageWithPollinations>[1] = {}
): Promise<string[]> {
  console.log(`🎨 Generating ${count} images with Pollinations...`);

  const images: string[] = [];
  const baseSeed = options.seed || Date.now();

  for (let i = 0; i < count; i++) {
    const seed = baseSeed + i;
    const imageUrls = await generateImageWithPollinations(prompt, {
      ...options,
      seed,
    });
    images.push(...imageUrls);
  }

  console.log(`✅ Generated ${images.length} images successfully`);
  return images;
}

/**
 * Check if Pollinations API is available (always true - no API key needed)
 */
export function isPollinationsConfigured(): boolean {
  return true; // No configuration needed!
}

