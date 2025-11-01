# 背景图片生成指南

## 🎯 快速开始

### 方法 1：手动生成（推荐用于测试）

#### 步骤 1：测试单张图片

1. 打开浏览器，访问：
   ```
   https://image.pollinations.ai/prompt/[你的提示词]
   ```

2. 使用第一张图片的提示词（简化版）：
   ```
   Minimalist abstract composition, neural network visualization, monochrome black and white, single bright cyan accent line, pixel art style, Soul app inspired
   ```

3. 完整 URL 示例：
   ```
   https://image.pollinations.ai/prompt/Minimalist%20abstract%20composition,%20neural%20network%20visualization,%20monochrome%20black%20and%20white,%20single%20bright%20cyan%20accent%20line,%20pixel%20art%20style,%20Soul%20app%20inspired?width=1920&height=1080&model=turbo&nologo=true
   ```

#### 步骤 2：查看效果

- 等待图片生成（通常 10-30 秒）
- 检查是否符合要求：
  - ✅ 黑白灰配色
  - ✅ 青色点缀
  - ✅ 像素艺术风格
  - ✅ 适合作为背景

#### 步骤 3：调整提示词（如需要）

如果效果不理想，可以：
- 调整提示词中的关键词
- 尝试不同的模型（`turbo`, `anime`, `flux`）

#### 步骤 4：批量生成

重复步骤 1-3，生成所有 9 张图片

---

### 方法 2：使用代码生成（自动化）

#### 选项 A：创建临时 API 路由

创建 `src/app/api/generate-backgrounds/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { generateImageWithPollinations } from "@/lib/api/pollinations";
import { backgroundImagePrompts } from "@/data/background-image-prompts";

export async function GET() {
  const results = [];
  
  for (const promptData of backgroundImagePrompts) {
    try {
      const urls = await generateImageWithPollinations(promptData.prompt, {
        width: 1920,
        height: 1080,
        model: "turbo",
        nologo: true,
        enhance: false,
      });
      
      results.push({
        id: promptData.id,
        url: urls[0],
        description: promptData.description,
      });
    } catch (error) {
      console.error(`Failed to generate ${promptData.id}:`, error);
    }
  }
  
  return NextResponse.json({ images: results });
}
```

然后访问：`http://localhost:3000/api/generate-backgrounds`

#### 选项 B：使用脚本（Node.js）

```bash
# 使用 tsx 运行脚本
npx tsx src/scripts/generate-background-images.ts
```

---

## 📝 提示词列表

### Row 1: 深度理解

**图片 1**：
```
Minimalist abstract composition, neural network visualization, brain pattern connections, 
monochrome black and white, single bright cyan accent line, geometric shapes, 
pixel art style, high contrast, clean modern aesthetic, Soul app inspired
```

**图片 2**：
```
Abstract emotional wave pattern, flowing lines, monochrome gradient from black to gray,
single cyan highlight curve, minimalist design, geometric abstraction,
pixel art aesthetic, soft edges, modern digital art
```

**图片 3**：
```
Minimalist data visualization, grid pattern, binary code aesthetic,
black and white composition, cyan accent dots, geometric grid lines,
pixel art style, scientific diagram feeling
```

---

### Row 2: 具象化

**图片 4**：
```
Abstract AI generation process, transformation visualization,
geometric shapes morphing, black to white gradient, cyan pulse effect,
pixel art animation still, minimalist composition
```

**图片 5**：
```
Minimalist data visualization, abstract chart pattern,
monochrome bars and lines, single cyan highlight, clean geometric shapes,
pixel art style, high contrast black and white
```

**图片 6**：
```
Abstract scene composition, fragmented reality aesthetic,
pixel art style, black white gray palette, cyan accent elements,
geometric scene fragments, minimalist story visualization
```

---

### Row 3: 真实共鸣

**图片 7**：
```
Abstract emotional connection visualization, two circles converging,
monochrome composition, black to gray gradient, cyan connection line,
pixel art style, minimalist geometric design
```

**图片 8**：
```
Abstract harmony pattern, flowing waves meeting,
black and white minimalist composition, cyan resonance pulse,
geometric wave patterns, pixel art aesthetic
```

**图片 9**：
```
Abstract complementary shapes, puzzle pieces fitting together,
monochrome black white gray, cyan accent connection, minimalist design,
pixel art style, geometric harmony
```

---

## 🔧 提示词优化建议

### 如果图片太复杂

添加：
- `ultra minimalist`
- `very simple composition`
- `clean background`
- `minimal elements`

### 如果图片太简单

添加：
- `detailed pattern`
- `intricate design`
- `complex geometry`
- `layered composition`

### 如果颜色不对

强调：
- `monochrome only`
- `black and white palette`
- `grayscale gradient`
- `cyan #00BFFF as single accent color`
- `no other colors`

### 如果风格不对

强调：
- `pixel art style`
- `16-bit game aesthetic`
- `retro pixel art`
- `modern minimalist`
- `Soul app inspired design`

---

## 📐 图片规格

### 推荐尺寸
- **宽度**：1920px
- **高度**：1080px（16:9）或 1920px（1:1，适合网格）
- **格式**：PNG（保留透明度）或 JPG

### 文件大小
- 每张图片 < 500KB（优化后）
- 使用工具压缩：TinyPNG, ImageOptim

---

## 🔄 替换图片

生成图片后，更新 `src/data/background-images.ts`：

```typescript
{
  id: "bg-1",
  url: "你的图片URL或路径", // 替换这里
  description: "通过心理学模型深度分析你的情感模式和依恋风格",
  // ...
}
```

### 使用本地图片

1. 将图片放入 `public/images/background/` 目录
2. 修改 URL：
   ```typescript
   url: "/images/background/bg-1.png"
   ```

---

## ⚡ 快速测试

### 测试单张图片

访问这个 URL（替换提示词）：
```
https://image.pollinations.ai/prompt/[你的提示词]?width=1920&height=1080&model=turbo&nologo=true
```

### 验证效果

1. ✅ 检查配色（黑白灰 + 青色）
2. ✅ 检查风格（像素艺术、抽象）
3. ✅ 检查作为背景的适用性（文字是否可读）
4. ✅ 检查尺寸和文件大小

---

现在可以开始生成图片了！建议先测试 1-2 张，确认风格后再批量生成。

