/**
 * Generation Hooks
 * Custom hooks for personality and image generation
 */

import { useState, useCallback } from "react";
import axios from "axios";
import { useGenerationStore } from "@/store/generation";
import { useInterviewStore } from "@/store/interview";
import type { PersonalityProfile } from "@/types/personality";
import type { PartnerPersonalityProfile } from "@/types/partner-personality";

interface GeneratePersonalityResponse {
  personality: PersonalityProfile;
  generationTime: number;
}

type ImageModel = "doubao" | "pollinations-flux" | "gemini-imagen" | "replicate-flux" | "replicate-sdxl";

interface GenerateImageResponse {
  images: string[];
  usedModel: ImageModel;
  generationTime: number;
}

/**
 * Hook for generating personality from interview answers
 */
export function useGeneratePersonality() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { answers } = useInterviewStore();
  const { setPersonality, setStatus, setError: setStoreError, preferredGender } = useGenerationStore();

  const generate = useCallback(async () => {
    console.log("📝 useGeneratePersonality: Starting generation...");
    console.log("📝 Answers to send:", answers.length, "answers");
    
    setIsLoading(true);
    setError(null);
    setStatus("generating-personality");

    try {
      console.log("📡 Sending POST request to /api/generate-partner...");
      console.log("📡 Request payload:", { answers: `${answers.length} answers` });
      console.log("⏱️ 无超时限制：生成将在后台持续进行，直到完成");
      
      // 移除超时限制，让生成在后台持续进行
      // 不设置 timeout 或设置为非常大的值（10分钟），允许长时间生成
      const axiosConfig: any = {
        // 不设置 timeout，让请求可以持续进行（某些平台可能有默认限制）
        // 或者设置为非常大的值：timeout: 600000 (10分钟)
        timeout: 600000, // 10分钟，足够长的时间让生成完成
        onUploadProgress: (progressEvent: any) => {
          console.log("📤 Upload progress:", progressEvent.loaded, "bytes");
        },
      };
      
      console.log("🔧 Axios config: 超时时间设置为 600 秒（10分钟），允许长时间生成");
      console.log("💡 提示：生成可能需要较长时间，请耐心等待...");
      
      const personalityPayload: any = { answers };
      if (preferredGender) {
        personalityPayload.preferredGender = preferredGender;
      }

      const response = await axios.post<GeneratePersonalityResponse>(
        "/api/generate-partner",
        personalityPayload,
        axiosConfig
      );

      console.log("✅ API Response received:", response.status);
      console.log("✅ Response data:", response.data);

      // New API returns { partner, legacyPersonality, ... }
      // Save both full partner data and legacy format for compatibility
      const partner = (response.data as any).partner;
      const legacyPersonality = (response.data as any).legacyPersonality || partner;
      
      if (!legacyPersonality) {
        throw new Error("API 返回格式不正确：缺少 personality 数据");
      }
      
      console.log("✅ Personality extracted:", legacyPersonality?.name || legacyPersonality?.tagline);
      
      // Save legacy format for backward compatibility
      setPersonality(legacyPersonality);
      
      // Save full partner data if available
      if (partner) {
        const { setPartner } = useGenerationStore.getState();
        setPartner(partner);
        console.log("✅ Full partner data stored in Zustand");
      }
      
      console.log("✅ Personality stored in Zustand");
      
      return legacyPersonality;
    } catch (err) {
      console.error("❌ useGeneratePersonality: Error occurred");
      console.error("❌ Error type:", axios.isAxiosError(err) ? "AxiosError" : "Unknown");
      
      if (axios.isAxiosError(err)) {
        console.error("❌ Response status:", err.response?.status);
        console.error("❌ Response data:", err.response?.data);
        console.error("❌ Error code:", err.code);
        console.error("❌ Error message:", err.message);
      } else {
        console.error("❌ Non-Axios error:", err);
      }
      
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message || "生成人格失败，请重试"
        : "未知错误";
      
      console.error("❌ Final error message:", errorMessage);
      
      setError(errorMessage);
      setStoreError(errorMessage);
      throw err;
    } finally {
      console.log("🔚 useGeneratePersonality: Cleanup, setting isLoading to false");
      setIsLoading(false);
    }
  }, [answers, setPersonality, setStatus, setStoreError]);

  return { generate, isLoading, error };
}

