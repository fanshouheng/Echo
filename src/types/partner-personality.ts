/**
 * Partner Personality Types
 * For ideal partner generation based on relationship psychology
 */

/**
 * Core partner personality profile
 */
export interface PartnerPersonalityProfile {
  // Basic Info
  name: string;
  nickname: string;
  age: string;
  vibe: string;
  tagline: string;
  
  // Core Personality
  corePersonality: {
    attachmentStyle: string;
    primaryTraits: string[];
    complementaryTraits: string[];
    lovingStyle: string;
  };
  
  // Emotional Support Patterns
  emotionalSupport: {
    whenYouAnxious: string;
    whenYouSad: string;
    whenYouHappy: string;
    dailySupport: string;
  };
  
  // Communication Style
  communicationStyle: {
    speakingPattern: string;
    listeningStyle: string;
    conflictHandling: string;
    expressionStyle: string;
  };
  
  // Lifestyle Compatibility
  lifestyleCompatibility: {
    dailyRhythm: string;
    socialStyle: string;
    hobbySharing: string;
    spaceBalance: string;
  };
  
  // Unique Qualities
  uniqueQualities: {
    strengths: string[];
    adorableFlaws: string[];
    dailyHabits: string[];
  };
  
  // Relationship Dynamics
  relationshipDynamics: {
    intimacyLevel: string;
    growthTogether: string;
    conflictResolution: string;
    futureVision: string;
  };
  
  // Why Perfect Match
  whyPerfectMatch: {
    attachmentMatch: string;
    emotionalMatch: string;
    communicationMatch: string;
    lifestyleMatch: string;
    growthMatch: string;
  };
  
  // Love Language
  loveLanguage: {
    primary: string;
    secondary: string;
    expression: string;
  };
  
  // Daily Life Scenes (Enhanced Details)
  dailyLifeScenes: {
    morningRoutine: string;      // 早晨的场景
    eveningRoutine: string;      // 晚上的场景
    weekendActivity: string;      // 周末的活动
    cookingTogether: string;     // 一起做饭的场景
    quietMoments: string;        // 安静相处的时刻
    playfulMoments: string;      // 轻松玩耍的时刻
  };
  
  // Specific Interactions (More Details)
  interactionDetails: {
    howTheyGreet: string;        // 如何打招呼
    howTheySayGoodbye: string;  // 如何告别
    howTheyShowCare: string;    // 如何表达关心
    howTheyApologize: string;   // 如何道歉
    howTheyCelebrate: string;   // 如何庆祝
    howTheyComfort: string;     // 如何安慰
  };
  
  // Living Together Details
  livingTogether: {
    morningScene: string;       // 一起生活的早晨场景（详细）
    eveningScene: string;       // 一起生活的晚上场景（详细）
    weekendScene: string;       // 一起生活的周末场景（详细）
    choreDistribution: string;  // 家务分工
    personalSpace: string;     // 个人空间的处理
    sharedActivities: string[]; // 共同活动（至少5个）
  };
  
  // Deeper Personality Traits
  deeperTraits: {
    hiddenTalents: string[];    // 隐藏的小才能（至少3个）
    quirks: string[];           // 独特的小习惯（至少5个）
    petPeeves: string[];         // 小介意的事（至少3个）
    randomFacts: string[];      // 关于TA的随机事实（至少5个）
  };
  
  // Communication Examples (Real Conversations)
  conversationExamples: {
    dailyCheckIn: string;       // 日常问候的例子
    deepTalk: string;          // 深度交流的例子
    playfulTeasing: string;    // 轻松调侃的例子
    conflictExample: string;    // 冲突时的对话例子
    supportiveWords: string;    // 支持性话语的例子
  };
}

/**
 * Partner generation request
 */
export interface PartnerGenerationRequest {
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
}

/**
 * Partner generation response
 */
export interface PartnerGenerationResponse {
  partner: PartnerPersonalityProfile;
  generationTime: number;
  model: string;
}

/**
 * Attachment style types
 */
