/**
 * Generate Single Background Image using Doubao AI
 * Generate bg-1 (rainy day with cat umbrella scene)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOUBAO_API_KEY = "d4ece488-75bc-4ab7-945e-812dce2c492c";
const DOUBAO_ENDPOINT_ID = "ep-20251103133548-j5md8";
const DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

// 使用中文提示词（先不修改，直接使用英文提示词试试）
const prompt = {
  id: "bg-1",
  artStyle: "Pixel Art 风格",
  prompt: "8-bit pixel art, pixels, pixel art style, 16-bit game style, retro pixel art, pixelated, low resolution pixel art, blocky pixels, game sprite style, young adult woman with black shoulder-length hair, wearing school uniform, crouching down on rainy Japanese street, holding transparent umbrella over small tabby cat, both looking at each other with gentle expressions, rich vibrant colors, full body scene, rainy street with traditional Japanese buildings, healing pixel art, NOT realistic, NOT photorealistic, NOT smooth, NOT detailed rendering, Soul app inspired",
};

const CONFIG = {
  width: 1920,
  height: 1080,
  outputDir: path.join(__dirname, '..', 'public', 'images', 'background'),
};

async function generateImageWithDoubao(promptText, options = {}) {
  const { width = 1920, height = 1080, seed } = options;
  
  // 根据豆包API文档，使用正确的端点
  const url = `${DOUBAO_API_BASE_URL}/images/generations`;
  
  // 确定size参数（根据文档，size可以是2K等）
  let size = "2K"; // 默认2K
  if (width === 1920 && height === 1080) {
    size = "2K"; // 1920x1080 对应 2K
  } else if (width === 1024 && height === 1024) {
    size = "1K";
  } else if (width === 2048 && height === 2048) {
    size = "2K";
  }
  
  // 使用标准的豆包API请求格式（根据文档）
  const requestBody = {
    model: DOUBAO_ENDPOINT_ID, // 推理点ID作为model参数
    prompt: promptText,
    sequential_image_generation: "disabled",
    response_format: "url",
    size: size,
    stream: false,
    watermark: false,
    aspect_ratio: "16:9",
    width,
    height,
  };

  console.log("   📤 Request URL:", url);
  console.log("   📤 Request Body:", JSON.stringify(requestBody, null, 2));

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

    res.on('end', () => {
        try {
          console.log(`   📡 API Response Status: ${res.statusCode}`);
          console.log(`   📡 Response Headers:`, JSON.stringify(res.headers, null, 2));
          console.log(`   📡 Raw Response Data:`, data.substring(0, 500));
          
          if (!data || data.trim() === '') {
            return reject(new Error("API返回空响应"));
          }

          const jsonData = JSON.parse(data);
          
          if (res.statusCode !== 200) {
            console.error("   ❌ API Error Response:", JSON.stringify(jsonData, null, 2));
            return reject(new Error(`API error: ${res.statusCode} - ${JSON.stringify(jsonData)}`));
          }

          console.log("   📝 Parsed JSON Response:", JSON.stringify(jsonData, null, 2));

          // 解析响应中的图片数据（根据文档，response_format为url时返回URL）
          let imageUrl = null;
          
          if (jsonData.data && jsonData.data[0]) {
            // 标准格式：{ data: [{ url: "..." }] }
            imageUrl = jsonData.data[0].url;
          } else if (jsonData.url) {
            imageUrl = jsonData.url;
          } else if (jsonData.image) {
            imageUrl = jsonData.image;
          } else if (jsonData.images && jsonData.images[0]) {
            imageUrl = jsonData.images[0].url || jsonData.images[0];
          } else {
            console.log("   ⚠️ Full API Response:", JSON.stringify(jsonData, null, 2));
            return reject(new Error("无法解析API响应中的图片数据"));
          }

          if (!imageUrl) {
            console.log("   ⚠️ Full API Response:", JSON.stringify(jsonData, null, 2));
            return reject(new Error("API响应中未找到图片URL"));
          }

          resolve(imageUrl);
        } catch (error) {
          console.error("   ❌ Parse Error:", error.message);
          console.error("   📡 Raw Response (first 1000 chars):", data.substring(0, 1000));
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

function downloadImage(url, filePath, retries = 3, delay = 5000) {
  return new Promise((resolve, reject) => {
    // 如果是base64 data URL，直接写入文件
    if (url.startsWith('data:image/')) {
      const base64Data = url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
      resolve(filePath);
      return;
    }

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
  console.log('🎨 Generating bg-1 using Doubao AI...\n');
  console.log(`📁 Output directory: ${CONFIG.outputDir}\n`);

  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ Created output directory\n`);
  }

  const fileName = `${prompt.id}.jpg`;
  const filePath = path.join(CONFIG.outputDir, fileName);

  console.log(`📸 ${prompt.artStyle}`);
  console.log(`   Description: ${prompt.prompt.substring(0, 100)}...`);
  console.log(`   Generating image with Doubao AI...`);

  try {
    const imageUrl = await generateImageWithDoubao(prompt.prompt, {
      width: CONFIG.width,
      height: CONFIG.height,
    });

    console.log(`   ✅ Got image URL/data`);
    
    await downloadImage(imageUrl, filePath);

    const stats = fs.statSync(filePath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n   ✅ Saved: ${fileName} (${fileSizeKB} KB)`);
    console.log(`   📍 Path: /images/background/${fileName}\n`);

    console.log('✨ Generation complete!\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n   ❌ Error: ${error.message}\n`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

generateImage();

