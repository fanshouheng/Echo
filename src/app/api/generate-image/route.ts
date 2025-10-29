/**
 * Generate Image API Route
 * POST /api/generate-image
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImageWithFlux, generateImageWithSDXL } from "@/lib/api/replicate";
import { generateImageWithImagen, isGeminiConfigured } from "@/lib/api/gemini";
import { generateMultipleImagesWithPollinations } from "@/lib/api/pollinations";
import { handleAPIError, AppError, ErrorCode } from "@/lib/api/error-handler";
import { generateImageRequestSchema } from "@/lib/validators/schemas";
import {
  buildFluxPrompt,
  buildSDXLPrompt,
  buildPollinationsPrompt,
  negativePrompt,
  getImageDimensions,
} from "@/lib/prompts/image";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== Generate Image API Called ===");
    
    // Parse request body
    const body = await request.json();
    console.log("Request received - Count:", body.count, "Aspect ratio:", body.aspectRatio);

    // Validate request
    const validationResult = generateImageRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "请求格式不正确",
        new Error(validationResult.error.message)
      );
    }

    const { personality, aspectRatio = "9:16", count = 1 } = validationResult.data;
    console.log("Personality:", personality.name);
    
    // Check API configurations
    const geminiConfigured = isGeminiConfigured();
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    console.log(`Gemini configured: ${geminiConfigured} (key length: ${geminiKey?.length || 0})`);
    
    if (!geminiConfigured) {
      console.warn("⚠️ Gemini API not configured, will try Replicate fallback");
    }

    // Build prompts
    const fluxPrompt = buildFluxPrompt(personality);
    const sdxlPrompt = buildSDXLPrompt(personality);
    const pollinationsPrompt = buildPollinationsPrompt(personality); // Simplified for URL
    const dimensions = getImageDimensions(aspectRatio);

    // Generate images
    const images: string[] = [];
    let usedModel = "pollinations-flux";

    try {
      // Primary: Pollinations AI (free, no API key required)
      console.log("🎨 Attempting Pollinations AI generation...");
      console.log("Model: flux");
      console.log("Dimensions:", `${dimensions.width}x${dimensions.height}`);
      console.log("Count:", count);
      console.log("Prompt:", pollinationsPrompt);
      console.log("Prompt length:", pollinationsPrompt.length, "characters");
      
      const generatedImages = await generateMultipleImagesWithPollinations(
        pollinationsPrompt, // Use simplified prompt
        count,
        {
          width: dimensions.width,
          height: dimensions.height,
          model: "flux",
          nologo: true,
          enhance: true,
        }
      );
      
      console.log(`✅ Pollinations generated ${generatedImages.length} images successfully`);
      images.push(...generatedImages);
      usedModel = "pollinations-flux";
      
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
            const imageUrl = await generateImageWithFlux(
              fluxPrompt,
              negativePrompt,
              dimensions.width,
              dimensions.height
            );
            images.push(imageUrl);
          }
          console.log(`✅ Replicate Flux generated ${images.length} images successfully`);
        } catch (fluxError) {
          console.warn("Replicate Flux generation failed, falling back to SDXL:", fluxError);

          // Fallback 3: Replicate SDXL (final fallback)
          try {
            usedModel = "replicate-sdxl";
            console.log("Attempting Replicate SDXL generation...");
            for (let i = 0; i < count; i++) {
              const imageUrl = await generateImageWithSDXL(
                sdxlPrompt,
                negativePrompt,
                dimensions.width,
                dimensions.height
              );
              images.push(imageUrl);
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

    const generationTime = Date.now() - startTime;

    // Return success response
    return NextResponse.json(
      {
        images,
        usedModel,
        generationTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
}

// Replicate predictions can take a while
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max

