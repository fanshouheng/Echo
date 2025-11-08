/**
 * Echo Images API Routes
 * 处理 Echo 图片的添加操作
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { addEchoImages } from "@/lib/db/echo";

/**
 * POST /api/echo/images - 添加图片到 Echo
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { echoId, images } = body;

    if (!echoId || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const result = await addEchoImages(echoId, session.user.id, images);

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("❌ Add Echo Images error:", error);
    return NextResponse.json(
      { error: "添加图片失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}



