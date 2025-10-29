/**
 * DeepSeek API Test Route
 * Quick endpoint to test DeepSeek API connectivity
 */

import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, generateCompletion } from "@/lib/api/openai";

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {} as Record<string, any>,
    connection: {} as Record<string, any>,
    test: {} as Record<string, any>,
  };

  try {
    // 1. Check environment variables
    console.log("=== Testing DeepSeek API Configuration ===");
    
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    testResults.environment = {
      deepseekConfigured: !!deepseekKey,
      deepseekKeyLength: deepseekKey?.length || 0,
      deepseekKeyPrefix: deepseekKey?.slice(0, 7) || "none",
      openaiConfigured: !!openaiKey,
      activeProvider: deepseekKey ? "DeepSeek" : (openaiKey ? "OpenAI" : "None"),
    };

    console.log("Environment check:", testResults.environment);

    if (!deepseekKey && !openaiKey) {
      return NextResponse.json({
        success: false,
        error: "未配置任何 API Key",
        message: "请在 .env.local 中配置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY",
        results: testResults,
      }, { status: 500 });
    }

    // 2. Try to initialize client
    try {
      const client = getOpenAIClient();
      testResults.connection = {
        clientInitialized: true,
        baseURL: deepseekKey ? "https://api.deepseek.com" : "https://api.openai.com/v1",
      };
      console.log("Client initialized successfully");
    } catch (error: any) {
      testResults.connection = {
        clientInitialized: false,
        error: error.message,
      };
      console.error("Client initialization failed:", error);
      return NextResponse.json({
        success: false,
        error: "客户端初始化失败",
        message: error.message,
        results: testResults,
      }, { status: 500 });
    }

    // 3. Make a simple test call
    console.log("Making test API call...");
    const startTime = Date.now();
    
    try {
      const response = await generateCompletion(
        [
          {
            role: "user",
            content: "请用一句话介绍你自己",
          },
        ],
        {
          model: deepseekKey ? "deepseek-chat" : "gpt-4o",
          temperature: 0.7,
          maxTokens: 100,
          maxRetries: 1,
        }
      );

      const duration = Date.now() - startTime;

      testResults.test = {
        success: true,
        duration: `${duration}ms`,
        responseLength: response.length,
        responsePreview: response.slice(0, 100),
      };

      console.log("✅ Test call successful!");
      console.log("Response:", response);

      return NextResponse.json({
        success: true,
        message: "API 连接正常！",
        provider: deepseekKey ? "DeepSeek" : "OpenAI",
        model: deepseekKey ? "deepseek-chat" : "gpt-4o",
        results: testResults,
      });

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      testResults.test = {
        success: false,
        duration: `${duration}ms`,
        errorType: error.constructor?.name,
        errorMessage: error.message,
        errorStatus: error.response?.status || error.status,
        errorCode: error.code,
      };

      console.error("❌ Test call failed:", error);
      console.error("Error details:", {
        status: error.response?.status,
        message: error.message,
        code: error.code,
      });

      // Return detailed error info
      return NextResponse.json({
        success: false,
        error: "API 调用失败",
        message: error.message,
        status: error.response?.status || error.status,
        provider: deepseekKey ? "DeepSeek" : "OpenAI",
        results: testResults,
        troubleshooting: {
          "503": "服务不可用 - API 服务器过载、维护中、或 Key 额度不足",
          "401": "认证失败 - API Key 无效或已过期",
          "429": "请求过多 - 触发速率限制",
          "500": "服务器错误 - API 内部错误",
        },
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Unexpected error during test:", error);
    return NextResponse.json({
      success: false,
      error: "测试过程中发生意外错误",
      message: error.message,
      results: testResults,
    }, { status: 500 });
  }
}

