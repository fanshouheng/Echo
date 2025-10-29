/**
 * Personality Adapter
 * Convert between ProfessionalPersonalityProfile and legacy PersonalityProfile
 */

import { ProfessionalPersonalityProfile } from "@/types/personality-professional";
import { PersonalityProfile } from "@/types/personality";

/**
 * Convert professional profile to legacy format (for backward compatibility)
 */
export function professionalToLegacy(
  professional: ProfessionalPersonalityProfile
): PersonalityProfile {
  return {
    name: professional.name,
    tagline: professional.tagline,
    keywords: professional.personality.coreTraits,
    communicationStyle: professional.togetherScenes.dailyChat,
    values: professional.whyMatch.valueMatch,
    whyMatch: `${professional.whyMatch.lifestyleMatch} ${professional.whyMatch.emotionalMatch}`,
    uniqueTraits: `${professional.uniqueDetails.catchphrase}。${professional.uniqueDetails.quirkyHabit}`,
  };
}

/**
 * Format professional profile for display (rich version)
 */
export function formatProfessionalProfile(
  profile: ProfessionalPersonalityProfile
): {
  basic: string;
  lifestyle: string;
  emotional: string;
  together: string;
  unique: string;
} {
  return {
    basic: `${profile.name}${profile.nickname ? `（${profile.nickname}）` : ""} - ${profile.age}，${profile.vibe}`,
    lifestyle: `${profile.lifeDetails.routine.sleepPattern}，${profile.typicalBehaviors.weekendActivity}`,
    emotional: profile.whyMatch.emotionalMatch,
    together: profile.togetherScenes.whenYouSad,
    unique: `${profile.uniqueDetails.catchphrase} | ${profile.uniqueDetails.quirkyHabit}`,
  };
}

/**
 * Validate if an object is a professional profile
 */
export function isProfessionalProfile(obj: any): obj is ProfessionalPersonalityProfile {
  return (
    obj &&
    typeof obj === "object" &&
    "bigFive" in obj &&
    "lifeDetails" in obj &&
    "typicalBehaviors" in obj &&
    "togetherScenes" in obj
  );
}

/**
 * Extract key highlights from professional profile
 */
export function extractHighlights(profile: ProfessionalPersonalityProfile): string[] {
  return [
    `${profile.personality.coreTraits.slice(0, 3).join("、")}`,
    profile.togetherScenes.whenYouSad,
    profile.uniqueDetails.catchphrase,
    `治愈时刻：${profile.uniqueDetails.favoriteTime}`,
  ];
}

/**
 * Generate short bio (for sharing)
 */
export function generateShortBio(profile: ProfessionalPersonalityProfile): string {
  return `${profile.name}，${profile.tagline}。${profile.personality.coreTraits.slice(0, 3).join("、")}。${profile.whyMatch.emotionalMatch}`;
}

