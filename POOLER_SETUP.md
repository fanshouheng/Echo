# 📝 使用 Supabase Session Pooler 连接字符串

## 🔧 步骤说明

1. **点击 "Pooler settings" 按钮**
   - 在页面上的 IPv4 警告下方
   - 或者切换到 "Method" 下拉菜单，选择 "Session mode" 或 "Transaction mode"

2. **选择连接池模式**
   - **Session mode**：适合大多数应用（推荐）
   - **Transaction mode**：适合需要事务控制的应用

3. **复制连接字符串**
   - 连接字符串格式应该是：
     ```
     postgresql://postgres.xxx:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
     ```
   - 注意端口是 **6543**（连接池端口）
   - 主机名包含 **pooler** 字样

4. **更新 .env.local 文件**
   - 打开 `.env.local` 文件
   - 找到 `DATABASE_URL` 这一行
   - 将整个值替换为从 Dashboard 复制的连接字符串
   - 确保密码部分（`[YOUR_PASSWORD]`）已替换为实际密码

## ✅ 验证连接

更新后运行：

```bash
npx prisma db pull
```

如果成功，说明连接配置正确！

## 💡 为什么使用连接池？

- ✅ IPv4 兼容性更好
- ✅ 连接更稳定
- ✅ 适合应用使用（不是直接数据库连接）
- ✅ 性能更好（连接复用）