/**
 * Hook for generating images from personality
 */
export function useGenerateImages() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    personality: storePersonality,
    partner: storePartner,
    setImages,
    appendImages,
    setStatus,
    setError: setStoreError,
    preferredGender,
  } = useGenerationStore();

  const generate = useCallback(
    async (count: number = 1, aspectRatio: string = "9:16", customPersonality?: PersonalityProfile | PartnerPersonalityProfile) => {
      // Priority: custom > partner > legacy personality
      let personalityData: PersonalityProfile | PartnerPersonalityProfile | null = null;
      
      if (customPersonality) {
        personalityData = customPersonality;
      } else if (storePartner) {
        // Prefer full partner data if available (has more details)
        personalityData = storePartner;
        console.log("🎨 Using full partner data for image generation");
      } else if (storePersonality) {
        // Fallback to legacy personality
        personalityData = storePersonality;
        console.log("🎨 Using legacy personality data for image generation");
      }
      
      if (!personalityData) {
        throw new Error("需要先生成人格");
      }

      const inferredGender = preferredGender || ('corePersonality' in personalityData ? personalityData.gender : undefined);
      if (!inferredGender) {
        throw new Error("请先选择人物性别后再生成形象");
      }

      setIsLoading(true);
      setError(null);
      setStatus("generating-images");

      try {
        // Convert PartnerPersonalityProfile to legacy format for API (schema compatibility)
        // But also send partner data if available for enhanced prompts
        let apiPersonality: PersonalityProfile;
        let partnerData: PartnerPersonalityProfile | undefined = undefined;
        
        if ('corePersonality' in personalityData) {
          // It's PartnerPersonalityProfile, convert to legacy format but keep partner data
          const { partnerToLegacyPersonality } = await import("@/types/partner-personality");
          apiPersonality = partnerToLegacyPersonality(personalityData);
          partnerData = personalityData;
          console.log("🔄 Converted partner data to legacy format for API, keeping partner data for enhanced prompts");
        } else {
          apiPersonality = personalityData as PersonalityProfile;
        }

        // Send both legacy personality (for schema validation) and partner data (for enhanced prompts)
        const requestPayload: any = { 
          personality: apiPersonality,
          count,
          aspectRatio,
        };

        if (partnerData) {
          requestPayload.partner = partnerData;
        }

        if (inferredGender) {
          requestPayload.preferredGender = inferredGender;
        }

        const response = await axios.post<GenerateImageResponse>(
          "/api/generate-image",
          requestPayload,
          { timeout: 60000 }
        );

        const { images, usedModel } = response.data;
        const currentImages = useGenerationStore.getState().images;
        if (currentImages.length > 0) {
          appendImages(images, usedModel);
        } else {
          setImages(images, usedModel);
        }
        
        return images;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || "生成图像失败，请重试"
          : "未知错误";
        
        setError(errorMessage);
        setStoreError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storePersonality, setImages, appendImages, setStatus, setStoreError]
  );

  return { generate, isLoading, error };
}

/**
 * Combined hook for complete generation flow (personality only)
 */
export function useCompleteGeneration() {
  const { generate: generatePersonality, isLoading: isGeneratingPersonality, error } =
    useGeneratePersonality();

  // Only generate personality, not images
  const generateAll = useCallback(async () => {
    console.log("Generating personality only...");
    const personality = await generatePersonality();
    
    if (!personality) {
      throw new Error("人格生成失败：返回数据为空");
    }
    
    console.log("Personality generated successfully:", personality.name || personality.tagline || "未知");
    return personality;
  }, [generatePersonality]);

  return {
    generateAll,
    isLoading: isGeneratingPersonality,
    error,
  };
}

