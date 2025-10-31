/**
 * OpenAI API Client
 * Handles personality generation using DeepSeek/GPT-4
 */

import OpenAI from "openai";

// Initialize OpenAI-compatible client (supports DeepSeek)
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    // 优先使用 DeepSeek，否则使用 OpenAI
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!deepseekKey && !openaiKey) {
      throw new Error("DEEPSEEK_API_KEY 或 OPENAI_API_KEY 环境变量未设置");
    }
    
    openaiClient = new OpenAI({
      apiKey: deepseekKey || openaiKey,
      baseURL: deepseekKey 
        ? "https://api.deepseek.com" 
        : "https://api.openai.com/v1",
    });
  }
  
  return openaiClient;
}

/**
 * Generate completion with retry logic
 */
export async function generateCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    enableThinking?: boolean; // 开启思考模式
  } = {}
): Promise<string> {
  const {
    model,
    temperature = 0.7,
    maxTokens = 2000,
    maxRetries = 3,
    enableThinking = true, // 默认开启思考模式
  } = options;

  // 如果使用 DeepSeek 且开启思考模式，优先使用推理模型
  const useDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const finalModel = model || (useDeepSeek && enableThinking ? "deepseek-reasoner" : useDeepSeek ? "deepseek-chat" : "gpt-4o");
  const finalMaxTokens = enableThinking && finalModel === "deepseek-reasoner" ? Math.max(maxTokens, 8000) : maxTokens;
  
  if (enableThinking && finalModel === "deepseek-reasoner") {
    console.log(`🧠 思考模式已启用: 使用 ${finalModel}, max_tokens=${finalMaxTokens}`);
  } else {
    console.log(`🤖 普通模式: 使用 ${finalModel}, max_tokens=${finalMaxTokens}`);
  }

  const client = getOpenAIClient();
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: finalModel,
        messages,
        temperature,
        max_tokens: finalMaxTokens,
      });

      const content = completion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("AI未返回有效内容");
      }

      return content;
    } catch (error: any) {
      lastError = error as Error;
      
      // Log detailed error information
      console.error(`API 尝试 ${attempt}/${maxRetries} 失败:`);
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      console.error("Error status:", error?.status || error?.response?.status);
      console.error("Error code:", error?.code);
      
      // Check for specific error types
      if (error?.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", JSON.stringify(error.response.data).slice(0, 500));
      }
      
      // If 503 (Service Unavailable), provide more context
      if (error?.response?.status === 503 || error?.status === 503) {
        console.error("⚠️ API 服务暂时不可用 (503)");
        console.error("可能原因：");
        console.error("1. DeepSeek API 服务器过载或维护中");
        console.error("2. API Key 额度已用完");
        console.error("3. 区域限制或网络问题");
      }

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  const errorMsg = lastError?.message || "未知错误";
  const statusInfo = (lastError as any)?.response?.status ? ` (HTTP ${(lastError as any).response.status})` : "";
  throw new Error(
    `API 调用失败（已重试 ${maxRetries} 次）${statusInfo}: ${errorMsg}`
  );
}

/**
 * Generate JSON completion with schema validation
 */
export async function generateJSONCompletion<T>(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string;
    temperature?: number;
    maxRetries?: number;
    enableThinking?: boolean; // 开启思考模式
  } = {}
): Promise<T> {
  const content = await generateCompletion(messages, {
    ...options,
    maxTokens: options.enableThinking ? 8000 : 3000, // 思考模式需要更多 tokens
  });

  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    return JSON.parse(jsonString) as T;
  } catch (error) {
    throw new Error(
      `JSON解析失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * Check if API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

