/**
 * Generation State Management
 * Zustand store for personality and image generation
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PersonalityProfile } from "@/types/personality";
import { PartnerPersonalityProfile } from "@/types/partner-personality";

type ImageModel = "doubao" | "pollinations-flux" | "gemini-imagen" | "replicate-flux" | "replicate-sdxl";

type GenerationStatus = "idle" | "generating-personality" | "generating-images" | "completed" | "error";

interface GenerationState {
  // Status
  status: GenerationStatus;
  error: string | null;

  // Generated data
  personality: PersonalityProfile | null;
  partner: PartnerPersonalityProfile | null; // Full partner data with enhanced details
  images: string[];
  selectedImageIndex: number;

  // Preferences
  preferredGender: "male" | "female" | null;

  // Metadata
  personalityGeneratedAt: number | null;
  imagesGeneratedAt: number | null;
  usedModel: ImageModel | null;
  firstImagePrompt: string | null; // 首次生成的提示词，用于后续场景生成

  // Actions
  setStatus: (status: GenerationStatus) => void;
  setError: (error: string | null) => void;
  setPersonality: (personality: PersonalityProfile) => void;
  setPartner: (partner: PartnerPersonalityProfile) => void; // Set full partner data
  setImages: (images: string[], usedModel: ImageModel) => void;
  appendImages: (images: string[], usedModel: ImageModel) => void;
  selectImage: (index: number) => void;
  reset: () => void;
  setFirstImagePrompt: (prompt: string) => void; // 保存首次生成的提示词

  setPreferredGender: (gender: "male" | "female") => void;

  // Database sync
  echoId: string | null; // 数据库中的 Echo ID
  saveToDatabase: () => Promise<string | null>; // 保存到数据库，返回 Echo ID
  loadFromDatabase: (echoId: string) => Promise<void>; // 从数据库加载
  syncImagesToDatabase: () => Promise<void>; // 同步图片到数据库

  // Computed
  isGenerating: () => boolean;
  hasPersonality: () => boolean;
  hasImages: () => boolean;
  getSelectedImage: () => string | null;
}

const initialState = {
  status: "idle" as GenerationStatus,
  error: null,
  personality: null,
  partner: null,
  images: [],
  selectedImageIndex: 0,
  preferredGender: null,
  personalityGeneratedAt: null,
  imagesGeneratedAt: null,
  usedModel: null,
  firstImagePrompt: null,
  echoId: null, // 数据库中的 Echo ID
};

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set generation status
      setStatus: (status: GenerationStatus) => {
        set({ status, error: null });
      },

      // Set error
      setError: (error: string | null) => {
        set({ error, status: error ? "error" : get().status });
      },

      // Set personality
      setPersonality: (personality: PersonalityProfile) => {
        set({
          personality,
          personalityGeneratedAt: Date.now(),
          status: "completed",
          error: null,
        });
      },

      // Set full partner data
      setPartner: (partner: PartnerPersonalityProfile) => {
        set({
          partner,
          personalityGeneratedAt: Date.now(),
          status: "completed",
          error: null,
        });
      },

      // Set preferred gender
      setPreferredGender: (gender: "male" | "female") => {
        set({ preferredGender: gender });
      },

      // Set images
      setImages: (images: string[], usedModel: ImageModel) => {
        set({
          images,
          usedModel,
          imagesGeneratedAt: Date.now(),
          selectedImageIndex: 0,
          status: "completed",
          error: null,
        });
      },

      appendImages: (images: string[], usedModel: ImageModel) => {
        if (images.length === 0) return;
        set((state) => {
          const nextImages = [...state.images, ...images];
          return {
            images: nextImages,
            usedModel,
            imagesGeneratedAt: Date.now(),
            selectedImageIndex: Math.max(nextImages.length - 1, 0),
            status: "completed",
            error: null,
          };
        });
      },

      // Select an image
      selectImage: (index: number) => {
        const { images } = get();
        if (index >= 0 && index < images.length) {
          set({ selectedImageIndex: index });
        }
      },

      // Reset generation state
      reset: () => {
        set(initialState);
      },

      // Check if generating
      isGenerating: () => {
        const { status } = get();
        return status === "generating-personality" || status === "generating-images";
      },

      // Check if has personality
      hasPersonality: () => {
        return get().personality !== null;
      },

      // Check if has images
      hasImages: () => {
        return get().images.length > 0;
      },

      // Get selected image URL
      getSelectedImage: () => {
        const { images, selectedImageIndex } = get();
        return images[selectedImageIndex] || null;
      },

      // Set first image prompt
      setFirstImagePrompt: (prompt: string) => {
        set({ firstImagePrompt: prompt });
      },

      // Save to database
      saveToDatabase: async () => {
        const state = get();
        if (!state.partner) {
          console.error("❌ Cannot save: No partner data");
          return null;
        }

        try {
          const response = await fetch("/api/echo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: state.partner.name,
              nickname: state.partner.nickname,
              tagline: state.partner.tagline,
              keywords: state.partner.corePersonality?.primaryTraits || [],
              gender: state.partner.gender || "female",
              age: parseInt(state.partner.age) || 25,
              vibe: state.partner.vibe,
              personalityData: state.personality,
              partnerData: state.partner,
              generationTime: state.personalityGeneratedAt
                ? Date.now() - state.personalityGeneratedAt
                : undefined,
              usedModel: state.usedModel,
              firstImagePrompt: state.firstImagePrompt,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "保存失败");
          }

          const data = await response.json();
          const echoId = data.echo?.id;

          if (echoId) {
            set({ echoId });
            console.log("✅ Echo saved to database:", echoId);

            // 如果有图片，同步图片到数据库
            if (state.images.length > 0) {
              await get().syncImagesToDatabase();
            }
          }

          return echoId;
        } catch (error) {
          console.error("❌ Save to database error:", error);
          set({ error: error instanceof Error ? error.message : "保存失败" });
          return null;
        }
      },

      // Load from database
      loadFromDatabase: async (echoId: string) => {
        try {
          const response = await fetch(`/api/echo?id=${echoId}`);

          if (!response.ok) {
            throw new Error("加载失败");
          }

          const data = await response.json();
          const echo = data.echo;

          if (!echo) {
            throw new Error("Echo 不存在");
          }

          // 恢复状态
          set({
            echoId: echo.id,
            personality: echo.personalityData as PersonalityProfile,
            partner: echo.partnerData as PartnerPersonalityProfile,
            images: echo.images?.map((img: any) => img.url) || [],
            selectedImageIndex: 0,
            firstImagePrompt: echo.firstImagePrompt || null,
            usedModel: echo.usedModel as ImageModel | null,
            personalityGeneratedAt: echo.createdAt
              ? new Date(echo.createdAt).getTime()
              : null,
            status: "completed",
            error: null,
          });

          console.log("✅ Echo loaded from database:", echoId);
        } catch (error) {
          console.error("❌ Load from database error:", error);
          set({ error: error instanceof Error ? error.message : "加载失败" });
        }
      },

      // Sync images to database
      syncImagesToDatabase: async () => {
        const state = get();
        if (!state.echoId || state.images.length === 0) {
          return;
        }

        try {
          const images = state.images.map((url, index) => ({
            url,
            index,
            aspectRatio: "9:16", // 默认值，可以从状态中获取
            model: state.usedModel || undefined,
          }));

          const response = await fetch("/api/echo/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              echoId: state.echoId,
              images,
            }),
          });

          if (!response.ok) {
            throw new Error("同步图片失败");
          }

          console.log("✅ Images synced to database");
        } catch (error) {
          console.error("❌ Sync images error:", error);
        }
      },
    }),
    {
      name: "echo-generation-storage",
      partialize: (state) => ({
        personality: state.personality,
        partner: state.partner,
        images: state.images,
        selectedImageIndex: state.selectedImageIndex,
        preferredGender: state.preferredGender,
        personalityGeneratedAt: state.personalityGeneratedAt,
        imagesGeneratedAt: state.imagesGeneratedAt,
        usedModel: state.usedModel,
        firstImagePrompt: state.firstImagePrompt,
      }),
    }
  )
);

