/**
 * Generate Image API Route
 * POST /api/generate-image
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImageWithFlux, generateImageWithSDXL } from "@/lib/api/replicate";
import { generateImageWithImagen, isGeminiConfigured } from "@/lib/api/gemini";
import { generateImageWithPollinations, generateMultipleImagesWithPollinations } from "@/lib/api/pollinations";
import { handleAPIError, AppError, ErrorCode } from "@/lib/api/error-handler";
import { generateImageRequestSchema } from "@/lib/validators/schemas";
import {
  buildFluxPrompt,
  buildSDXLPrompt,
  buildPollinationsPrompt,
  negativePrompt,
  getImageDimensions,
} from "@/lib/prompts/image";
import { partnerToLegacyPersonality } from "@/types/partner-personality";

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

    const { personality, aspectRatio = "9:16", count = 1 } = validationResult.data;
    console.log("Personality:", personality.name);
    
    // Use partner data if available for better prompt generation, otherwise use legacy personality
    const promptPersonality = partnerData || personality;
    
    if (partnerData) {
      console.log("🎨 Using partner data for enhanced prompt generation");
    } else {
      console.log("🎨 Using legacy personality data for prompt generation");
    }
    
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
    let usedModel = "pollinations-flux-anime";

    try {
      // Primary: Pollinations AI (free, no API key required)
      // Generate each image with a different scene
      console.log("🎨 Attempting Pollinations AI generation (Pixel Art + Anime Style)...");
      console.log("Model: flux-anime");
      console.log("Dimensions:", `${dimensions.width}x${dimensions.height}`);
      console.log("Count:", count);
      console.log("Style: Pixel Art + Anime + Story Scenes");
      
      // Generate images one by one with different scene prompts
      for (let i = 0; i < count; i++) {
        const scenePrompt = buildPollinationsPrompt(promptPersonality, i);
        console.log(`📝 Scene ${i + 1} prompt:`, scenePrompt.substring(0, 150) + "...");
        
        const sceneImage = await generateImageWithPollinations(
          scenePrompt,
          {
            width: dimensions.width,
            height: dimensions.height,
            model: "turbo", // Use turbo model (faster and more reliable than flux)
            nologo: true,
            enhance: false, // Disable enhance to reduce URL length
            seed: Date.now() + i, // Different seed for each image
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
                aspectRatio: aspectRatio, // Use aspectRatio string (e.g., "9:16")
                numOutputs: 1, // Generate one image per iteration
              }
            );
            // generateImageWithFlux returns array, take first image
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
                  numOutputs: 1, // Generate one image per iteration
                }
              );
              // generateImageWithSDXL returns array, take first image
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

