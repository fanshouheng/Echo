# 构建状态检查指南

## 🔍 如何判断构建是否成功

### 1. 检查构建输出目录

```bash
# Windows PowerShell
Test-Path .next
```

如果返回 `True`，说明构建已完成。

### 2. 检查构建日志

构建成功的标志：
- ✅ 看到 `✓ Compiled successfully`
- ✅ 看到路由列表（如 `/api/generate-partner`, `/generate`, `/profile` 等）
- ✅ 看到 `(Static)` 或 `(Dynamic)` 标记

## 🛠️ 如果构建卡住了

### 方法 1：停止所有 Node 进程

```powershell
# 停止所有 Node 相关进程
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force

# 停止 npm 进程
Get-Process | Where-Object { $_.ProcessName -like "*npm*" } | Stop-Process -Force
```

### 方法 2：清理并重新构建

```bash
# 删除构建缓存
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 重新构建
npm run build
```

### 方法 3：检查端口占用

```powershell
# 检查 3000 端口是否被占用
netstat -ano | findstr :3000
```

### 方法 4：重启终端

如果进程卡住，直接关闭终端窗口，重新打开。

## ✅ 构建成功后的下一步

### 本地测试

```bash
# 启动生产服务器
npm run start

# 访问 http://localhost:3000
```

### 部署到 Vercel

1. **如果构建已完成**：
   - 直接推送到 GitHub
   - Vercel 会自动检测并部署

2. **推送到 GitHub**：
   ```bash
   git add .
   git commit -m "fix: 修复 TypeScript 类型错误"
   git push origin master
   ```

3. **在 Vercel 中检查**：
   - 访问 https://vercel.com/dashboard
   - 查看构建日志
   - 确认环境变量已配置

## 🐛 常见问题

### 问题 1：构建过程无响应

**解决方案：**
```powershell
# 强制停止
taskkill /F /IM node.exe
```

### 问题 2：端口被占用

**解决方案：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 停止进程（替换 PID 为实际进程ID）
taskkill /PID <PID> /F
```

### 问题 3：内存不足

**解决方案：**
- 关闭其他应用程序
- 增加 Node 内存限制（在 `package.json` 的 scripts 中添加 `NODE_OPTIONS=--max-old-space-size=4096`）

## 📋 快速检查清单

- [ ] `.next` 目录是否存在？
- [ ] 是否有 TypeScript 错误？
- [ ] 是否有 Node 进程卡住？
- [ ] 端口是否被占用？
- [ ] 环境变量是否配置正确？

## 🚀 快速重启命令

```powershell
# 一键清理并重启
taskkill /F /IM node.exe 2>$null; Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm run build
```

