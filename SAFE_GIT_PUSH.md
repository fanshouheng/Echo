# 安全推送代码到 GitHub 指南

## ⚠️ 重要安全提醒

**永远不要将 API 密钥推送到公开仓库！**

如果你的 API 密钥泄露，可能导致：
- ❌ 他人使用你的 API 额度
- ❌ 产生高额费用
- ❌ 账户被滥用

---

## ✅ 安全推送步骤

### 第 1 步：检查当前状态

```bash
# 检查是否有环境变量文件被 Git 追踪
git status

# 检查 .gitignore 是否正确
git check-ignore -v .env.local
```

**预期结果：**
- `.env.local` 应该显示 "被忽略"
- 如果显示 "未忽略"，说明 `.gitignore` 配置有问题

### 第 2 步：确保环境变量文件被忽略

`.gitignore` 已经配置了：
```
.env
.env.local
.env*.local
```

**如果 `.env.local` 已经被 Git 追踪（之前误提交）：**

```bash
# 从 Git 中移除（但保留本地文件）
git rm --cached .env.local

# 如果还有其他环境变量文件
git rm --cached .env
git rm --cached .env.production
# ... 等等

# 提交这个更改
git add .gitignore
git commit -m "chore: 确保环境变量文件不被追踪"
```

### 第 3 步：检查是否有密钥在代码中

**检查代码中是否有硬编码的 API 密钥：**

```bash
# 搜索可能的 API 密钥模式
# （注意：这只是粗略检查，不能保证完全安全）
```

**重要：** 
- ✅ 代码中使用 `process.env.DEEPSEEK_API_KEY` 是正确的（这只是引用）
- ❌ 代码中直接写 `sk-xxx` 是危险的（硬编码密钥）

### 第 4 步：创建安全提交

```bash
# 查看将要提交的文件
git status

# 确认没有 .env 文件
# 如果没有问题，正常提交
git add .
git commit -m "feat: 准备部署到生产环境"

# 推送到 GitHub
git push origin main
```

### 第 5 步：验证推送结果

在 GitHub 网页上检查：
1. 访问你的仓库：`https://github.com/你的用户名/echo`
2. 确认 `.env.local` **不在文件列表中**
3. 确认 `.env.example` **在文件列表中**（这是模板，安全的）

---

## 🔍 如果已经误推送了密钥怎么办？

### 紧急处理步骤

#### 1. 立即撤销/重置密钥

**最重要：先撤销泄露的 API 密钥！**

- **DeepSeek:** https://platform.deepseek.com/ → 删除/重置 API Key
- **OpenAI:** https://platform.openai.com/api-keys → 删除泄露的 Key
- **Google Gemini:** https://ai.google.dev/ → 删除 API Key
- **Replicate:** https://replicate.com/account → 重置 Token

#### 2. 从 Git 历史中移除

```bash
# 使用 git filter-branch 或 git filter-repo 移除敏感文件
# 警告：这会重写 Git 历史，需要强制推送

# 方法 1：使用 BFG Repo-Cleaner（推荐）
# 下载：https://rtyley.github.io/bfg-repo-cleaner/
bfg --delete-files .env.local

# 方法 2：使用 git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（谨慎！）
git push origin --force --all
```

#### 3. 清理本地历史

```bash
# 清理本地 Git 历史
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**⚠️ 注意：**
- 如果仓库是公开的，密钥可能已经被他人看到
- 即使从历史中删除，GitHub 的快照备份可能仍保留
- **最安全的方式：重置所有 API 密钥**

---

## 📋 推送前检查清单

推送前确认：

- [ ] `.env.local` 不在 `git status` 列表中
- [ ] `.gitignore` 包含 `.env*`
- [ ] 代码中没有硬编码 API 密钥
- [ ] `.env.example` 只包含模板，没有真实密钥
- [ ] 所有 API 密钥都使用 `process.env.XXX` 方式读取
- [ ] 已创建 `.env.example` 作为配置模板

---

## 🛡️ 最佳实践

### 1. 环境变量管理

```bash
# ✅ 正确：使用环境变量文件（.env.local）
DEEPSEEK_API_KEY=sk-xxx

# ❌ 错误：硬编码在代码中
const apiKey = "sk-xxx";
```

### 2. Git 提交前检查

```bash
# 每次提交前检查
git status
git diff --cached

# 确保没有敏感信息
```

### 3. 使用 Git Hooks

创建 `.git/hooks/pre-commit`（可选，高级用法）：

```bash
#!/bin/sh
# 检查是否提交了 .env 文件
if git diff --cached --name-only | grep -E '\.env'; then
  echo "❌ 错误：检测到 .env 文件！"
  echo "请确保 API 密钥不会被提交。"
  exit 1
fi
```

### 4. 代码审查

- 团队协作时，互相审查代码
- 使用 GitHub 的 Code Scanning 功能
- 定期检查是否有密钥泄露

---

## ✅ 验证安全性

推送后，在 GitHub 网页上：

1. 搜索你的仓库中是否包含 API 密钥：
   - 在仓库页面使用搜索功能
   - 搜索 `sk-`、`r8_`、`AIzaSy` 等密钥前缀
   - 如果找到，说明密钥泄露了！

2. 检查 `.env.local` 是否可见：
   - 访问：`https://github.com/你的用户名/echo/blob/main/.env.local`
   - 如果显示 404，说明安全 ✅
   - 如果显示内容，说明泄露了 ❌

---

## 🎯 快速检查命令

```bash
# 一键检查脚本（在项目根目录运行）
Write-Host "=== 安全检查 ===" -ForegroundColor Cyan

# 检查 .env.local 是否被忽略
if (git check-ignore .env.local) {
    Write-Host "✅ .env.local 已被 Git 忽略" -ForegroundColor Green
} else {
    Write-Host "⚠️ .env.local 未被忽略！需要添加到 .gitignore" -ForegroundColor Red
}

# 检查是否在暂存区
$staged = git diff --cached --name-only | Select-String -Pattern "\.env"
if ($staged) {
    Write-Host "❌ 发现 .env 文件在暂存区：" -ForegroundColor Red
    Write-Host $staged -ForegroundColor Red
} else {
    Write-Host "✅ 暂存区没有 .env 文件" -ForegroundColor Green
}

# 检查是否在未跟踪文件
$untracked = git status --porcelain | Select-String -Pattern "\.env"
if ($untracked) {
    Write-Host "⚠️ 发现未跟踪的 .env 文件（但应该被忽略）" -ForegroundColor Yellow
} else {
    Write-Host "✅ 没有未跟踪的 .env 文件" -ForegroundColor Green
}

Write-Host "`n=== 检查完成 ===" -ForegroundColor Cyan
```

---

## 💡 总结

**推送代码到 GitHub 前：**

1. ✅ 确保 `.gitignore` 正确配置
2. ✅ 确认 `.env.local` 被忽略
3. ✅ 检查 `git status` 没有环境变量文件
4. ✅ 创建 `.env.example` 作为模板
5. ✅ 验证代码中没有硬编码密钥

**完成后可以安全推送！** 🚀

