/**
 * Generate Background Images API Route
 * POST /api/generate-backgrounds
 * 
 * Generates all 9 background images and saves them to public/images/background/
 */

import { NextRequest, NextResponse } from "next/server";
import { backgroundImagePrompts } from "@/data/background-image-prompts";
import { generateImageWithPollinations } from "@/lib/api/pollinations";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Generate Background Images API Called ===");
    
    const body = await request.json().catch(() => ({}));
    const { saveToLocal = true, width = 1920, height = 1080 } = body;

    const results: {
      id: string;
      url: string;
      localPath?: string;
      artStyle: string;
      description: string;
      success: boolean;
      error?: string;
    }[] = [];

    // Create background images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), "public", "images", "background");
    try {
      await fs.mkdir(imagesDir, { recursive: true });
      console.log(`✅ Created directory: ${imagesDir}`);
    } catch (error) {
      console.error("❌ Failed to create directory:", error);
    }

    console.log(`\n🎨 Starting to generate ${backgroundImagePrompts.length} background images...\n`);

    for (let i = 0; i < backgroundImagePrompts.length; i++) {
      const promptData = backgroundImagePrompts[i];
      console.log(`\n📸 [${i + 1}/${backgroundImagePrompts.length}] Generating: ${promptData.artStyle}`);
      console.log(`   Category: ${promptData.category}`);
      console.log(`   Description: ${promptData.description}`);
      
      try {
        // Generate image URL using Pollinations
        const imageUrls = await generateImageWithPollinations(
          promptData.prompt,
          {
            width,
            height,
            model: "turbo", // Fast model for background images
            nologo: true,
            enhance: false, // Keep original style
            seed: Date.now() + i, // Different seed for each image
          }
        );

        if (imageUrls.length === 0 || !imageUrls[0]) {
          throw new Error("No image URL returned");
        }

        const imageUrl = imageUrls[0];
        console.log(`   ✅ Generated URL: ${imageUrl.substring(0, 100)}...`);

        let localPath: string | undefined;

        // Download and save to local if requested
        if (saveToLocal) {
          try {
            // Download image
            console.log(`   📥 Downloading image...`);
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
              throw new Error(`Failed to download image: ${imageResponse.statusText}`);
            }

            const imageBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(imageBuffer);

            // Save to local file
            const fileName = `bg-${promptData.id.replace("bg-prompt-", "")}.jpg`;
            const filePath = path.join(imagesDir, fileName);
            await fs.writeFile(filePath, buffer);

            localPath = `/images/background/${fileName}`;
            console.log(`   💾 Saved to: ${localPath}`);
            
            // Get file size
            const stats = await fs.stat(filePath);
            console.log(`   📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
          } catch (saveError: any) {
            console.error(`   ⚠️ Failed to save locally:`, saveError?.message);
            // Continue even if save fails
          }
        }

        results.push({
          id: promptData.id,
          url: imageUrl,
          localPath,
          artStyle: promptData.artStyle,
          description: promptData.description,
          success: true,
        });

        console.log(`   ✅ [${i + 1}/${backgroundImagePrompts.length}] Completed successfully`);

        // Delay between requests to avoid rate limiting
        if (i < backgroundImagePrompts.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
        }
      } catch (error: any) {
        console.error(`   ❌ [${i + 1}/${backgroundImagePrompts.length}] Failed:`, error?.message || error);
        results.push({
          id: promptData.id,
          url: "",
          artStyle: promptData.artStyle,
          description: promptData.description,
          success: false,
          error: error?.message || "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    console.log(`\n✅ Generation complete! ${successCount}/${backgroundImagePrompts.length} images generated successfully\n`);

    return NextResponse.json({
      success: true,
      total: backgroundImagePrompts.length,
      successCount,
      results,
      message: `Generated ${successCount}/${backgroundImagePrompts.length} background images`,
    });
  } catch (error: any) {
    console.error("❌ Background generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate background images",
      },
      { status: 500 }
    );
  }
}

// GET method to check status
export async function GET() {
  const imagesDir = path.join(process.cwd(), "public", "images", "background");
  
  try {
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    return NextResponse.json({
      exists: true,
      imageCount: imageFiles.length,
      images: imageFiles.map((file) => ({
        fileName: file,
        path: `/images/background/${file}`,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      exists: false,
      imageCount: 0,
      images: [],
    });
  }
}

