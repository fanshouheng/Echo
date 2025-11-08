/**
 * Echo API Routes
 * 处理 Echo 的创建、获取、更新等操作
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  createEcho,
  getUserEchos,
  getEchoById,
  addEchoImages,
  updateEchoVisibility,
} from "@/lib/db/echo";

/**
 * GET /api/echo - 获取用户的 Echo 列表
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const echoId = searchParams.get("id");
    const shareToken = searchParams.get("shareToken");

    // 根据分享令牌获取公开的 Echo
    if (shareToken) {
      const { getEchoByShareToken } = await import("@/lib/db/echo");
      const echo = await getEchoByShareToken(shareToken);
      
      if (!echo) {
        return NextResponse.json(
          { error: "Echo 不存在或未公开" },
          { status: 404 }
        );
      }

      return NextResponse.json({ echo });
    }

    // 根据 ID 获取单个 Echo
    if (echoId) {
      const echo = await getEchoById(echoId, session.user.id);
      
      if (!echo) {
        return NextResponse.json(
          { error: "Echo 不存在或无权访问" },
          { status: 404 }
        );
      }

      return NextResponse.json({ echo });
    }

    // 获取用户的所有 Echo
    const echos = await getUserEchos(session.user.id);
    return NextResponse.json({ echos });
  } catch (error) {
    console.error("❌ Get Echo error:", error);
    return NextResponse.json(
      { error: "获取 Echo 失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/echo - 创建新的 Echo
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      nickname,
      tagline,
      keywords,
      gender,
      age,
      vibe,
      personalityData,
      partnerData,
      generationTime,
      usedModel,
      firstImagePrompt,
    } = body;

    // 验证必填字段
    if (!name || !nickname || !tagline || !gender || !age || !personalityData) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const echo = await createEcho(session.user.id, {
      name,
      nickname,
      tagline,
      keywords: keywords || [],
      gender,
      age: Number(age),
      vibe,
      personalityData,
      partnerData,
      generationTime,
      usedModel,
      firstImagePrompt,
    });

    return NextResponse.json({ echo }, { status: 201 });
  } catch (error) {
    console.error("❌ Create Echo error:", error);
    return NextResponse.json(
      { error: "创建 Echo 失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/echo - 更新 Echo（目前只支持更新公开状态）
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { echoId, isPublic } = body;

    if (!echoId || typeof isPublic !== "boolean") {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    await updateEchoVisibility(echoId, session.user.id, isPublic);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Update Echo error:", error);
    return NextResponse.json(
      { error: "更新 Echo 失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}



