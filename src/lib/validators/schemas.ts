/**
 * Zod Validation Schemas
 * Type-safe validation for API requests and responses
 */

import { z } from "zod";

/**
 * Interview Answer Schema
 */
export const interviewAnswerSchema = z.object({
  questionId: z.string().min(1, "问题ID不能为空"),
  answer: z.union([
    z.string().min(1, "答案不能为空"),
    z.array(z.string().min(1)),
  ]),
  answeredAt: z.number().optional(), // Optional for API requests
});

export const interviewAnswersSchema = z.array(interviewAnswerSchema).min(20, "至少需要回答20个问题"); // Updated for 25-question system

/**
 * Personality Profile Schema
 */
export const personalityProfileSchema = z.object({
  name: z.string().min(1, "Echo名称不能为空").max(50, "名称过长"),
  tagline: z.string().min(1, "标语不能为空").max(100, "标语过长"),
  keywords: z.array(z.string()).min(3, "至少需要3个关键词").max(7, "关键词过多"),
  communicationStyle: z.string().min(10, "沟通风格描述过短"),
  values: z.string().min(10, "价值观描述过短"),
  whyMatch: z.string().min(10, "匹配原因过短"),
  uniqueTraits: z.string().min(10, "独特特质描述过短"),
});

/**
 * Generate Personality Request Schema
 */
export const generatePersonalityRequestSchema = z.object({
  answers: interviewAnswersSchema,
});

/**
 * Generate Personality Response Schema
 */
export const generatePersonalityResponseSchema = z.object({
  personality: personalityProfileSchema,
  generationTime: z.number().positive(),
});

/**
 * Image Generation Request Schema
 */
export const generateImageRequestSchema = z.object({
  personality: personalityProfileSchema,
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("9:16"),
  count: z.number().min(1).max(4).default(3),
});

// Keep old name for backwards compatibility
export const generateImagesRequestSchema = generateImageRequestSchema;

/**
 * Image Generation Response Schema
 */
export const generateImagesResponseSchema = z.object({
  images: z.array(z.object({
    url: z.string().url(),
    seed: z.number().optional(),
  })).min(1),
  generationTime: z.number().positive(),
});

/**
 * Echo Profile Schema
 */
export const echoProfileSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  personality: personalityProfileSchema,
  selectedImageUrl: z.string().url().optional(),
  allImages: z.array(z.string().url()).optional(),
});

/**
 * API Error Response Schema
 */
export const apiErrorResponseSchema = z.object({
  error: z.string(),
  errorCode: z.string(),
  message: z.string(),
});

/**
 * Type exports from schemas
 */
export type InterviewAnswer = z.infer<typeof interviewAnswerSchema>;
export type InterviewAnswers = z.infer<typeof interviewAnswersSchema>;
export type PersonalityProfile = z.infer<typeof personalityProfileSchema>;
export type GeneratePersonalityRequest = z.infer<typeof generatePersonalityRequestSchema>;
export type GeneratePersonalityResponse = z.infer<typeof generatePersonalityResponseSchema>;
export type GenerateImageRequest = z.infer<typeof generateImageRequestSchema>;
export type GenerateImagesRequest = z.infer<typeof generateImagesRequestSchema>;
export type GenerateImagesResponse = z.infer<typeof generateImagesResponseSchema>;
export type EchoProfile = z.infer<typeof echoProfileSchema>;
export type APIErrorResponse = z.infer<typeof apiErrorResponseSchema>;

