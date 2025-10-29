/**
 * Generation State Management
 * Zustand store for personality and image generation
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PersonalityProfile } from "@/types/personality";

type GenerationStatus = "idle" | "generating-personality" | "generating-images" | "completed" | "error";

interface GenerationState {
  // Status
  status: GenerationStatus;
  error: string | null;

  // Generated data
  personality: PersonalityProfile | null;
  images: string[];
  selectedImageIndex: number;

  // Metadata
  personalityGeneratedAt: number | null;
  imagesGeneratedAt: number | null;
  usedModel: "flux" | "sdxl" | null;

  // Actions
  setStatus: (status: GenerationStatus) => void;
  setError: (error: string | null) => void;
  setPersonality: (personality: PersonalityProfile) => void;
  setImages: (images: string[], usedModel: "flux" | "sdxl") => void;
  selectImage: (index: number) => void;
  reset: () => void;

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
  images: [],
  selectedImageIndex: 0,
  personalityGeneratedAt: null,
  imagesGeneratedAt: null,
  usedModel: null,
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

      // Set images
      setImages: (images: string[], usedModel: "flux" | "sdxl") => {
        set({
          images,
          usedModel,
          imagesGeneratedAt: Date.now(),
          selectedImageIndex: 0,
          status: "completed",
          error: null,
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
    }),
    {
      name: "echo-generation-storage",
      partialize: (state) => ({
        personality: state.personality,
        images: state.images,
        selectedImageIndex: state.selectedImageIndex,
        personalityGeneratedAt: state.personalityGeneratedAt,
        imagesGeneratedAt: state.imagesGeneratedAt,
        usedModel: state.usedModel,
      }),
    }
  )
);

