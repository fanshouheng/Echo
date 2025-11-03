/**
 * Generate Single Background Image using Doubao AI
 * Generate bg-5 (warm bookstore scene)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOUBAO_API_KEY = "d4ece488-75bc-4ab7-945e-812dce2c492c";
const DOUBAO_ENDPOINT_ID = "ep-20251103133548-j5md8";
const DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

const prompt = {
  id: "bg-5",
  artStyle: "写实插画风格",
  prompt: "写实插画，16:9 横版，暖色调的独立书店。女孩坐在靠窗的高背木椅上读书，桌上放着咖啡与手帐，周围是排列整齐的旧书和绿色植物，暖黄吊灯营造柔和光线。",
};

const CONFIG = {
  width: 1920,
  height: 1080,
  outputDir: path.join(__dirname, '..', 'public', 'images', 'background'),
};

async function generateImageWithDoubao(promptText, options = {}) {
  const { width = 1920, height = 1080 } = options;
  const url = `${DOUBAO_API_BASE_URL}/images/generations`;
  const requestBody = {
    model: DOUBAO_ENDPOINT_ID,
    prompt: promptText,
    sequential_image_generation: "disabled",
    response_format: "url",
    size: "2K",
    stream: false,
    watermark: false,
    aspect_ratio: "16:9",
    width,
    height,
  };

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
          if (res.statusCode !== 200) {
            return reject(new Error(`API error: ${res.statusCode} - ${data}`));
          }

          const jsonData = JSON.parse(data);
          if (jsonData.data && jsonData.data[0]) {
            resolve(jsonData.data[0].url);
          } else {
            reject(new Error("无法解析API响应中的图片数据"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(JSON.stringify(requestBody));
    req.end();
  });
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
          console.log(`   ⚠️ Server error (500), retrying in ${delay / 1000}s... (attempt ${attempt}/${retries})`);
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
          console.log(`   ⚠️ Network error, retrying in ${delay / 1000}s... (attempt ${attempt}/${retries})`);
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
  console.log('🎨 Generating bg-5 (Warm bookstore scene)...\n');
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const fileName = `${prompt.id}.jpg`;
  const filePath = path.join(CONFIG.outputDir, fileName);

  try {
    const imageUrl = await generateImageWithDoubao(prompt.prompt, {
      width: CONFIG.width,
      height: CONFIG.height,
    });

    await downloadImage(imageUrl, filePath);
    const stats = fs.statSync(filePath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`✅ Saved: ${fileName} (${fileSizeKB} KB)`);
    console.log(`📍 Path: /images/background/${fileName}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

generateImage();
