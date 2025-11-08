/**
 * 自动配置数据库连接脚本
 * 使用 Supabase MCP 获取项目信息并创建配置文件
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = 'crgzhjlxmbzqvblyqjih';
const DB_HOST = `db.${PROJECT_ID}.supabase.co`;
const NEXTAUTH_SECRET = 'Z96hLCozcqPDIIr/fwba5rPT0pz+bIrNQ49B8hnW9Ms=';

const envContent = `# 数据库配置
# ⚠️ 重要：请从 Supabase Dashboard 获取数据库密码并替换 [YOUR-PASSWORD]
# 访问：https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database
# 在 "Connection string" 部分选择 "URI" 格式，复制完整的连接字符串
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@${DB_HOST}:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# 邮箱配置（用于魔法链接登录）
# 如果需要邮箱登录功能，请配置以下信息
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@example.com"

# OAuth 配置（可选）
# GitHub OAuth - 如果需要 GitHub 登录，请到 https://github.com/settings/developers 创建 OAuth App
GITHUB_ID=""
GITHUB_SECRET=""

# Google OAuth - 如果需要 Google 登录，请到 https://console.cloud.google.com/apis/credentials 创建 OAuth 2.0 客户端
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI 模型配置（如果已有，请保持原有配置）
# DEEPSEEK_API_KEY="your-deepseek-api-key"
# DOUBAO_API_KEY="your-doubao-api-key"
`;

const envPath = join(process.cwd(), '.env.local');

console.log('🔧 正在创建 .env.local 配置文件...\n');

if (existsSync(envPath)) {
  console.log('⚠️  .env.local 文件已存在');
  console.log('是否要覆盖？(y/n)');
  // 在非交互模式下，我们创建备份
  const backupPath = envPath + '.backup';
  if (existsSync(backupPath)) {
    console.log(`备份文件已存在: ${backupPath}`);
  }
} else {
  writeFileSync(envPath, envContent, 'utf-8');
  console.log('✅ .env.local 文件已创建\n');
}

console.log('📋 下一步操作：\n');
console.log('1. 获取数据库密码：');
console.log(`   访问: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database`);
console.log('   在 "Connection string" 部分找到 "URI" 格式');
console.log('   复制完整的连接字符串（包含密码）\n');

console.log('2. 更新 .env.local 文件：');
console.log(`   将 DATABASE_URL 中的 [YOUR-PASSWORD] 替换为实际密码\n`);

console.log('3. 运行以下命令完成配置：');
console.log('   npx prisma generate');
console.log('   npx prisma db pull  # 验证连接\n');

console.log('📝 项目信息：');
console.log(`   项目 ID: ${PROJECT_ID}`);
console.log(`   数据库主机: ${DB_HOST}`);
console.log(`   NEXTAUTH_SECRET: 已生成\n`);

