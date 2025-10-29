/**
 * Personality Type Definitions
 * Core types for Echo personality profiles
 */

/**
 * Core personality profile structure
 */
export interface PersonalityProfile {
  name: string;
  tagline: string;
  keywords: string[];
  communicationStyle: string;
  values: string;
  whyMatch: string;
  uniqueTraits: string;
}

/**
 * Extended personality profile with metadata
 */
export interface PersonalityWithMeta extends PersonalityProfile {
  generatedAt: string;
  version: string;
  model: string;
}

/**
 * Personality generation status
 */
export type PersonalityGenerationStatus = 
  | "idle"
  | "generating"
  | "success"
  | "error";

/**
 * Personality generation state
 */
export interface PersonalityGenerationState {
  status: PersonalityGenerationStatus;
  personality: PersonalityProfile | null;
  error: string | null;
  progress: number; // 0-100
  startTime: number | null;
  endTime: number | null;
}

/**
 * MBTI-style personality archetype (optional enhancement)
 */
export type PersonalityArchetype =
  | "守护者"
  | "智者"
  | "浪漫者"
  | "冒险家"
  | "理想主义者"
  | "实用主义者";

/**
 * Emotional temperature scale (1-10)
 */
export type EmotionalTemperature = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Extended personality traits (for future versions)
 */
export interface ExtendedPersonalityTraits {
  archetype?: PersonalityArchetype;
  emotionalTemperature?: EmotionalTemperature;
  mbtiStyle?: string;
  strengthsWeaknesses?: {
    strengths: string[];
    weaknesses: string[];
  };
}

