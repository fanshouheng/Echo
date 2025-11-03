/**
 * Generate Single Background Image
 * Generate bg-1 (rainy day with cat umbrella scene)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const prompt = {
  id: "bg-1",
  artStyle: "Pixel Art 风格",
  prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, low resolution pixel art, blocky pixels, game sprite style, young adult woman with black shoulder-length hair, wearing school uniform, crouching down on rainy Japanese street, holding transparent umbrella over small tabby cat, both looking at each other with gentle expressions, rich vibrant colors, full body scene, rainy street with traditional Japanese buildings, healing pixel art, NOT realistic, NOT photorealistic, NOT smooth, NOT detailed rendering, Soul app inspired",
};

const CONFIG = {
  width: 1920,
  height: 1080,
  model: 'flux', // Use flux model
  outputDir: path.join(__dirname, '..', 'public', 'images', 'background'),
};

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

function downloadImage(url, filePath, retries = 3, delay = 5000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const attemptDownload = (attempt = 1) => {
      protocol.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          return downloadImage(response.headers.location, filePath, retries, delay).then(resolve).catch(reject);
        }
        
        if (response.statusCode === 500 && attempt < retries) {
          console.log(`   ⚠️ Server error (500), retrying in ${delay/1000}s... (attempt ${attempt}/${retries})`);
          setTimeout(() => attemptDownload(attempt + 1), delay);
          return;
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
          fs.unlink(filePath, () => {});
          reject(err);
        });
      }).on('error', (err) => {
        if (attempt < retries) {
          console.log(`   ⚠️ Network error, retrying in ${delay/1000}s... (attempt ${attempt}/${retries})`);
          setTimeout(() => attemptDownload(attempt + 1), delay);
        } else {
          reject(err);
        }
      });
    };
    
    attemptDownload();
  });
}

async function generateImage() {
  console.log('🎨 Generating bg-1 (Rainy day with cat umbrella scene)...\n');
  console.log(`📁 Output directory: ${CONFIG.outputDir}\n`);

  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ Created output directory\n`);
  }

  const fileName = `${prompt.id}.jpg`;
  const filePath = path.join(CONFIG.outputDir, fileName);

  console.log(`📸 ${prompt.artStyle}`);
  console.log(`   Description: ${prompt.prompt.substring(0, 100)}...`);
  console.log(`   Generating image...`);

  try {
    const imageUrl = buildPollinationsUrl(prompt.prompt, CONFIG);
    console.log(`   URL: ${imageUrl.substring(0, 100)}...`);

    await downloadImage(imageUrl, filePath);

    const stats = fs.statSync(filePath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n   ✅ Saved: ${fileName} (${fileSizeKB} KB)`);
    console.log(`   📍 Path: /images/background/${fileName}\n`);

    console.log('✨ Generation complete!\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n   ❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

generateImage();

