# 环境变量配置说明

## 🎉 最新配置：Pollinations AI（图像生成）

**好消息！** 现在图像生成使用 **Pollinations AI**，完全免费，无需任何 API Key！

### 当前配置状态

| 功能 | 服务 | API Key | 成本 |
|------|------|---------|------|
| 人格生成 | DeepSeek | ✅ 需要 | ¥0.01/次 |
| **图像生成** | **Pollinations** | **🆓 不需要** | **¥0.00** |
| 图像生成备用 | Gemini/Replicate | ❌ 可选 | - |

**总成本：仅 ¥0.01/Echo！** 🎉

---

## 🔑 需要配置的 API Keys

### 1. DeepSeek API Key（✅ 必须 - 人格生成）

```env
DEEPSEEK_API_KEY=sk-...
```

**获取方式：**
1. 访问 https://platform.deepseek.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key

**优势：**
- ✅ 比 OpenAI 便宜 90%+
- ✅ 中文表现优秀
- ✅ 兼容 OpenAI API 格式
- ✅ 响应速度快

**价格（2024）：**
- DeepSeek-Chat: ¥0.001/千 tokens（输入）+ ¥0.002/千 tokens（输出）
- 约 **¥0.01/次** Echo 生成

---

### 2. OpenAI API Key（备用 - 人格生成）

```env
# OPENAI_API_KEY=sk-proj-...
```

**获取方式：**
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key

**说明：**
- 如果设置了 `DEEPSEEK_API_KEY`，会优先使用 DeepSeek
- 如果没有 DeepSeek Key，会使用 OpenAI
- GPT-4o 价格：约 $0.01-0.02/次

---

### 2. Pollinations AI（✅ 当前使用 - 图像生成）

**无需配置！** Pollinations 完全免费，无需 API Key。

- ✅ 完全免费
- ✅ 无需注册
- ✅ 无区域限制
- ✅ 高质量 Flux 模型
- ✅ 自动回退到其他服务

---

### 3. Google Gemini API Key（❌ 可选 - 图像生成备用）

```env
# GOOGLE_GEMINI_API_KEY=AIzaSy...
```

**获取方式：**
1. 访问 https://ai.google.dev/
2. 点击 "Get API key"
3. 创建或选择项目
4. 生成 API key

**优势：**
- ✅ Imagen 4 - Google 最新图像生成模型
- ✅ 高质量输出（Standard/Fast/Ultra 三个等级）
- ✅ 价格实惠（Standard: $0.02-0.04/image）
- ✅ 支持多种宽高比
- ✅ 响应速度快（2-5秒）

**价格（2024）：**
- Imagen 4 Standard: ~$0.03/张（推荐）
- Imagen 4 Fast: ~$0.02/张（更快但质量稍低）
- Imagen 4 Ultra: ~$0.08/张（最高质量）

---

### 4. Replicate API Token（备用 - 图像生成）

```env
REPLICATE_API_TOKEN=r8_...
```

**获取方式：**
1. 访问 https://replicate.com/
2. 注册/登录账号
3. 进入 Account → API Tokens
4. 复制 API Token

**用途：**
- Flux Pro：主力图像生成模型
- SDXL：备用图像生成模型

**价格：**
- Flux Pro: ~$0.03-0.05/3张图
- SDXL: ~$0.01-0.02/3张图（备用）

---

## 📝 完整配置示例

### 最小配置（推荐）⭐

创建 `.env.local` 文件：

```env
# DeepSeek API (人格生成 - 必需)
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# Pollinations AI (图像生成 - 无需配置，自动使用)
# 完全免费，无需 API Key！

# 以下为可选备用服务
# GOOGLE_GEMINI_API_KEY=AIzaSy...
# REPLICATE_API_TOKEN=r8_...
# OPENAI_API_KEY=sk-proj-...
```

---

## 💰 成本对比

### ✅ 当前配置（DeepSeek + Pollinations）🏆
- 人格生成：¥0.01（DeepSeek）
- 图像生成：**¥0.00（Pollinations - 免费）**
- **总计：仅 ¥0.01/Echo** 🎉

### 备选配置 1（DeepSeek + Google Gemini Imagen 4）
- 人格生成：¥0.01
- 图像生成：¥0.21（$0.03 × 3张）
- **总计：约 ¥0.22/Echo**

### 备选配置 2（DeepSeek + Replicate Flux Pro）
- 人格生成：¥0.01
- 图像生成：¥0.20（$0.03/张）
- **总计：约 ¥0.21/Echo**

### 备选配置 2（OpenAI + Replicate SDXL）
- 人格生成：¥0.14（$0.02）
- 图像生成：¥0.07（$0.01/张）
- **总计：约 ¥0.21/Echo**

### 推荐配置（最佳性价比 + 质量）
```env
DEEPSEEK_API_KEY=...         # ✅ 已配置 - 中文效果好 + 便宜
GOOGLE_GEMINI_API_KEY=...    # ✅ 已配置 - Imagen 4 高质量 + 快速
```

**优势组合：**
- 人格生成：DeepSeek 在中文场景表现卓越，成本仅 OpenAI 的 1/10
- 图像生成：Imagen 4 质量优秀，速度快（2-5秒），价格合理
- 多重回退：Imagen → Flux → SDXL，保证生成成功率

---

## 🚀 快速开始

✅ **API Keys 已配置完成！** 现在可以直接使用：

1. 重启开发服务器（按 `Ctrl+C` 停止当前服务器）：
```bash
npm run dev
```

2. 访问 http://localhost:3000 开始测试！

3. 完成访谈后，查看 AI 生成的人格和图像

**当前配置：**
```env
✅ DEEPSEEK_API_KEY - 已配置（人格生成）
✅ GOOGLE_GEMINI_API_KEY - 已配置（图像生成）
```

---

## ❓ 常见问题

### Q: 必须要 DeepSeek 吗？
A: 不是。可以只用 OpenAI，但 DeepSeek 更便宜（1/10成本）且中文表现更好。

### Q: 必须要 Gemini API 吗？
A: 不是必须的。如果你有 Replicate Token，系统会自动回退到 Flux/SDXL。但 Gemini Imagen 4 速度更快（2-5秒 vs 10-30秒），质量也很好。

### Q: 成本会很高吗？
A: 非常实惠！
- DeepSeek + Imagen 4：约 ¥0.22/Echo
- 每月生成 100 个 Echo 也只需要 ¥22

### Q: Imagen 4 的三个版本有什么区别？
A: 
- **Standard**（推荐）：质量和速度平衡，$0.03/张
- **Fast**：更快但质量稍低，$0.02/张
- **Ultra**：最高质量，$0.08/张

### Q: 图像生成失败怎么办？
A: 系统有三重回退机制：
1. Gemini Imagen 4（主力）
2. Replicate Flux Pro（备用 1）
3. Replicate SDXL（备用 2）

只要配置了任一 API，就能成功生成。

### Q: 支持哪些 AI 模型？
A: 
- **人格生成：** DeepSeek-Chat（推荐）、GPT-4o、GPT-4-turbo
- **图像生成：** Imagen 4 Standard/Fast/Ultra（推荐）、Flux Pro、SDXL

