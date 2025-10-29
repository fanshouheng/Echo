/**
 * Replicate API Client
 * Handles image generation using Flux Pro / SDXL
 */

import Replicate from "replicate";

// Initialize Replicate client
let replicateClient: Replicate | null = null;

export function getReplicateClient(): Replicate {
  if (!replicateClient) {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!apiToken) {
      throw new Error("REPLICATE_API_TOKEN环境变量未设置");
    }
    
    replicateClient = new Replicate({
      auth: apiToken,
    });
  }
  
  return replicateClient;
}

/**
 * Generate image with Flux Pro model
 */
export async function generateImageWithFlux(
  prompt: string,
  options: {
    aspectRatio?: string;
    outputFormat?: string;
    outputQuality?: number;
    numOutputs?: number;
    maxRetries?: number;
  } = {}
): Promise<string[]> {
  const {
    aspectRatio = "1:1",
    outputFormat = "png",
    outputQuality = 90,
    numOutputs = 4,
    maxRetries = 3,
  } = options;

  const client = getReplicateClient();
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = await client.run(
        "black-forest-labs/flux-1.1-pro" as `${string}/${string}` & `${string}/${string}:${string}`,
        {
          input: {
            prompt,
            aspect_ratio: aspectRatio,
            output_format: outputFormat,
            output_quality: outputQuality,
            num_outputs: numOutputs,
          },
        }
      );

      // Output can be string or array of strings
      if (Array.isArray(output)) {
        return output as string[];
      } else if (typeof output === "string") {
        return [output];
      } else {
        throw new Error("Flux API 返回格式不正确");
      }
    } catch (error) {
      lastError = error as Error;
      
      console.error(`Replicate API (Flux) 尝试 ${attempt}/${maxRetries} 失败:`, error);

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Flux图像生成失败（已重试 ${maxRetries} 次）: ${lastError?.message || "未知错误"}`
  );
}

/**
 * Generate image with SDXL model (fallback)
 */
export async function generateImageWithSDXL(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    numOutputs?: number;
    maxRetries?: number;
  } = {}
): Promise<string[]> {
  const {
    width = 1024,
    height = 1024,
    numOutputs = 4,
    maxRetries = 3,
  } = options;

  const client = getReplicateClient();
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = await client.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b" as `${string}/${string}` & `${string}/${string}:${string}`,
        {
          input: {
            prompt,
            width,
            height,
            num_outputs: numOutputs,
          },
        }
      );

      // Output format similar to Flux
      if (Array.isArray(output)) {
        return output as string[];
      } else if (typeof output === "string") {
        return [output];
      } else {
        throw new Error("SDXL API 返回格式不正确");
      }
    } catch (error) {
      lastError = error as Error;
      
      console.error(`Replicate API (SDXL) 尝试 ${attempt}/${maxRetries} 失败:`, error);

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(
    `SDXL图像生成失败（已重试 ${maxRetries} 次）: ${lastError?.message || "未知错误"}`
  );
}

/**
 * Generate image with automatic fallback
 * Tries Flux first, falls back to SDXL if Flux fails
 */
export async function generateImage(
  prompt: string,
  options: {
    numOutputs?: number;
    preferFlux?: boolean;
  } = {}
): Promise<string[]> {
  const { numOutputs = 4, preferFlux = true } = options;

  if (preferFlux) {
    try {
      return await generateImageWithFlux(prompt, { numOutputs });
    } catch (error) {
      console.warn("Flux生成失败，回退到SDXL:", error);
      return await generateImageWithSDXL(prompt, { numOutputs });
    }
  } else {
    return await generateImageWithSDXL(prompt, { numOutputs });
  }
}

/**
 * Check if API token is configured
 */
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN;
}

