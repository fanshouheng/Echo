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

