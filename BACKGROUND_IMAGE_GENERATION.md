# 背景图片生成指南

## 📋 两种方案对比

### 方案 1: 本地保存（推荐）⭐
- ✅ **优点**：
  - 加载速度快（本地文件）
  - 不依赖外部 API
  - 可以控制质量
  - 一次生成，永久使用
  
- ⚠️ **缺点**：
  - 需要先运行生成脚本
  - 占用本地存储空间（约 5-10MB）

### 方案 2: 实时生成
- ✅ **优点**：
  - 无需预生成
  - 每次都是最新的
  
- ⚠️ **缺点**：
  - 加载慢（需要等待 API 响应）
  - 依赖外部服务稳定性
  - 可能每次生成的图片略有不同

---

## 🚀 推荐使用：本地保存

生成一次后，图片保存在 `public/images/background/`，直接使用本地路径。

---

## 使用方法

### 方法 1: 使用 Node.js 脚本（推荐）

```bash
# 在项目根目录运行
node scripts/generate-backgrounds.js
```

脚本会：
1. 生成所有 9 张图片
2. 下载并保存到 `public/images/background/`
3. 生成 `generation-results.json` 记录结果

### 方法 2: 使用 API 路由

```bash
# 启动开发服务器后，访问或调用：
POST http://localhost:3000/api/generate-backgrounds
Body: {
  "saveToLocal": true,
  "width": 1920,
  "height": 1080
}
```

### 方法 3: 使用浏览器直接访问

访问生成后的 URL（Pollinations 实时生成）：
```
https://image.pollinations.ai/prompt/[提示词]?width=1920&height=1080&model=turbo&nologo=true
```

---

## 📝 生成后更新配置文件

生成完成后，需要更新 `src/data/background-images.ts`：

```typescript
export const backgroundImages: BackgroundImage[] = [
  {
    id: "bg-1",
    url: "/images/background/bg-1.jpg", // 使用本地路径
    description: "通过心理学模型深度分析你的情感模式和依恋风格",
    category: "understanding",
    gridColumn: 1,
    gridRow: 1,
  },
  // ... 其他 8 张图片
];
```

---

## ⚙️ 配置选项

在 `scripts/generate-backgrounds.js` 中可以修改：

```javascript
const CONFIG = {
  width: 1920,      // 图片宽度
  height: 1080,     // 图片高度
  model: 'turbo',   // 模型：turbo (快), flux (质量高), anime (动漫风格)
  outputDir: '...' // 输出目录
};
```

---

## 🎨 图片规格

- **尺寸**：1920×1080 (16:9)
- **格式**：JPG
- **文件大小**：每张约 500KB - 1MB
- **总大小**：约 5-10MB

---

## ⚡ 快速开始

1. 运行生成脚本：
   ```bash
   node scripts/generate-backgrounds.js
   ```

2. 等待生成完成（约 2-3 分钟）

3. 更新 `src/data/background-images.ts` 中的 URL 为本地路径

4. 重启开发服务器，查看效果

---

现在可以开始生成了！🎉

