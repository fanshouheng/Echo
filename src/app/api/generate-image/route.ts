/**
 * Generate Image API Route
 * POST /api/generate-image
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImageWithFlux, generateImageWithSDXL } from "@/lib/api/replicate";
import { generateImageWithImagen, isGeminiConfigured } from "@/lib/api/gemini";
import { generateImageWithPollinations } from "@/lib/api/pollinations";
import { generateImageWithDoubao, isDoubaoConfigured } from "@/lib/api/doubao";
import { handleAPIError, AppError, ErrorCode } from "@/lib/api/error-handler";
import { generateImageRequestSchema } from "@/lib/validators/schemas";
import {
  buildFluxPrompt,
  buildSDXLPrompt,
  buildPollinationsPrompt,
  buildDoubaoPrompt,
  negativePrompt,
  getImageDimensions,
} from "@/lib/prompts/image";
import { partnerToLegacyPersonality } from "@/types/partner-personality";
import { generateInitialImagePrompt, generateSceneVariationPrompt } from "@/lib/prompts/generate-image-prompt";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== Generate Image API Called ===");
    
    // Parse request body (only once!)
    const body = await request.json();
    console.log("Request received - Count:", body.count, "Aspect ratio:", body.aspectRatio);

    // Check if request includes partner data (optional, for enhanced prompts)
    const partnerData = (body as any).partner;

    // Validate request (only validate required fields)
    const validationResult = generateImageRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "请求格式不正确",
        new Error(validationResult.error.message)
      );
    }

    const { personality, aspectRatio = "9:16", count = 1, preferredGender, firstImagePrompt, sceneDescription, userInput } = validationResult.data;
    console.log("Personality:", personality.name);
    
    // Use partner data if available for better prompt generation, otherwise use legacy personality
    const promptPersonality = partnerData || personality;
    const isFirstGeneration = !firstImagePrompt;
    
    if (partnerData) {
      console.log("🎨 Using partner data for enhanced prompt generation");
    } else {
      console.log("🎨 Using legacy personality data for prompt generation");
    }
    
    console.log("📝 Generation type:", isFirstGeneration ? "首次生成（使用DeepSeek生成提示词）" : "后续场景（基于首次提示词）");
    
    // Check API configurations
    const geminiConfigured = isGeminiConfigured();
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    console.log(`Gemini configured: ${geminiConfigured} (key length: ${geminiKey?.length || 0})`);
    
    if (!geminiConfigured) {
      console.warn("⚠️ Gemini API not configured, will try Replicate fallback");
    }

    // Build prompts using enhanced personality data if available
    // Generate different scenes for each image (0, 1, 2 for count=3)
    const fluxPrompt = buildFluxPrompt(promptPersonality);
    const sdxlPrompt = buildSDXLPrompt(promptPersonality);
    const dimensions = getImageDimensions(aspectRatio);

    // Generate images with different scenes
    const images: string[] = [];
    let usedModel: "doubao" | "pollinations-flux" | "gemini-imagen" | "replicate-flux" | "replicate-sdxl" = "doubao";
    const doubaoConfigured = isDoubaoConfigured();
    console.log(`Doubao configured: ${doubaoConfigured}`);

    // 首次生成：使用 DeepSeek 生成提示词
    // 后续场景：基于首次提示词修改
    let imagePrompt: string | null = null;
    
    if (isFirstGeneration && partnerData) {
      // 首次生成，使用 DeepSeek 生成提示词
      console.log("🎯 首次生成：使用 DeepSeek 生成提示词...");
      try {
        imagePrompt = await generateInitialImagePrompt(partnerData as any, aspectRatio);
        console.log("✅ DeepSeek 生成的提示词:", imagePrompt);
      } catch (error) {
        console.error("❌ DeepSeek 生成提示词失败，使用 Fallback:", error);
        imagePrompt = buildDoubaoPrompt(promptPersonality, 0, aspectRatio, preferredGender);
      }
    } else if (firstImagePrompt) {
      // 后续场景，基于首次提示词修改
      console.log("🎯 后续场景生成：基于首次提示词修改...");
      imagePrompt = generateSceneVariationPrompt(
        firstImagePrompt,
        sceneDescription,
        userInput
      );
      console.log("📝 修改后的提示词:", imagePrompt);
    } else {
      // Fallback：使用程序生成的提示词
      imagePrompt = buildDoubaoPrompt(promptPersonality, 0, aspectRatio, preferredGender);
      console.log("⚠️ 使用程序生成的提示词（Fallback）:", imagePrompt);
    }

    try {
      if (!doubaoConfigured) {
        throw new Error("豆包AI接口未配置");
      }

      console.log("🎨 Attempting Doubao AI generation (Realistic Illustration)...");
      console.log("Dimensions:", `${dimensions.width}x${dimensions.height}`);
      console.log("Count:", count);
      console.log("Aspect Ratio:", aspectRatio);

      if (!imagePrompt) {
        throw new Error("提示词生成失败");
      }

      for (let i = 0; i < count; i++) {
        const scenePrompt = imagePrompt; // 使用生成的提示词
        console.log(`📝 Doubao Scene ${i + 1} prompt:`, scenePrompt);

        const sceneImages = await generateImageWithDoubao(scenePrompt, {
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio,
          watermark: false,
        });

        if (!sceneImages?.length) {
          throw new Error("豆包AI未返回图片");
        }

        images.push(sceneImages[0]);
        console.log(`✅ Doubao Scene ${i + 1} generated successfully`);
        
        // 首次生成时，保存提示词
        if (isFirstGeneration && i === 0 && partnerData) {
          // 提示词会在响应中返回，前端保存
          console.log("💾 首次生成提示词已保存，将在响应中返回");
        }
      }

      console.log(`✅ Doubao generated ${images.length} images successfully`);

    } catch (doubaoError: any) {
      console.error("❌ Doubao generation failed:");
      console.error("Error message:", doubaoError?.message || doubaoError);
      console.warn("⚠️ Falling back to Pollinations / Gemini / Replicate pipeline...");

      images.length = 0;
      usedModel = "pollinations-flux";

      try {
        console.log("🎨 Attempting Pollinations AI generation (Pixel Art + Anime Style)...");
        console.log("Model: flux");
        console.log("Dimensions:", `${dimensions.width}x${dimensions.height}`);
        console.log("Count:", count);
        console.log("Style: Pixel Art + Anime + Story Scenes");

        for (let i = 0; i < count; i++) {
          const scenePrompt = buildPollinationsPrompt(promptPersonality, i, preferredGender);
          console.log(`📝 Scene ${i + 1} prompt:`, scenePrompt.substring(0, 150) + "...");

          const sceneImage = await generateImageWithPollinations(
            scenePrompt,
            {
              width: dimensions.width,
              height: dimensions.height,
              model: "flux",
              nologo: true,
              enhance: false,
              seed: Date.now() + i,
            }
          );

          images.push(...sceneImage);
          console.log(`✅ Scene ${i + 1} generated successfully`);
        }

        console.log(`✅ Pollinations generated ${images.length} images successfully`);

      } catch (pollinationsError: any) {
        console.error("❌ Pollinations generation failed:");
        console.error("Error message:", pollinationsError?.message);
        console.warn("⚠️ Falling back to Gemini Imagen...");

        // Fallback 1: Gemini Imagen
        try {
          if (isGeminiConfigured()) {
            console.log("🎨 Attempting Gemini Imagen 4 generation...");
            const generatedImages = await generateImageWithImagen(fluxPrompt, {
              negativePrompt,
              aspectRatio,
              numberOfImages: count,
              model: "imagen-4.0-standard-generate-001",
            });
            console.log(`✅ Gemini Imagen generated ${generatedImages.length} images successfully`);
            images.push(...generatedImages);
            usedModel = "gemini-imagen";
          } else {
            throw new Error("Gemini API not configured");
          }
        } catch (imagenError: any) {
          console.error("❌ Gemini Imagen generation failed:", imagenError?.message);
          console.warn("⚠️ Falling back to Replicate Flux...");

          // Fallback 2: Replicate Flux
          try {
            usedModel = "replicate-flux";
            console.log("Attempting Replicate Flux generation...");
            for (let i = 0; i < count; i++) {
              const generatedImages = await generateImageWithFlux(
                fluxPrompt,
                {
                  aspectRatio: aspectRatio,
                  numOutputs: 1,
                }
              );
              images.push(generatedImages[0]);
            }
            console.log(`✅ Replicate Flux generated ${images.length} images successfully`);
          } catch (fluxError) {
            console.warn("Replicate Flux generation failed, falling back to SDXL:", fluxError);

            // Fallback 3: Replicate SDXL (final fallback)
            try {
              usedModel = "replicate-sdxl";
              console.log("Attempting Replicate SDXL generation...");
              for (let i = 0; i < count; i++) {
                const generatedImages = await generateImageWithSDXL(
                  sdxlPrompt,
                  {
                    width: dimensions.width,
                    height: dimensions.height,
                    numOutputs: 1,
                  }
                );
                images.push(generatedImages[0]);
              }
              console.log(`✅ Replicate SDXL generated ${images.length} images successfully`);
            } catch (sdxlError) {
              console.error("All image generation methods failed:", sdxlError);
              throw new AppError(
                ErrorCode.GENERATION_FAILED,
                "图像生成失败，所有服务均不可用",
                sdxlError instanceof Error ? sdxlError : new Error(String(sdxlError))
              );
            }
          }
        }
      }
    }

    const generationTime = Date.now() - startTime;

    // Return success response
    // 如果是首次生成且使用了 DeepSeek 生成的提示词，返回提示词供前端保存
    const response: any = {
      images,
      usedModel,
      generationTime,
    };
    
    if (isFirstGeneration && partnerData && imagePrompt && usedModel === "doubao") {
      response.firstImagePrompt = imagePrompt;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Image generation error:", error);
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
}

// Replicate predictions can take a while
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max

