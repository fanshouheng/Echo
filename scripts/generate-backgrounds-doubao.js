/**
 * Generate Background Images using Doubao AI
 * Generate all 9 background images
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOUBAO_API_KEY = "d4ece488-75bc-4ab7-945e-812dce2c492c";
const DOUBAO_ENDPOINT_ID = "ep-20251103133548-j5md8";
const DOUBAO_API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

// 导入提示词（从data文件或直接定义）
const prompts = [
  {
    id: "bg-1",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，柔和自然光。傍晚的小雨街道，女孩蹲下撑透明雨伞为一只小猫挡雨，路面倒影清晰，街边日式房屋与暖光灯笼，细致笔触，真实氛围。",
  },
  {
    id: "bg-2",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，午后咖啡馆。女孩坐在靠窗沙发读书，木质桌面放着拿铁和植物，窗外柔和光线洒入，色调温暖，氛围安静。",
  },
  {
    id: "bg-3",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，夜晚的都市公寓。青年坐在工作桌前，多个屏幕显示数据图表和色彩丰富的分析界面，窗外是城市夜景，室内灯光柔和。",
  },
  {
    id: "bg-4",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，日落的地铁站月台。长发女孩穿外套望向远方的城市天际线，天空呈现橙紫渐变，站台灯光渐亮，气氛充满期待。",
  },
  {
    id: "bg-5",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，暖色调的独立书店。女孩坐在靠窗的高背木椅上读书，桌上放着咖啡与手帐，周围是排列整齐的旧书和绿色植物，暖黄吊灯营造柔和光线。",
  },
  {
    id: "bg-6",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，春天的公园。女孩穿着浅色连衣裙在樱花树下漫步，花瓣飘落，背景是草地与远处建筑，光线柔和，色彩清新。",
  },
  {
    id: "bg-7",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，夏日户外篮球场。男生穿球衣在阳光下运球训练，背景有绿色树木和球场围栏，动作自然，汗光微亮。",
  },
  {
    id: "bg-8",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，夜晚的电竞房。女孩坐在专业电竞椅前，屏幕色彩丰富，桌面有键盘手柄与喝了一半的饮料，灯光营造紫蓝渐变。",
  },
  {
    id: "bg-9",
    artStyle: "写实插画风格",
    prompt: "写实插画，16:9 横版，清晨的家庭厨房。男生围着围裙煎蛋，阳光从窗户洒进来，台面摆着新鲜蔬果和早餐，色调温暖真实。",
  },
];

const CONFIG = {
  width: 1920,
  height: 1080,
  outputDir: path.join(__dirname, '..', 'public', 'images', 'background'),
  delay: 2000, // 每张图片间隔2秒
};

async function generateImageWithDoubao(promptText, options = {}) {
  const { width = 1920, height = 1080 } = options;
  
  const url = `${DOUBAO_API_BASE_URL}/images/generations`;
  
  let size = "2K";
  if (width === 1920 && height === 1080) {
    size = "2K";
  } else if (width === 1024 && height === 1024) {
    size = "1K";
  }
  
  const requestBody = {
    model: DOUBAO_ENDPOINT_ID,
    prompt: promptText,
    sequential_image_generation: "disabled",
    response_format: "url",
    size: size,
    stream: false,
    watermark: false, // 去除水印
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

    req.on('error', (error) => {
      reject(error);
    });

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAllImages() {
  console.log('🎨 Starting background image generation with Doubao AI...\n');
  console.log(`📁 Output directory: ${CONFIG.outputDir}\n`);

  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ Created output directory\n`);
  }

  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const fileName = `${prompt.id}.jpg`;
    const filePath = path.join(CONFIG.outputDir, fileName);

    console.log(`[${i + 1}/${prompts.length}] ${prompt.artStyle}`);
    console.log(`   Generating image...`);

    try {
      const imageUrl = await generateImageWithDoubao(prompt.prompt, {
        width: CONFIG.width,
        height: CONFIG.height,
      });

      console.log(`   ✅ Got image URL`);
      
      await downloadImage(imageUrl, filePath);

      const stats = fs.statSync(filePath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);

      console.log(`   ✅ Saved: ${fileName} (${fileSizeKB} KB)`);
      console.log(`   📍 Path: /images/background/${fileName}\n`);

      results.push({
        id: prompt.id,
        success: true,
        fileSize: fileSizeKB,
        path: `/images/background/${fileName}`,
      });

      // 等待间隔时间（最后一张不需要等待）
      if (i < prompts.length - 1) {
        console.log(`   ⏳ Waiting ${CONFIG.delay/1000} seconds before next image...\n`);
        await sleep(CONFIG.delay);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      results.push({
        id: prompt.id,
        success: false,
        error: error.message,
      });
    }
  }

  // 保存结果
  const resultsPath = path.join(CONFIG.outputDir, 'generation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  const successCount = results.filter(r => r.success).length;
  console.log('='.repeat(50));
  console.log(`✅ Generation complete! ${successCount}/${prompts.length} images generated`);
  console.log('='.repeat(50));
  console.log(`\n📋 Results saved to: ${resultsPath}\n`);
}

generateAllImages();

