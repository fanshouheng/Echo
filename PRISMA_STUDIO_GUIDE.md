# Prisma Studio 启动指南

## 🚀 方法 1：使用脚本（推荐）

运行以下命令：

```bash
npx tsx scripts/start-prisma-studio.ts
```

这会自动加载 `.env.local` 中的环境变量并启动 Prisma Studio。

## 🔧 方法 2：手动设置环境变量

### Windows PowerShell

```powershell
$env:DATABASE_URL="postgresql://postgres.crgzhjlxmbzqvblyqjih:U4wmWDflh1p2oIDA@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
npx prisma studio
```

### Windows CMD

```cmd
set DATABASE_URL=postgresql://postgres.crgzhjlxmbzqvblyqjih:U4wmWDflh1p2oIDA@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
npx prisma studio
```

### Linux/Mac

```bash
export DATABASE_URL="postgresql://postgres.crgzhjlxmbzqvblyqjih:U4wmWDflh1p2oIDA@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
npx prisma studio
```

## 📝 方法 3：使用 dotenv-cli（如果已安装）

```bash
npx dotenv-cli -e .env.local -- npx prisma studio
```

## 💡 Prisma Studio 功能

Prisma Studio 是一个可视化数据库管理工具，可以：

- ✅ 查看所有表和数据
- ✅ 添加、编辑、删除数据
- ✅ 搜索和过滤数据
- ✅ 查看表之间的关系

启动后，Prisma Studio 会在浏览器中自动打开（默认地址：http://localhost:5555）

## 🆘 如果仍然无法启动

1. 检查 `.env.local` 文件是否存在
2. 确认 `DATABASE_URL` 配置正确
3. 检查数据库连接是否正常
4. 尝试使用脚本方法（方法 1）

