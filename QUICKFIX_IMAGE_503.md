# 🖼️ 图像生成 503 错误 - 快速修复

## 🔍 你遇到的问题

```
generate-image:1  Failed to load resource: the server responded with a status of 503 (Service Unavailable)
Image generation failed: AxiosError {message: 'Request failed with status code 503'...}
```

这是 **Google Gemini Imagen 4** 图像生成 API 返回的 503 错误。

---

## ⚡ 立即诊断（3 步骤）

### 步骤 1: 打开测试页面

在浏览器访问：
```
http://localhost:3000/test-api
```

### 步骤 2: 点击 "测试 Gemini Imagen"

测试页面会显示：
- ✅ Gemini API Key 配置状态
- ✅ 文本生成测试（验证基本连接）
- ✅ Imagen 4 模型可用性检查
- ⚠️ 详细错误信息

### 步骤 3: 查看终端日志

在运行 `npm run dev` 的命令行窗口，现在会显示：

```
=== Generate Image API Called ===
Request received - Count: 3 Aspect ratio: 9:16
Personality: [名字]
Gemini configured: true (key length: 39)
🎨 Attempting Gemini Imagen 4 generation...
Model: imagen-4.0-standard-generate-001
❌ Gemini Imagen generation error:
  Error status: 503
  ⚠️ Gemini API 服务暂时不可用 (503)
  可能原因:
    1. Gemini API 服务器过载或维护中
    2. API Key 无效或额度不足
    3. Imagen 4 模型尚未在你的区域可用
⚠️ Falling back to Replicate Flux...
```

---

## 🎯 根据测试结果操作

### 情况 A: Imagen 4 不可用（最常见）

**原因：**
- Imagen 4 是非常新的模型
- 可能在你的区域尚未开放
- 或者需要特殊的 API 访问权限

**✅ 解决方案：使用 Replicate 作为主要模型**

**好消息：** 系统已经配置了自动回退！如果 Gemini 失败，会自动尝试：
1. Replicate Flux Pro（高质量）
2. Replicate SDXL（备用）

你需要配置 Replicate API Key：

1. **获取 Replicate API Key：**
   - 访问 https://replicate.com/
   - 注册账号（有免费额度）
   - 进入 Account Settings → API Tokens
   - 复制你的 API Token

2. **编辑 `.env.local`：**
```env
# Gemini (保留，作为备用)
GOOGLE_GEMINI_API_KEY=AIzaSyCmmKpY0xwXVrF6A96Hsq6ku4ecXeGxNUU

# 添加 Replicate（主要使用）
REPLICATE_API_TOKEN=r8_你的replicate-token

# DeepSeek (人格生成)
DEEPSEEK_API_KEY=sk-f224e57f5c974f6fa702aafa0f6512a8
```

3. **重启服务器：**
```bash
npm run dev
```

4. **测试：**
   - 完成访谈
   - 生成人格
   - 点击"生成 TA 的形象"
   - 查看终端日志，应该显示 "Attempting Flux generation..."

---

### 情况 B: Gemini API Key 问题

**检查步骤：**

1. **访问 Google AI Studio：**
   - https://aistudio.google.com/apikey
   - 登录你的 Google 账号

2. **验证 API Key：**
   - [ ] Key 是否存在且有效
   - [ ] Key 是否有 Imagen 访问权限
   - [ ] 是否有使用配额

3. **重新生成 Key（如果需要）：**
```env
GOOGLE_GEMINI_API_KEY=你的新key
```

4. **重启并测试：**
```bash
npm run dev
```

访问 `http://localhost:3000/test-api` 点击 "测试 Gemini Imagen"

---

### 情况 C: 区域限制

**Imagen 4 可能在以下区域不可用：**
- 中国大陆
- 某些受限国家/地区

**解决方案：**
- 使用 Replicate（见情况 A）
- 或使用 VPN/代理连接到支持的区域

---

## 💰 成本对比

