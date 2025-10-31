# 部署指南

## 🚀 快速部署

### 推荐平台：Vercel（Next.js 官方推荐）

Vercel 是部署 Next.js 应用的最佳选择，提供：
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 环境变量管理
- ✅ 免费额度充足

---

## 📋 部署前准备

### 1. 检查项目配置

确保以下文件已准备好：

- ✅ `package.json` - 包含正确的构建脚本
- ✅ `next.config.ts` - Next.js 配置
- ✅ `.env.local` - 本地环境变量（仅本地开发使用）

### 2. 构建测试

在本地先测试构建：

```bash
# 安装依赖
npm install

# 生产构建测试
npm run build

# 测试生产服务器
npm start
```

如果构建成功，说明代码没有问题，可以部署。

---

## 🌐 部署到 Vercel

### 方法一：通过 Vercel Dashboard（推荐）

#### 步骤 1：准备代码仓库

1. 将代码推送到 GitHub、GitLab 或 Bitbucket
2. 确保仓库是公开的（或升级到 Vercel Pro 支持私有仓库）

#### 步骤 2：连接 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add New Project"**
4. 导入你的仓库

#### 步骤 3：配置项目

**项目设置：**
- **Framework Preset:** Next.js（自动检测）
- **Root Directory:** `./`（默认）
- **Build Command:** `npm run build`（自动）
- **Output Directory:** `.next`（自动）

**环境变量配置：**

点击 "Environment Variables" 添加以下变量：

```env
# 必需 - 人格生成
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# 可选 - 图像生成备用
GOOGLE_GEMINI_API_KEY=AIzaSy...
REPLICATE_API_TOKEN=r8_...
OPENAI_API_KEY=sk-proj-...
```

**重要设置：**
- 选择环境：Production, Preview, Development（全部添加）
- 点击 "Deploy" 开始部署

#### 步骤 4：等待部署完成

- 首次部署约 2-5 分钟
- 部署完成后会获得一个 URL（例如：`https://echo-xxx.vercel.app`）
- 可以自定义域名

### 方法二：通过 Vercel CLI

#### 步骤 1：安装 Vercel CLI

```bash
npm i -g vercel
```

#### 步骤 2：登录 Vercel

```bash
vercel login
```

#### 步骤 3：部署

```bash
# 在项目根目录执行
vercel

# 首次部署会提示配置：
# ? Set up and deploy "~/Echo"? [Y/n] y
# ? Which scope? (选择你的账号)
# ? Link to existing project? [y/N] n
# ? What's your project's name? echo
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n
```

#### 步骤 4：配置环境变量

```bash
# 添加环境变量
vercel env add DEEPSEEK_API_KEY
# 输入值后选择环境：Production, Preview, Development

# 可选：添加其他环境变量
vercel env add GOOGLE_GEMINI_API_KEY
vercel env add REPLICATE_API_TOKEN
```

#### 步骤 5：部署到生产环境

```bash
vercel --prod
```

---

## 🌐 部署到 Netlify

### 步骤 1：准备配置文件

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### 步骤 2：连接 Netlify

