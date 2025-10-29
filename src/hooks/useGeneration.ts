/**
 * Generation Hooks
 * Custom hooks for personality and image generation
 */

import { useState, useCallback } from "react";
import axios from "axios";
import { useGenerationStore } from "@/store/generation";
import { useInterviewStore } from "@/store/interview";
import type { PersonalityProfile } from "@/types/personality";

interface GeneratePersonalityResponse {
  personality: PersonalityProfile;
  generationTime: number;
}

interface GenerateImageResponse {
  images: string[];
  usedModel: "flux" | "sdxl";
  generationTime: number;
}

/**
 * Hook for generating personality from interview answers
 */
export function useGeneratePersonality() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { answers } = useInterviewStore();
  const { setPersonality, setStatus, setError: setStoreError } = useGenerationStore();

  const generate = useCallback(async () => {
    console.log("📝 useGeneratePersonality: Starting generation...");
    console.log("📝 Answers to send:", answers.length, "answers");
    
    setIsLoading(true);
    setError(null);
    setStatus("generating-personality");

    try {
      console.log("📡 Sending POST request to /api/generate-personality...");
      console.log("📡 Request payload:", { answers: `${answers.length} answers` });
      
      const response = await axios.post<GeneratePersonalityResponse>(
        "/api/generate-personality",
        { answers },
        { 
          timeout: 60000, // Increased to 60s
          onUploadProgress: (progressEvent) => {
            console.log("📤 Upload progress:", progressEvent.loaded, "bytes");
          },
        }
      );

      console.log("✅ API Response received:", response.status);
      console.log("✅ Response data:", response.data);

      const { personality } = response.data;
      console.log("✅ Personality extracted:", personality?.name);
      
      setPersonality(personality);
      console.log("✅ Personality stored in Zustand");
      
      return personality;
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

  const { personality: storePersonality, setImages, setStatus, setError: setStoreError } = useGenerationStore();

  const generate = useCallback(
    async (count: number = 3, aspectRatio: string = "9:16", customPersonality?: PersonalityProfile) => {
      // Use custom personality if provided, otherwise use store personality
      const personality = customPersonality || storePersonality;
      
      if (!personality) {
        throw new Error("需要先生成人格");
      }

      setIsLoading(true);
      setError(null);
      setStatus("generating-images");

      try {
        const response = await axios.post<GenerateImageResponse>(
          "/api/generate-image",
          { personality, count, aspectRatio },
          { timeout: 60000 }
        );

        const { images, usedModel } = response.data;
        setImages(images, usedModel);
        
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
    [storePersonality, setImages, setStatus, setStoreError]
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
    console.log("Personality generated successfully:", personality.name);
    return personality;
  }, [generatePersonality]);

  return {
    generateAll,
    isLoading: isGeneratingPersonality,
    error,
  };
}

