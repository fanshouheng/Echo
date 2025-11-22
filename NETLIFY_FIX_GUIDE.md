# Netlify 部署问题修复指南

## 🔧 问题诊断

根据错误信息，Netlify 在解析配置文件时遇到了语法错误：

```
Failed during stage 'Reading and parsing configuration files'
Failed to parse configuration
```

## ✅ 已修复的问题

### 1. 移除了不兼容的配置语法

**问题**: Netlify 不支持 `context.production.environment` 语法

**修复**: 移除了以下不兼容的配置块：
```toml
# 移除了这个配置块
[context.production.environment]
  NEXTAUTH_URL = { required = true }
  DATABASE_URL = { required = true }
  # ... 其他环境变量
```

### 2. 简化了配置文件结构

**当前有效的 `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# ... 头部配置和函数配置
```

## 🚀 重新部署步骤

### 1. 验证配置文件
```bash
# 验证 TOML 语法
python -c "import tomllib; tomllib.load(open('netlify.toml', 'rb'))"
echo "✅ 配置文件语法正确"
```

### 2. 提交修复的配置
```bash
git add netlify.toml
git commit -m "fix: 修复 Netlify 配置文件语法错误"
git push origin main
```

### 3. 在 Netlify 仪表板中重新部署
1. 访问你的 Netlify 项目仪表板
2. 点击 "Deploy site" 或等待自动触发
3. 查看构建日志确认配置解析成功

## 🔍 验证部署成功

部署成功后，检查以下内容：

### 1. 构建日志
- ✅ "TOML parsing successful"
- ✅ "Build command: npm run build"
- ✅ "Publish directory: .next"

### 2. 环境变量
确保在 Netlify 仪表板的 "Environment" 设置中配置了所有必需的环境变量：

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-site.netlify.app"
DEEPSEEK_API_KEY="your-api-key"
DOUBAO_API_KEY="your-api-key"
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"
NODE_VERSION="20"
```

### 3. 功能测试
部署完成后测试：
- [ ] 首页加载
- [ ] 用户注册/登录
- [ ] API 路由访问
- [ ] 静态资源加载

## 🛠️ 如果仍有问题

### 1. 使用最小配置测试
如果仍有配置解析错误，可以暂时使用最小配置：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

### 2. 逐步添加配置
确认基本构建成功后，逐步添加其他配置：
1. 重定向规则
2. 头部配置
3. 函数配置

### 3. 联系支持
如果问题持续存在：
1. 复制完整的错误日志
2. 提供 `netlify.toml` 内容
3. 联系 Netlify 支持或查看 [Netlify 文档](https://docs.netlify.com/configure-builds/)

## 📝 部署后的环境变量设置

由于我们移除了配置文件中的环境变量验证，需要在 Netlify 仪表板中手动设置：

1. **进入 Site settings > Build & deploy > Environment**
2. **添加所有必需的环境变量**
3. **保存设置**

## 🎯 下一步

配置修复完成后，你的项目应该能够成功部署。如果需要添加额外的配置（如重定向、头部设置等），建议：

1. 每次只添加一个配置块
2. 部署验证成功后再添加下一个
3. 使用 TOML 验证器确保语法正确

---

**✅ 问题已修复！现在可以重新尝试部署。**