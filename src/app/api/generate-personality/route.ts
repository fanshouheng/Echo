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
    const useDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const modelName = useDeepSeek ? "deepseek-reasoner" : "gpt-4o"; // 使用推理模型开启思考模式
    const apiType = useDeepSeek ? "DeepSeek Reasoner" : "OpenAI";
    
    console.log(`🧠 思考模式已启用: 使用 ${apiType} API，模型 ${modelName}`);
    console.log(`📊 配置: max_tokens=8000, 无超时限制（后台持续生成）`);
    console.log(`🔑 API Key 已配置: ${apiKey ? "是 (长度: " + apiKey.length + ")" : "否"}`);

    // Build prompt (using professional system)
    const userPrompt = buildProfessionalPersonalityPrompt(answers);
    console.log("📋 提示词已构建，长度:", userPrompt.length);

    // Generate personality (professional format)
    console.log(`🚀 正在调用 ${apiType} API (思考模式)...`);
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
        temperature: 1.2, // Increased temperature for more creativity and diversity
        maxRetries: 3,
        enableThinking: true, // 开启思考模式
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

// Disable body size limit and remove timeout restriction for background generation
export const runtime = "nodejs";
// 注意：Next.js 在某些平台（如 Vercel）可能有硬性限制：
// - Hobby 计划：最多 60 秒
// - Pro 计划：最多 300 秒
// - 自托管：可以设置更大或无限
// 如果部署在 Vercel，建议升级到 Pro 计划或使用自托管
export const maxDuration = 300; // 300 seconds (5 minutes) - 最大可用值（某些平台可能仍有限制）

