/**
 * Generate Personality API Route
 * POST /api/generate-personality
 */

import { NextRequest, NextResponse } from "next/server";
import { generateJSONCompletion } from "@/lib/api/openai";
import { handleAPIError, AppError, ErrorCode } from "@/lib/api/error-handler";
import {
  generatePersonalityRequestSchema,
  personalityProfileSchema,
  type PersonalityProfile,
} from "@/lib/validators/schemas";
import {
  buildProfessionalPersonalityPrompt,
  professionalSystemPrompt,
} from "@/lib/prompts/personality-professional";
import { ProfessionalPersonalityProfile } from "@/types/personality-professional";
import { professionalToLegacy, isProfessionalProfile } from "@/lib/adapters/personality-adapter";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== Generate Personality API Called ===");
    
    // Parse request body
    const body = await request.json();
    console.log("Request body received, answers count:", body.answers?.length);

    // Validate request
    const validationResult = generatePersonalityRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "访谈答案格式不正确",
        new Error(validationResult.error.message)
      );
    }

    const { answers } = validationResult.data;

    // Check API configuration
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const modelName = process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o";
    const apiType = process.env.DEEPSEEK_API_KEY ? "DeepSeek" : "OpenAI";
    
    console.log(`Using ${apiType} API with model: ${modelName}`);
    console.log(`API Key configured: ${apiKey ? "Yes (length: " + apiKey.length + ")" : "No"}`);

    // Build prompt (using professional system)
    const userPrompt = buildProfessionalPersonalityPrompt(answers);
    console.log("Prompt built, length:", userPrompt.length);

    // Generate personality (professional format)
    console.log(`Calling ${apiType} API...`);
    const generatedData = await generateJSONCompletion<ProfessionalPersonalityProfile>(
      [
        {
          role: "system",
          content: professionalSystemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      {
        model: modelName,
        temperature: 0.8, // Higher temperature for more creativity
        maxRetries: 3,
      }
    );
    console.log("API call successful, personality generated:", generatedData.name);

    // Validate as professional profile
    if (!isProfessionalProfile(generatedData)) {
      throw new AppError(
        ErrorCode.GENERATION_FAILED,
        "AI生成的人格格式不符合要求",
        new Error("Generated data is not a valid professional profile")
      );
    }

    // Convert to legacy format for backward compatibility
    const personality = professionalToLegacy(generatedData);
    const generationTime = Date.now() - startTime;

    // Return success response
    return NextResponse.json(
      {
        personality,
        generationTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Personality generation error:", error);
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
}

// Disable body size limit for this route
export const runtime = "nodejs";
export const maxDuration = 30; // 30 seconds max

