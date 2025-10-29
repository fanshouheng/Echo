/**
 * Gemini API Test Route
 * Quick endpoint to test Google Gemini API connectivity
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {} as Record<string, any>,
    connection: {} as Record<string, any>,
    test: {} as Record<string, any>,
  };

  try {
    console.log("=== Testing Google Gemini API Configuration ===");
    
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    testResults.environment = {
      geminiConfigured: !!geminiKey,
      geminiKeyLength: geminiKey?.length || 0,
      geminiKeyPrefix: geminiKey?.slice(0, 10) || "none",
    };

    console.log("Environment check:", testResults.environment);

    if (!geminiKey) {
      return NextResponse.json({
        success: false,
        error: "未配置 Gemini API Key",
        message: "请在 .env.local 中配置 GOOGLE_GEMINI_API_KEY",
        results: testResults,
      }, { status: 500 });
    }

    // Initialize client
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      testResults.connection = {
        clientInitialized: true,
        sdk: "@google/generative-ai",
      };
      console.log("Gemini client initialized successfully");
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

    // Test 1: Text generation (using standard Gemini model)
    console.log("Test 1: Testing text generation with gemini-1.5-flash...");
    const startTimeText = Date.now();
    
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent("Say hello in Chinese");
      const response = await result.response;
      const text = response.text();
      
      const durationText = Date.now() - startTimeText;

      testResults.test = {
        textGeneration: {
          success: true,
          duration: `${durationText}ms`,
          model: "gemini-1.5-flash",
          responseLength: text.length,
          responsePreview: text.slice(0, 50),
        },
      };

      console.log("✅ Text generation test passed!");
      console.log("Response:", text);

    } catch (error: any) {
      const durationText = Date.now() - startTimeText;
      
      testResults.test = {
        textGeneration: {
          success: false,
          duration: `${durationText}ms`,
          errorType: error.constructor?.name,
          errorMessage: error.message,
          errorStatus: error.response?.status || error.status,
          errorCode: error.code,
        },
      };

      console.error("❌ Text generation test failed:", error);
    }

    // Test 2: Check if Imagen 4 is available
    console.log("Test 2: Checking Imagen 4 model availability...");
    
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      // Try to initialize Imagen model (will fail if not available)
      const imageModel = genAI.getGenerativeModel({ 
        model: "imagen-4.0-standard-generate-001" 
      });

      testResults.test = {
        ...testResults.test,
        imagenAvailability: {
          success: true,
          model: "imagen-4.0-standard-generate-001",
          note: "模型初始化成功（不保证生成成功）",
        },
      };

      console.log("✅ Imagen 4 model initialized (availability check passed)");

    } catch (error: any) {
      testResults.test = {
        ...testResults.test,
        imagenAvailability: {
          success: false,
          model: "imagen-4.0-standard-generate-001",
          errorMessage: error.message,
          note: "Imagen 4 may not be available in your region or with your API key",
        },
      };

      console.warn("⚠️ Imagen 4 model initialization failed:", error.message);
    }

    // Determine overall success
    const overallSuccess = testResults.test?.textGeneration?.success === true;

    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess 
        ? "Gemini API 连接正常！" 
        : "Gemini API 连接失败",
      results: testResults,
      troubleshooting: {
        "503": "服务不可用 - Gemini 服务器过载、维护中、或 Key 额度不足",
        "401": "认证失败 - API Key 无效或已过期",
        "403": "权限不足 - API Key 没有访问该模型的权限",
        "429": "请求过多 - 触发速率限制",
        "400": "请求错误 - 参数格式不正确或模型不支持",
      },
      notes: [
        "Imagen 4 是较新的模型，可能在部分区域尚未开放",
        "如果 Imagen 不可用，系统会自动回退到 Replicate Flux/SDXL",
        "文本生成测试使用 gemini-1.5-flash 验证基本连接",
      ],
    });

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

