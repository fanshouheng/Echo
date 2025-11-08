/**
 * Echo Database Operations
 * 提供 Echo 数据的 CRUD 操作，包含隐私保护和唯一性检查
 */

import { prisma } from "@/lib/db/prisma";
import { PartnerPersonalityProfile } from "@/types/partner-personality";
import { PersonalityProfile } from "@/types/personality";

/**
 * 创建新的 Echo 档案
 */
export async function createEcho(
  userId: string,
  data: {
    name: string;
    nickname: string;
    tagline: string;
    keywords: string[];
    gender: "male" | "female";
    age: number;
    vibe: string;
    personalityData: PersonalityProfile;
    partnerData?: PartnerPersonalityProfile;
    generationTime?: number;
    usedModel?: string;
    firstImagePrompt?: string;
  }
) {
  // 检查用户是否已经有 Echo（可选：限制每个用户只能有一个 Echo）
  // const existingEcho = await prisma.echo.findFirst({
  //   where: { userId },
  // });
  // if (existingEcho) {
  //   throw new Error("您已经有一个 Echo 档案了");
  // }

  // 创建 Echo
  const echo = await prisma.echo.create({
    data: {
      userId,
      name: data.name,
      nickname: data.nickname,
      tagline: data.tagline,
      keywords: data.keywords,
      gender: data.gender,
      age: data.age,
      vibe: data.vibe,
      personalityData: data.personalityData as any,
      partnerData: data.partnerData as any,
      generationTime: data.generationTime,
      usedModel: data.usedModel,
      firstImagePrompt: data.firstImagePrompt,
      isPublic: false, // 默认不公开
    },
    include: {
      images: {
        orderBy: { index: "asc" },
      },
    },
  });

  return echo;
}

/**
 * 获取用户的 Echo 列表
 */
export async function getUserEchos(userId: string) {
  const echos = await prisma.echo.findMany({
    where: { userId },
    include: {
      images: {
        orderBy: { index: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return echos;
}

/**
 * 根据 ID 获取 Echo（仅限所有者）
 */
export async function getEchoById(echoId: string, userId: string) {
  const echo = await prisma.echo.findFirst({
    where: {
      id: echoId,
      userId, // 确保只能访问自己的 Echo
    },
    include: {
      images: {
        orderBy: { index: "asc" },
      },
    },
  });

  return echo;
}

/**
 * 根据分享令牌获取 Echo（公开访问）
 */
export async function getEchoByShareToken(shareToken: string) {
  const echo = await prisma.echo.findFirst({
    where: {
      shareToken,
      isPublic: true, // 只返回公开的 Echo
    },
    include: {
      images: {
        orderBy: { index: "asc" },
      },
    },
  });

  return echo;
}

/**
 * 添加图片到 Echo
 */
export async function addEchoImage(
  echoId: string,
  userId: string,
  data: {
    url: string;
    prompt?: string;
    aspectRatio?: string;
    model?: string;
    index: number;
  }
) {
  // 验证 Echo 所有权
  const echo = await prisma.echo.findFirst({
    where: {
      id: echoId,
      userId,
    },
  });

  if (!echo) {
    throw new Error("Echo 不存在或无权访问");
  }

  const image = await prisma.echoImage.create({
    data: {
      echoId,
      url: data.url,
      prompt: data.prompt,
      aspectRatio: data.aspectRatio,
      model: data.model,
      index: data.index,
    },
  });

  return image;
}

/**
 * 批量添加图片到 Echo
 */
export async function addEchoImages(
  echoId: string,
  userId: string,
  images: Array<{
    url: string;
    prompt?: string;
    aspectRatio?: string;
    model?: string;
    index: number;
  }>
) {
  // 验证 Echo 所有权
  const echo = await prisma.echo.findFirst({
    where: {
      id: echoId,
      userId,
    },
  });

  if (!echo) {
    throw new Error("Echo 不存在或无权访问");
  }

  const createdImages = await prisma.echoImage.createMany({
    data: images.map((img) => ({
      echoId,
      url: img.url,
      prompt: img.prompt,
      aspectRatio: img.aspectRatio,
      model: img.model,
      index: img.index,
    })),
  });

  return createdImages;
}

/**
 * 更新 Echo 的公开状态
 */
export async function updateEchoVisibility(
  echoId: string,
  userId: string,
  isPublic: boolean
) {
  const echo = await prisma.echo.updateMany({
    where: {
      id: echoId,
      userId, // 确保只能更新自己的 Echo
    },
    data: {
      isPublic,
    },
  });

  return echo;
}

/**
 * 删除 Echo（级联删除所有关联数据）
 */
export async function deleteEcho(echoId: string, userId: string) {
  const echo = await prisma.echo.deleteMany({
    where: {
      id: echoId,
      userId, // 确保只能删除自己的 Echo
    },
  });

  return echo;
}

/**
 * 保存访谈答案
 */
export async function saveInterviewAnswers(
  userId: string,
  data: {
    answers: any[];
    preferredGender?: string;
    echoId?: string;
  }
) {
  const interview = await prisma.interviewAnswer.create({
    data: {
      userId,
      answers: data.answers as any,
      preferredGender: data.preferredGender,
      echoId: data.echoId,
    },
  });

  return interview;
}



