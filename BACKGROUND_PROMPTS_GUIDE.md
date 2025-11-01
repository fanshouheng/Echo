# 背景图片生成提示词指南

## 📝 提示词设计原则

### 风格要求
1. **Soul App 风格**：黑白灰 + 青色强调
2. **像素艺术**：16-bit 游戏风格，怀旧感
3. **极简抽象**：适合作为背景，不干扰文字
4. **现代科技感**：符合 AI 生成器的定位

### 视觉要求
- **主色调**：黑色、白色、灰色
- **强调色**：青色（`#00BFFF`）作为唯一彩色
- **风格**：像素艺术、抽象几何、极简主义
- **构图**：适合背景使用，不抢夺主内容注意力

---

## 🎨 9 张图片的提示词

### Row 1: 深度理解（Understanding）

#### 图片 1：神经网络可视化
```
Minimalist abstract composition, neural network visualization, brain pattern connections, 
monochrome black and white, single bright cyan accent line, geometric shapes, 
pixel art style, high contrast, clean modern aesthetic, Soul app inspired
```

**视觉元素**：神经网络、连接线、几何图形、青色高光

---

#### 图片 2：情感波动模式
```
Abstract emotional wave pattern, flowing lines, monochrome gradient from black to gray,
single cyan highlight curve, minimalist design, geometric abstraction,
pixel art aesthetic, soft edges, modern digital art
```

**视觉元素**：流动的线条、渐变、青色曲线、几何抽象

---

#### 图片 3：数据可视化网格
```
Minimalist data visualization, grid pattern, binary code aesthetic,
black and white composition, cyan accent dots, geometric grid lines,
pixel art style, scientific diagram feeling
```

**视觉元素**：网格图案、数据点、青色点缀、科学图表感

---

### Row 2: 具象化（Visualization）

#### 图片 4：AI 生成过程
```
Abstract AI generation process, transformation visualization,
geometric shapes morphing, black to white gradient, cyan pulse effect,
pixel art animation still, minimalist composition
```

**视觉元素**：变形过程、渐变、青色脉冲、动态静止

---

#### 图片 5：数据图表抽象
```
Minimalist data visualization, abstract chart pattern,
monochrome bars and lines, single cyan highlight, clean geometric shapes,
pixel art style, high contrast black and white
```

**视觉元素**：图表模式、条形线、青色高光、极简几何

---

#### 图片 6：场景片段
```
Abstract scene composition, fragmented reality aesthetic,
pixel art style, black white gray palette, cyan accent elements,
geometric scene fragments, minimalist story visualization
```

**视觉元素**：碎片化场景、几何片段、青色元素、故事感

---

### Row 3: 真实共鸣（Resonance）

#### 图片 7：情感连接
```
Abstract emotional connection visualization, two circles converging,
monochrome composition, black to gray gradient, cyan connection line,
pixel art style, minimalist geometric design
```

**视觉元素**：两个圆形汇聚、青色连接线、情感共振符号

---

#### 图片 8：和谐波动
```
Abstract harmony pattern, flowing waves meeting,
black and white minimalist composition, cyan resonance pulse,
geometric wave patterns, pixel art aesthetic
```

**视觉元素**：波浪交汇、青色共振脉冲、和谐模式

---

#### 图片 9：互补拼图
```
Abstract complementary shapes, puzzle pieces fitting together,
monochrome black white gray, cyan accent connection, minimalist design,
pixel art style, geometric harmony
```

**视觉元素**：拼图互补、青色连接、完美匹配可视化

---

## 🛠️ 使用方法

### 方式 1：直接使用 Pollinations AI

访问：`https://image.pollinations.ai/prompt/{你的提示词}`

示例：
```
https://image.pollinations.ai/prompt/Minimalist%20abstract%20composition,%20neural%20network%20visualization&width=800&height=600&model=turbo&nologo=true
```

### 方式 2：使用代码生成

```typescript
import { generateImageWithPollinations } from "@/lib/api/pollinations";
import { backgroundImagePrompts } from "@/data/background-image-prompts";

// 生成单张图片
const prompt = backgroundImagePrompts[0].prompt;
const imageUrl = await generateImageWithPollinations(prompt, {
  width: 1920,
  height: 1080,
  model: "turbo", // 或 "anime" 用于像素风格
  nologo: true,
});
```

### 方式 3：批量生成所有图片

```typescript
import { backgroundImagePrompts } from "@/data/background-image-prompts";

// 生成所有 9 张图片
for (const promptData of backgroundImagePrompts) {
  const imageUrl = await generateImageWithPollinations(promptData.prompt, {
    width: 1920,
    height: 1080,
    model: "turbo",
    nologo: true,
  });
  // 保存 imageUrl 到配置
}
```

---

## 📐 图片规格建议

- **分辨率**：1920×1080（16:9）或 1920×1920（1:1，适合网格）
- **格式**：PNG 或 JPG
- **文件大小**：每张 < 500KB（优化后）
- **风格**：像素艺术、抽象、极简

---

## 🎨 配色规范

### 主色调
- **黑色**：`#000000` 或 `#0A0A0A`
- **白色**：`#FFFFFF`
- **灰色**：从浅灰 `#F5F5F5` 到深灰 `#333333`

### 强调色
- **青色**：`#00BFFF`（主强调）
- **亮青色**：`#00D4FF`（次要强调）

### 使用比例
- 黑白灰：90-95%
- 青色：5-10%（仅作为点缀）

---

## 🔧 自定义选项

### 调整抽象程度
- **更抽象**：添加 `highly abstract`, `minimalist`, `geometric`
- **更具体**：添加具体元素描述（如 `brain network`, `data flow`）

### 调整像素风格
- **强像素**：`8-bit pixel art`, `16-bit game style`, `retro pixel`
- **柔和像素**：`pixel art aesthetic`, `soft pixel style`

### 调整青色使用
- **更多青色**：增加 `cyan highlights`, `bright cyan accents`
- **更少青色**：仅 `single cyan element`, `subtle cyan accent`

---

## 💡 提示词优化建议

### 如果生成的图片太复杂
- 添加 `ultra minimalist`, `very simple`, `clean background`
- 减少描述元素

### 如果生成的图片太简单
- 添加更多具体元素
- 增加 `detailed`, `intricate pattern`

### 如果颜色不对
- 强调 `monochrome`, `black and white only`
- 明确 `cyan #00BFFF as single accent color`

### 如果风格不对
- 强调 `pixel art style`, `16-bit aesthetic`
- 添加 `Soul app inspired`, `modern minimalist`

---

## 📋 生成清单

- [ ] 生成 9 张背景图片
- [ ] 检查每张图片是否符合风格要求
- [ ] 验证配色（黑白灰 + 青色）
- [ ] 测试作为背景的可读性（文字是否清晰）
- [ ] 优化文件大小
- [ ] 替换 `src/data/background-images.ts` 中的 URL

---

## 🎯 最佳实践

1. **先测试 1-2 张**，确认风格符合要求
2. **调整提示词**，直到满意
3. **批量生成**剩余图片
4. **统一处理**（尺寸、色调、文件大小）
5. **测试效果**在真实页面上

现在可以使用这些提示词生成图片了！

