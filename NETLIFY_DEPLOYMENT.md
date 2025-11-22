# Netlify 部署指南

## 🚀 快速部署

### 方法一：一键部署（推荐）

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/echo)

点击上面的按钮，Netlify 会自动：
1. Fork 项目到你的 GitHub 账户
2. 设置持续部署
3. 配置基础环境

### 方法二：手动部署

1. **克隆项目到 GitHub**
   ```bash
   git clone https://github.com/yourusername/echo.git
   cd echo
   git remote add origin https://github.com/yourusername/echo.git
   git push -u origin main
   ```

2. **在 Netlify 上创建新站点**
   - 访问 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库
   - 配置构建设置：
     - **Branch to deploy**: `main`
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`

3. **设置环境变量**
   在 Netlify 仪表板中设置以下环境变量：

   ```env
   # 数据库连接（推荐使用 Supabase）
   DATABASE_URL="postgresql://user:password@host:port/database"

   # NextAuth.js 配置
   NEXTAUTH_SECRET="your-secret-key-here"  # 运行: openssl rand -base64 32
   NEXTAUTH_URL="https://your-site.netlify.app"  # 替换为你的实际域名

   # 邮件服务（用于邮箱登录）
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@example.com"

   # AI API Keys
   DEEPSEEK_API_KEY="your-deepseek-api-key"
   DOUBAO_API_KEY="your-doubao-api-key"

   # OAuth 提供商（可选）
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Node.js 版本
   NODE_VERSION="20"
   ```

## 🗄️ 数据库设置

### 使用 Supabase（推荐）

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 创建数据库
4. 运行数据库迁移：
   ```sql
   -- 在 Supabase SQL Editor 中运行
   -- 数据库结构会在部署时自动创建
   ```

5. 获取连接字符串：
   ```
   postgresql://postgres:{PASSWORD}@{HOST}:5432/postgres
   ```

### 数据库迁移

在本地开发环境中：
```bash
# 运行迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate
```

在生产环境中，Netlify 会在构建时自动运行迁移。

## 🔧 配置文件说明

### `netlify.toml` 配置

项目已包含完整的 `netlify.toml` 配置文件，包含：

- **构建设置**: 使用 Node.js 20 和正确的构建命令
- **重定向规则**: 支持 Next.js App Router 和 API 路由
- **安全头**: Content-Security-Policy、CORS 等安全配置
- **缓存策略**: 优化静态资源和 API 响应缓存
- **环境变量验证**: 确保必需的环境变量已设置

### Netlify Functions

项目包含必要的函数来处理：

- **API 路由**: `netlify/functions/api-image.js` - 处理图像生成 API
- **认证路由**: `netlify/functions/auth.js` - 处理 NextAuth.js 认证

## 🌐 自定义域名

1. 在 Netlify 仪表板中：
   - Settings > Domain Management
   - 添加你的自定义域名

2. 配置 DNS（在你的域名注册商处）：
   ```
   A 记录: @ -> 75.2.60.5
   CNAME 记录: www -> your-site.netlify.app
   ```

3. 启用 HTTPS：
   - Netlify 自动提供 SSL 证书
   - 在 Site settings > Domain management 中强制 HTTPS

## 🚀 部署后检查

部署完成后，检查以下内容：

### 1. 功能测试
- [ ] 首页加载正常
- [ ] 用户注册/登录功能
- [ ] 问卷填写流程
- [ ] AI 人格生成
- [ ] 图像生成功能
- [ ] 用户档案页面

### 2. 环境变量验证
确保所有必需的环境变量都已正确设置：
- 数据库连接
- API 密钥
- 认证配置

### 3. 安全检查
- [ ] HTTPS 已启用
- [ ] CSP 头已设置
- [ ] CORS 配置正确
- [ ] 敏感信息未泄露

## 🔄 持续部署

每次推送代码到 GitHub 时，Netlify 会自动：

1. 安装依赖 (`npm install`)
2. 运行构建 (`npm run build`)
3. 部署新版本

### 构建日志
在 Netlify 仪表板的 "Deploys" 标签页中查看构建日志。

### 回滚
如果新版本有问题，可以：
1. 在 "Deploys" 页面找到之前的成功部署
2. 点击 "Deploy site" 恢复到该版本

## 🐛 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本是否为 20
   - 确认所有环境变量已设置
   - 查看构建日志中的具体错误

2. **数据库连接失败**
   - 验证 `DATABASE_URL` 格式正确
   - 确认数据库允许外部连接
   - 检查防火墙设置

3. **API 调用失败**
   - 验证 API 密钥有效性
   - 检查网络连接
   - 查看浏览器控制台错误

4. **认证问题**
   - 确认 `NEXTAUTH_URL` 设置正确
   - 检查认证提供者配置
   - 验证 `NEXTAUTH_SECRET` 格式

### 调试工具

- **Netlify Dev**: 本地测试部署配置
  ```bash
  npm install -g netlify-cli
  netlify dev
  ```

- **构建插件**: 使用 Prisma 插件处理数据库
  ```toml
  [[plugins]]
  package = "@netlify/plugin-prisma"
  ```

## 📊 性能优化

### 已配置的优化
- **图像优化**: 配置了远程图像模式和缓存策略
- **静态资源缓存**: 长期缓存策略
- **API 响应缓存**: 图像生成 API 的智能缓存
- **代码分割**: Next.js 自动代码分割
- **压缩**: CSS、JS、HTML 自动压缩

### 监控
- 使用 Netlify Analytics 监控性能
- 设置性能警报
- 定期检查 Core Web Vitals

## 📞 支持

如果遇到问题：

1. 查看 [Netlify 帮助文档](https://docs.netlify.com/)
2. 检查项目 [GitHub Issues](https://github.com/yourusername/echo/issues)
3. 联系项目维护者

---

**🎉 恭喜！你的 Echo AI 项目已成功部署到 Netlify！**