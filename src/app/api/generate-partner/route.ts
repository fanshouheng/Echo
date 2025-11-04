/**
 * Partner Generation API Route
 * Generate ideal partner personality based on relationship psychology
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  buildPartnerGenerationPrompt, 
  partnerGenerationSystemPrompt,
  parsePartnerPersonalityJSON 
} from "@/lib/prompts/partner-generation";
import { 
  PartnerPersonalityProfile, 
  PartnerGenerationRequest,
  validatePartnerProfile,
  partnerToLegacyPersonality
} from "@/types/partner-personality";
import { InterviewAnswer } from "@/types/interview";

// DeepSeek API configuration
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// OpenAI API configuration (fallback)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Partner generation API called");
    
    // Parse request body
    const body: PartnerGenerationRequest = await request.json();
    const { answers, preferredGender } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "访谈答案不能为空" },
        { status: 400 }
      );
    }

    console.log(`📝 Processing ${answers.length} answers for partner generation`);

    // Convert to InterviewAnswer format
    const interviewAnswers: InterviewAnswer[] = answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
      answeredAt: Date.now(),
    }));

    // Build partner generation prompt
    const userPrompt = buildPartnerGenerationPrompt(interviewAnswers, preferredGender);
    console.log("📋 Partner generation prompt built");

    // Try DeepSeek first, then OpenAI as fallback
    let response: any;
    let model = "";
    const startTime = Date.now();

    if (DEEPSEEK_API_KEY) {
      console.log("🧠 思考模式已启用：优先使用 DeepSeek Reasoner (推理模型)");
      console.log("📊 配置：max_tokens=8000, 无超时限制（后台持续生成）");
      try {
        response = await callDeepSeekAPI(userPrompt, true); // 尝试推理模型
        model = "deepseek-reasoner";
        console.log("✅ 成功使用 DeepSeek Reasoner (思考模式)");
      } catch (error) {
        console.error("❌ DeepSeek Reasoner 失败，回退到普通模型:", error);
        try {
          // 回退到普通模型（无思考模式）
          response = await callDeepSeekAPI(userPrompt, false);
          model = "deepseek-chat";
          console.warn("⚠️ 已回退到 DeepSeek Chat (无思考模式)");
        } catch (fallbackError) {
          console.error("❌ DeepSeek API 完全失败:", fallbackError);
          if (OPENAI_API_KEY) {
            console.log("🔄 回退到 OpenAI GPT-4o");
            response = await callOpenAIAPI(userPrompt);
            model = "gpt-4o";
          } else {
            throw fallbackError;
          }
        }
      }
    } else if (OPENAI_API_KEY) {
      console.log("🤖 使用 OpenAI GPT-4o (无思考模式)");
      response = await callOpenAIAPI(userPrompt);
      model = "gpt-4o";
    } else {
      throw new Error("No API keys configured");
    }

    const generationTime = Date.now() - startTime;
    console.log(`⏱️ Partner generation completed in ${generationTime}ms`);

    // Parse the response
    const partnerData = parsePartnerPersonalityJSON(response);
    
    if (!validatePartnerProfile(partnerData)) {
      console.error("❌ Invalid partner profile structure:", partnerData);
      throw new Error("生成的伴侣档案格式不正确");
    }

    const partner = partnerData as PartnerPersonalityProfile;
    console.log(`✅ Partner generated: ${partner.name} (${partner.nickname})`);

    // Convert to legacy format for compatibility
    const legacyPersonality = partnerToLegacyPersonality(partner);

    return NextResponse.json({
      partner,
      legacyPersonality, // For backward compatibility
      generationTime,
      model,
    });

  } catch (error) {
    console.error("❌ Partner generation error:", error);
    
    return NextResponse.json(
      { 
        error: "伴侣生成失败",
        details: error instanceof Error ? error.message : "未知错误"
      },
      { status: 500 }
    );
  }
}

/**
 * Call DeepSeek API for partner generation
 * @param userPrompt - User prompt
 * @param useReasoner - Whether to use reasoning model (deepseek-reasoner)
 */
async function callDeepSeekAPI(userPrompt: string, useReasoner: boolean = true): Promise<string> {
  const modelName = useReasoner ? "deepseek-reasoner" : "deepseek-chat";
  const maxTokens = useReasoner ? 8000 : 4000;
  
  console.log(`📡 Calling DeepSeek API with model: ${modelName} (thinking: ${useReasoner})`);
  
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: partnerGenerationSystemPrompt,
        },
        {
          role: "user", 
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid DeepSeek API response format");
  }

  return data.choices[0].message.content;
}

/**
 * Call OpenAI API for partner generation (fallback)
 */
async function callOpenAIAPI(userPrompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: partnerGenerationSystemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid OpenAI API response format");
  }

  return data.choices[0].message.content;
}

// Disable body size limit and remove timeout restriction for background generation
export const runtime = "nodejs";
// 注意：Next.js 在某些平台（如 Vercel）可能有硬性限制：
// - Hobby 计划：最多 60 秒
// - Pro 计划：最多 300 秒
// - 自托管：可以设置更大或无限
// 如果部署在 Vercel，建议升级到 Pro 计划或使用自托管
export const maxDuration = 300; // 300 seconds (5 minutes) - 最大可用值（某些平台可能仍有限制）

