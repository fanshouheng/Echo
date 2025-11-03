/**
 * Generate Background Images Script
 * 
 * Usage:
 *   node scripts/generate-backgrounds.js
 * 
 * This script generates all 9 background images and saves them locally.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Import prompts (we'll use a simplified version here)
const prompts = [
  {
    id: "bg-1",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, low resolution pixel art, blocky pixels, game sprite style, young adult woman with black shoulder-length hair, wearing school uniform, crouching down on rainy Japanese street, holding transparent umbrella over small tabby cat, both looking at each other with gentle expressions, rich vibrant colors, full body scene, rainy street with traditional Japanese buildings, healing pixel art, NOT realistic, NOT photorealistic, NOT smooth, NOT detailed rendering, Soul app inspired",
  },
  {
    id: "bg-2",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult woman with medium-length hair, wearing casual clothes, sitting alone in cozy cafe corner, reading book with thoughtful expression, warm rich colors, full scene with cafe environment, colorful coffee cup, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app style",
  },
  {
    id: "bg-3",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult man with short neat hair, wearing modern casual clothes, sitting in modern apartment by window, looking at screen showing personality data with focused expression, rich colorful data visualization, vibrant apartment colors, full room scene, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired",
  },
  {
    id: "bg-4",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult woman with long hair, wearing jacket, standing on train platform during sunset, watching city with gentle expression, character appearing from light particles, vibrant sunset colors with orange pink purple sky, colorful city lights, full body view, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app aesthetic",
  },
  {
    id: "bg-5",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult woman with medium-length hair, wearing cardigan, standing in cozy bookstore, browsing books on shelf with gentle expression, rich colorful books, warm lighting, full scene showing bookstore interior, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired",
  },
  {
    id: "bg-6",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult woman with flowing hair, wearing light dress, walking through peaceful garden park, cherry blossoms falling, vibrant pink cherry blossoms, green grass and trees, full body view in environment, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app style",
  },
  {
    id: "bg-7",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult man with short hair, wearing athletic wear, sitting on bench in park during golden hour, reading book with peaceful expression, vibrant golden hour colors with warm orange pink sky, green nature, full body in scene, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired",
  },
  {
    id: "bg-8",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult woman with neat hair, wearing comfortable home clothes, sitting in peaceful library, writing in journal with gentle expression, warm pastel colors, colorful books and cozy decor, full scene, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app aesthetic",
  },
  {
    id: "bg-9",
    artStyle: "Pixel Art 风格",
    prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, blocky pixels, game sprite style, young adult man with slightly messy hair, wearing apron over casual clothes, standing in cozy home kitchen during morning, cooking breakfast with gentle expression, warm kitchen colors, colorful ingredients, bright morning light, full body view, NOT realistic, NOT photorealistic, NOT smooth, healing pixel art, Soul app inspired",
  },
];

// Configuration
const CONFIG = {
  width: 1920,
  height: 1080,
  model: 'flux', // Use flux model
  outputDir: path.join(__dirname, '..', 'public', 'images', 'background'),
};

// Helper function to build Pollinations URL
function buildPollinationsUrl(prompt, options = {}) {
  const { width = 1920, height = 1080, model = 'flux' } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  const baseUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    model: model,
    nologo: 'true',
    enhance: 'false',
  });
  return `${baseUrl}?${params.toString()}`;
}

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        return downloadImage(response.headers.location, filePath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', reject);
  });
}

// Generate and save all images
async function generateAllImages() {
  console.log('🎨 Starting background image generation...\n');
  console.log(`📁 Output directory: ${CONFIG.outputDir}\n`);

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ Created output directory\n`);
  }

  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const promptData = prompts[i];
    const fileName = `${promptData.id}.jpg`;
    const filePath = path.join(CONFIG.outputDir, fileName);

    console.log(`[${i + 1}/${prompts.length}] ${promptData.artStyle}`);
    console.log(`   Generating image...`);

    try {
      // Build URL
      const imageUrl = buildPollinationsUrl(promptData.prompt, CONFIG);
      console.log(`   URL: ${imageUrl.substring(0, 100)}...`);

      // Download and save
      await downloadImage(imageUrl, filePath);

      // Get file size
      const stats = fs.statSync(filePath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);

      console.log(`   ✅ Saved: ${fileName} (${fileSizeKB} KB)`);
      console.log(`   📍 Path: /images/background/${fileName}\n`);

      results.push({
        id: promptData.id,
        artStyle: promptData.artStyle,
        fileName,
        localPath: `/images/background/${fileName}`,
        success: true,
      });

      // Delay between requests (2 seconds)
      if (i < prompts.length - 1) {
        console.log('   ⏳ Waiting 2 seconds before next image...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      results.push({
        id: promptData.id,
        artStyle: promptData.artStyle,
        success: false,
        error: error.message,
      });
    }
  }

  // Summary
  const successCount = results.filter(r => r.success).length;
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Generation complete! ${successCount}/${prompts.length} images generated`);
  console.log('='.repeat(50) + '\n');

  // Save results to JSON
  const resultsPath = path.join(CONFIG.outputDir, 'generation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📋 Results saved to: ${resultsPath}\n`);

  return results;
}

// Run
generateAllImages()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