1. 访问 [https://app.netlify.com](https://app.netlify.com)
2. 使用 GitHub 登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择你的仓库

### 步骤 3：配置构建

- **Build command:** `npm run build`
- **Publish directory:** `.next`

### 步骤 4：添加环境变量

在 Netlify Dashboard：
1. Site settings → Environment variables
2. 添加所有必需的 API Keys

---

## 🔧 部署配置优化

### Next.js 配置检查

确保 `next.config.ts` 配置正确：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
```

### 构建优化

检查 `package.json` 中的构建脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

---

## 🔐 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥（人格生成） | [DeepSeek Platform](https://platform.deepseek.com/) |

### 可选的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API（图像生成备用） | [Google AI Studio](https://ai.google.dev/) |
| `REPLICATE_API_TOKEN` | Replicate API（图像生成备用） | [Replicate](https://replicate.com/) |
| `OPENAI_API_KEY` | OpenAI API（人格生成备用） | [OpenAI Platform](https://platform.openai.com/) |

### 环境变量设置方式

**Vercel:**
1. 项目设置 → Environment Variables
2. 添加变量名称和值
3. 选择环境（Production/Preview/Development）
4. 保存后自动重新部署

**Netlify:**
1. Site settings → Environment variables
2. 添加变量名称和值
3. 选择环境（All/Production/Deploy previews）
4. 保存后需要手动重新部署

---

## 📊 部署后检查清单

### ✅ 功能检查

- [ ] 访问首页正常显示
- [ ] 访谈流程可以开始
- [ ] 人格生成可以完成
- [ ] 图像生成可以完成（最多等待 60 秒）
- [ ] 图片可以正常加载显示
- [ ] 响应式设计在不同设备上正常

### ✅ 性能检查

- [ ] 首页加载时间 < 2 秒
- [ ] 页面切换流畅
- [ ] 图片加载有加载状态提示

### ✅ 环境变量检查

```bash
# 在部署平台检查环境变量是否正确设置
# Vercel: Project Settings → Environment Variables
# Netlify: Site Settings → Environment Variables
```

---

## 🐛 常见部署问题

### 问题 1：构建失败

**错误信息：**
```
Error: Build failed
```

**解决方案：**
1. 检查 `package.json` 中的依赖是否完整
2. 确保 Node.js 版本 >= 20
3. 查看构建日志中的具体错误
4. 本地运行 `npm run build` 测试

### 问题 2：环境变量未生效

**解决方案：**
1. 确保在部署平台正确添加了环境变量
2. 重新部署应用（Vercel 会自动，Netlify 需要手动）
3. 检查变量名称是否正确（区分大小写）

### 问题 3：API 路由超时

**错误信息：**
```
Function exceeded maximum duration
```

**解决方案：**
- Vercel 免费版函数执行时间限制为 10 秒
- Hobby 计划限制为 60 秒
- 我们已设置 `maxDuration = 300`，但某些平台可能有限制
- 如果遇到此问题，考虑升级到付费计划或使用 Edge Functions

### 问题 4：图片加载失败

**解决方案：**
1. 检查 `next.config.ts` 中的 `remotePatterns` 配置
2. 确保 Pollinations AI URL 格式正确
3. 图片可能需要 10-30 秒生成，耐心等待重试机制

---

## 💰 成本估算

### Vercel 免费额度

- **Hobby Plan（免费）：**
  - 100GB 带宽/月
  - 100 次构建/天
  - 无服务器函数执行时间限制（但功能有限）
  
- **Pro Plan（$20/月）：**
  - 1TB 带宽/月
  - 无限构建
  - 更长的函数执行时间

### 月度成本估算

假设每月生成 100 个 Echo：

| 项目 | 成本 |
|------|------|
| Vercel 托管（Hobby） | $0（免费额度足够） |
| DeepSeek API | ¥1.00（¥0.01 × 100） |
| Pollinations AI | ¥0.00（免费） |
| **总计** | **约 ¥1.00/月** 🎉 |

---

## 📝 部署后维护

### 1. 监控

- 使用 Vercel Analytics 监控访问量
- 检查错误日志
- 监控 API 调用成本

### 2. 更新

```bash
# 本地更新代码后
git add .
git commit -m "Update..."
git push

# Vercel 会自动部署
# Netlify 需要手动触发或设置自动部署
```

### 3. 回滚

**Vercel:**
- 在 Deployment 页面选择之前的版本
- 点击 "Promote to Production"

**Netlify:**
- 在 Deploys 页面选择之前的版本
- 点击 "Publish deploy"

---

## 🎯 推荐部署流程

### 首次部署

1. ✅ 代码推送到 GitHub
2. ✅ 在 Vercel 连接仓库
3. ✅ 配置环境变量
4. ✅ 自动部署完成
5. ✅ 测试所有功能
6. ✅ 绑定自定义域名（可选）

### 持续部署

1. ✅ 本地开发测试
2. ✅ 提交代码到 GitHub
3. ✅ Vercel 自动部署 Preview
4. ✅ 测试 Preview 环境
5. ✅ 合并到 main 分支
6. ✅ 自动部署到 Production

---

## 🆘 需要帮助？

如果遇到部署问题：

1. 查看平台的部署日志
2. 检查环境变量配置
3. 本地测试构建是否成功
4. 查看项目 Issue 或联系支持

**开始部署 →** [Vercel Dashboard](https://vercel.com/new)

