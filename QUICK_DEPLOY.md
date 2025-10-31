# 快速部署指南（5 分钟）

## ✅ 安全推送代码到 GitHub

### 第 1 步：确认安全配置

你的项目已经配置好了安全设置：

- ✅ `.gitignore` 已正确配置，忽略所有 `.env*` 文件
- ✅ `.env.local` 已被 Git 忽略（不会提交）
- ✅ `.env.example` 模板文件已创建（可以提交，用于说明）

### 第 2 步：验证安全性（可选）

```bash
# 快速安全检查
git status

# 应该看不到任何 .env 文件
# 如果看到了，不要继续！
```

### 第 3 步：提交代码

```bash
# 添加所有文件（.env.local 会自动被忽略）
git add .

# 提交
git commit -m "feat: Echo AI 伴侣生成器 - 准备部署"

# 推送到 GitHub
git push origin main
```

### 第 4 步：部署到 Vercel

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New Project"
4. 选择你的仓库
5. **配置环境变量：**
   - 添加 `DEEPSEEK_API_KEY` = 你的实际密钥
   - （可选）添加其他 API Keys
6. 点击 "Deploy"

### 第 5 步：完成！

等待 2-5 分钟，获得你的线上网址 🎉

---

## ⚠️ 重要提醒

**部署时需要手动配置环境变量：**

在 Vercel 项目设置中添加：
- `DEEPSEEK_API_KEY` = 从你的 `.env.local` 复制
- （可选）其他 API Keys

**不要**从 GitHub 仓库复制，因为那里没有密钥！

---

## 🔍 如果推送后发现问题

如果发现 `.env.local` 被意外推送了：

1. **立即撤销所有 API 密钥**（在对应平台重置）
2. 从 Git 历史中移除：
   ```bash
   git rm --cached .env.local
   git commit -m "chore: 移除误提交的环境变量文件"
   git push
   ```

详细步骤见 `SAFE_GIT_PUSH.md`