export type AttachmentStyle = 
  | "secure"           // 安全型
  | "anxious"          // 焦虑型  
  | "avoidant"         // 回避型
  | "disorganized";    // 混乱型

/**
 * Love language types (Five Love Languages)
 */
export type LoveLanguage = 
  | "words_of_affirmation"  // 肯定的言语
  | "quality_time"          // 优质时间
  | "physical_touch"        // 身体接触
  | "acts_of_service"       // 服务行动
  | "receiving_gifts";      // 礼物馈赠

/**
 * Complementarity needs
 */
export interface ComplementarityNeeds {
  needsMoreExtroversion: boolean;
  needsMoreStability: boolean;
  needsMoreDecisiveness: boolean;
  needsMoreRomance: boolean;
  needsMorePlanning: boolean;
  needsMoreHumor: boolean;
}

/**
 * Emotional needs analysis
 */
export interface EmotionalNeedsAnalysis {
  primaryNeed: "security" | "understanding" | "freedom" | "attention" | "growth";
  supportStyle: "practical" | "emotional" | "analytical" | "space" | "distraction";
  loveLanguage: LoveLanguage;
  intimacyLevel: "high" | "moderate" | "selective" | "low";
}

/**
 * Partner matching analysis result
 */
export interface PartnerMatchingAnalysis {
  attachmentStyle: AttachmentStyle;
  emotionalNeeds: EmotionalNeedsAnalysis;
  complementarityNeeds: ComplementarityNeeds;
  communicationPreferences: {
    style: "direct" | "gentle" | "deep" | "humorous";
    conflictStyle: "immediate" | "cooling_off" | "apologetic" | "analytical" | "compromising";
  };
  lifestylePreferences: {
    togetherness: "high" | "balanced" | "quality" | "independent";
    rhythm: "synchronized" | "similar" | "adaptive" | "independent";
  };
}

/**
 * Validate partner personality profile
 */
export function validatePartnerProfile(profile: any): profile is PartnerPersonalityProfile {
  return (
    typeof profile === "object" &&
    typeof profile.name === "string" &&
    typeof profile.nickname === "string" &&
    typeof profile.tagline === "string" &&
    typeof profile.corePersonality === "object" &&
    typeof profile.emotionalSupport === "object" &&
    typeof profile.communicationStyle === "object" &&
    typeof profile.lifestyleCompatibility === "object" &&
    typeof profile.uniqueQualities === "object" &&
    typeof profile.relationshipDynamics === "object" &&
    typeof profile.whyPerfectMatch === "object" &&
    typeof profile.loveLanguage === "object" &&
    // New fields (optional for backward compatibility, but should be present)
    (profile.dailyLifeScenes === undefined || typeof profile.dailyLifeScenes === "object") &&
    (profile.interactionDetails === undefined || typeof profile.interactionDetails === "object") &&
    (profile.livingTogether === undefined || typeof profile.livingTogether === "object") &&
    (profile.deeperTraits === undefined || typeof profile.deeperTraits === "object") &&
    (profile.conversationExamples === undefined || typeof profile.conversationExamples === "object")
  );
}

/**
 * Convert partner profile to legacy personality format for compatibility
 * Matches PersonalityProfile interface structure
 */
export function partnerToLegacyPersonality(partner: PartnerPersonalityProfile): any {
  return {
    name: partner.name,
    tagline: partner.tagline,
    keywords: partner.corePersonality.primaryTraits,
    communicationStyle: `${partner.communicationStyle.speakingPattern}。${partner.communicationStyle.listeningStyle}`,
    values: `${partner.loveLanguage.primary}，${partner.relationshipDynamics.intimacyLevel}`,
    whyMatch: partner.whyPerfectMatch.emotionalMatch,
    uniqueTraits: `${partner.uniqueQualities.strengths.join("；")}。${partner.uniqueQualities.adorableFlaws.join("；")}。${partner.uniqueQualities.dailyHabits.join("；")}`,
  };
}

