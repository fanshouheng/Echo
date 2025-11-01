/**
 * Interview Type Definitions
 * Types for the soul interview questionnaire
 */

/**
 * Question input types
 */
export type QuestionInputType = 
  | "single-choice"    // 单选
  | "multiple-choice"  // 多选
  | "text"            // 文本输入
  | "scale";          // 量表（1-10）

/**
 * Question option for choice-based questions
 */
export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

/**
 * Interview question structure
 */
export interface InterviewQuestion {
  id: string;
  text: string;
  description?: string;
  inputType: QuestionInputType;
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  category: 
    | "emotion" 
    | "communication" 
    | "values" 
    | "aesthetic" 
    | "lifestyle" 
    | "social" 
    | "decision" 
    | "openness"
    | "attachment"        // 依恋风格相关
    | "emotional_needs"   // 情感需求相关
    | "personality"       // 人格特质相关
    | "stress"           // 压力应对相关
    | "fears"            // 恐惧相关
    | "security";        // 安全感相关
}

/**
 * User's answer to a question
 */
export interface InterviewAnswer {
  questionId: string;
  answer: string | string[]; // string for single/text, array for multiple choice
  answeredAt?: number; // timestamp (optional for API compatibility)
}

/**
 * Interview session state
 */
export interface InterviewState {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: InterviewAnswer[];
  startTime: number | null;
  completedAt: number | null;
}

/**
 * Interview progress
 */
export interface InterviewProgress {
  totalQuestions: number;
  answeredQuestions: number;
  percentage: number;
  estimatedTimeRemaining: number; // in seconds
}

/**
 * Interview validation result
 */
export interface InterviewValidation {
  isValid: boolean;
  errors: {
    questionId: string;
    message: string;
  }[];
}

/**
 * Analyzed answer insights (from LLM)
 */
export interface AnswerInsights {
  emotionalTone: "positive" | "neutral" | "negative" | "mixed";
  keywords: string[];
  sentiment: number; // -1 to 1
  depth: "surface" | "moderate" | "deep";
}

