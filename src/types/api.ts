/**
 * API Type Definitions
 * Types for API requests and responses
 */

import { PersonalityProfile } from "./personality";
import { InterviewAnswer } from "./interview";

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

/**
 * API error structure
 */
export interface APIError {
  error: string;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Generate Personality API
 */
export interface GeneratePersonalityRequest {
  answers: InterviewAnswer[];
}

export interface GeneratePersonalityResponse {
  personality: PersonalityProfile;
  generationTime: number;
}

/**
 * Generate Images API
 */
export interface GenerateImagesRequest {
  personality: PersonalityProfile;
  style?: "realistic" | "illustration" | "3d";
  count?: number;
}

export interface GeneratedImage {
  url: string;
  seed?: number;
}

export interface GenerateImagesResponse {
  images: GeneratedImage[];
  generationTime: number;
}

/**
 * Echo Profile API
 */
export interface SaveEchoRequest {
  personality: PersonalityProfile;
  selectedImageUrl?: string;
  allImages?: string[];
}

export interface SaveEchoResponse {
  echoId: string;
  savedAt: string;
}

/**
 * Regenerate APIs
 */
export interface RegeneratePersonalityRequest {
  echoId: string;
  answers: InterviewAnswer[];
}

export interface RegenerateImagesRequest {
  echoId: string;
  personality: PersonalityProfile;
  style?: "realistic" | "illustration" | "3d";
}

/**
 * Share Card Generation API
 */
export interface GenerateShareCardRequest {
  echoId: string;
  template?: "minimalist" | "elegant" | "mystical";
}

export interface GenerateShareCardResponse {
  imageUrl: string;
  imageDataUrl: string; // Base64 data URL
}

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  GENERATE_PERSONALITY: "/api/generate-personality",
  GENERATE_IMAGES: "/api/generate-images",
  SAVE_ECHO: "/api/echo/save",
  GET_ECHO: "/api/echo",
  REGENERATE_PERSONALITY: "/api/regenerate-personality",
  REGENERATE_IMAGES: "/api/regenerate-images",
  GENERATE_SHARE_CARD: "/api/generate-share-card",
} as const;

/**
 * HTTP methods
 */
export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Fetch options
 */
export interface FetchOptions {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