| 方案 | 人格生成 | 图像生成 | 总计/Echo | 质量 |
|------|---------|---------|-----------|------|
| **DeepSeek + Gemini** | ¥0.01 | ¥0.21 | **¥0.22** | ⭐⭐⭐⭐⭐ |
| **DeepSeek + Flux** | ¥0.01 | ¥0.21 | **¥0.22** | ⭐⭐⭐⭐⭐ |
| **DeepSeek + SDXL** | ¥0.01 | ¥0.03 | **¥0.04** | ⭐⭐⭐⭐ |

**推荐配置：DeepSeek + Replicate Flux** ⭐
- 成本适中
- 质量优秀
- 稳定可靠
- 无区域限制

---

## 🔄 回退机制说明

系统已经内置了 **三层回退机制**：

```
1️⃣ Gemini Imagen 4 (主要)
   ↓ 失败
2️⃣ Replicate Flux Pro (高质量备用)
   ↓ 失败
3️⃣ Replicate SDXL (最终备用)
```

**当前问题：** 只配置了 Gemini，所以 Flux 和 SDXL 也失败了。

**解决：** 配置 Replicate API Key，回退机制就会生效！

---

## ✅ 完整配置示例

**推荐的 `.env.local` 配置：**

```env
# 人格生成 - DeepSeek (主要)
DEEPSEEK_API_KEY=sk-f224e57f5c974f6fa702aafa0f6512a8

# 图像生成 - Replicate (主要，推荐)
REPLICATE_API_TOKEN=r8_你的token

# 图像生成 - Gemini (备用，如果可用)
GOOGLE_GEMINI_API_KEY=AIzaSyCmmKpY0xwXVrF6A96Hsq6ku4ecXeGxNUU

# OpenAI (备用，如果 DeepSeek 不可用)
# OPENAI_API_KEY=sk-proj-你的key
```

---

## 🧪 验证修复

配置好 Replicate 后：

1. **重启服务器：**
```bash
npm run dev
```

2. **查看启动日志：**
应该没有 API Key 相关的警告

3. **完成访谈并生成：**
   - 访问 `http://localhost:3000`
   - 完成 12 个问题
   - 查看人格生成（应该成功）
   - 点击"生成 TA 的形象"

4. **查看终端日志：**
```
=== Generate Image API Called ===
Gemini configured: true (key length: 39)
🎨 Attempting Gemini Imagen 4 generation...
❌ Gemini Imagen generation failed
⚠️ Falling back to Replicate Flux...
Attempting Flux generation...
✅ Successfully generated 3 images
```

5. **成功！** 你会看到生成的图像

---

## 📊 Replicate 免费额度

Replicate 提供慷慨的免费试用：
- 💵 每月 $5 免费额度
- 🎨 约 20-25 次图像生成
- ⚡ 足够测试和开发

**注册链接：** https://replicate.com/

---

## 🆘 仍然失败？

如果配置 Replicate 后仍然失败：

1. **检查 Replicate API Token：**
   - 格式应该是 `r8_XXXX...`
   - 长度约 40 个字符
   - 在 https://replicate.com/account/api-tokens 验证

2. **查看完整终端日志：**
   - 复制从 "Generate Image API Called" 开始的所有日志
   - 特别是 "Error message" 和 "Error status"

3. **告诉我：**
   - Gemini 测试结果
   - Replicate API Token 是否配置
   - 完整的错误日志

---

## 🎉 现在就试试！

**第 1 步：获取 Replicate API Token**
https://replicate.com/account/api-tokens

**第 2 步：配置 `.env.local`**
```env
REPLICATE_API_TOKEN=r8_你的token
```

**第 3 步：重启并测试**
```bash
npm run dev
```

**第 4 步：访问测试页面验证**
```
http://localhost:3000/test-api
```

点击 "测试 Gemini Imagen" 查看状态！

---

**💡 提示：** 即使 Gemini 测试失败，只要 Replicate 配置好了，图像生成就能正常工作！

