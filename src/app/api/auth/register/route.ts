/**
 * Register API Route
 * 用户注册接口
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";

const registerSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少6位"),
  name: z.string().optional(),
});

// 生成唯一 ID（类似 cuid）
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(9).toString("hex");
  return `${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // 检查用户是否已存在
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.users.create({
      data: {
        id: generateId(),
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "注册成功",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("注册错误:", error);
    
    // 返回更详细的错误信息（仅在开发环境）
    const errorMessage = process.env.NODE_ENV === "development" 
      ? String(error)
      : "注册失败，请稍后重试";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

