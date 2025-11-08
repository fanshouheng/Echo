# 数据库迁移和配置完成指南

## ✅ 已完成的工作

1. ✅ 创建新的 Supabase 项目 (`echo-mvp`)
2. ✅ 执行数据库迁移（所有表已创建）
3. ✅ 生成 NEXTAUTH_SECRET
4. ✅ 创建 `.env.local` 配置文件模板

## 🔑 获取数据库密码（必需）

由于数据库密码是敏感信息，Supabase MCP 无法直接获取。请按以下步骤操作：

### 方法 1：从 Supabase Dashboard 获取（推荐）

1. 访问：https://supabase.com/dashboard/project/crgzhjlxmbzqvblyqjih/settings/database
2. 找到 **Connection string** 部分
3. 选择 **URI** 格式
4. 复制完整的连接字符串（格式类似：`postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`）

### 方法 2：重置数据库密码

如果忘记密码，可以：
1. 访问 Dashboard Settings → Database
2. 点击 **Reset database password**
3. 复制新密码

## 📝 更新 .env.local 文件

打开 `.env.local` 文件，将 `DATABASE_URL` 中的 `[YOUR-PASSWORD]` 替换为实际的数据库密码。

**当前配置：**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.crgzhjlxmbzqvblyqjih.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

**更新后应该是：**
```env
DATABASE_URL="postgresql://postgres:你的实际密码@db.crgzhjlxmbzqvblyqjih.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

## 🚀 完成配置后的步骤

配置好 `DATABASE_URL` 后，运行：

```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 验证数据库连接
npx prisma db pull

# 3. 启动开发服务器
npm run dev
```

## 📊 项目信息

- **项目 ID**: `crgzhjlxmbzqvblyqjih`
- **项目名称**: `echo-mvp`
- **API URL**: `https://crgzhjlxmbzqvblyqjih.supabase.co`
- **数据库主机**: `db.crgzhjlxmbzqvblyqjih.supabase.co`
- **NEXTAUTH_SECRET**: 已生成（在 .env.local 中）

## ✅ 验证清单

- [x] Supabase 项目已创建
- [x] 数据库迁移已执行
- [x] .env.local 文件已创建
- [x] NEXTAUTH_SECRET 已生成
- [ ] 数据库密码已配置（需要手动完成）
- [ ] Prisma Client 已生成（配置密码后运行）
- [ ] 数据库连接已验证（配置密码后运行）

## 🆘 需要帮助？

如果遇到问题：
1. 检查 `.env.local` 文件中的 `DATABASE_URL` 是否正确
2. 确保密码没有特殊字符需要 URL 编码
3. 运行 `npx prisma db pull` 验证连接
4. 查看 Supabase Dashboard 中的数据库日志

