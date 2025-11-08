/**
 * 更新 .env.local 文件，添加数据库配置
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = 'crgzhjlxmbzqvblyqjih';
const DB_HOST = `db.${PROJECT_ID}.supabase.co`;
const NEXTAUTH_SECRET = 'Z96hLCozcqPDIIr/fwba5rPT0pz+bIrNQ49B8hnW9Ms=';

const envPath = join(process.cwd(), '.env.local');

console.log('🔧 更新 .env.local 文件...\n');

let envContent = '';
if (existsSync(envPath)) {
  envContent = readFileSync(envPath, 'utf-8');
  console.log('✅ 读取现有 .env.local 文件\n');
} else {
  console.log('📝 创建新的 .env.local 文件\n');
}

// 需要添加的配置
const dbConfig = `# ============================================
# 数据库配置 (Supabase)
# ============================================
# ⚠️ 重要：请从 Supabase Dashboard 获取数据库密码并替换 [YOUR-PASSWORD]
# 访问：https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database
# 在 "Connection string" 部分选择 "URI" 格式，复制完整的连接字符串
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@${DB_HOST}:5432/postgres?pgbouncer=true&connection_limit=1"

# ============================================
# NextAuth 配置
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# ============================================
# 邮箱配置（用于魔法链接登录，可选）
# ============================================
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@example.com"

# ============================================
# OAuth 配置（可选）
# ============================================
# GitHub OAuth
GITHUB_ID=""
GITHUB_SECRET=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

`;

// 检查是否已有 DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  console.log('ℹ️  DATABASE_URL 已存在，跳过添加\n');
} else {
  // 添加到文件开头
  const updatedContent = dbConfig + '\n' + envContent;
  writeFileSync(envPath, updatedContent, 'utf-8');
  console.log('✅ 已添加数据库配置到 .env.local\n');
}

// 检查是否需要配置密码
if (envContent.includes('[YOUR-PASSWORD]') || !envContent.includes('DATABASE_URL=')) {
  console.log('⚠️  需要配置数据库密码\n');
  console.log('📝 获取数据库密码：\n');
  console.log(`1. 访问: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database\n`);
  console.log('2. 在 "Connection string" 部分找到 "URI" 格式');
  console.log('3. 复制完整的连接字符串（包含密码）\n');
  console.log('4. 更新 .env.local 文件中的 DATABASE_URL');
  console.log('   将 [YOUR-PASSWORD] 替换为实际密码\n');
} else {
  console.log('✅ DATABASE_URL 已配置\n');
}

console.log('📋 项目信息：');
console.log(`   项目 ID: ${PROJECT_ID}`);
console.log(`   数据库主机: ${DB_HOST}`);
console.log(`   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}\n`);

console.log('🚀 配置完成后，运行：');
console.log('   npx prisma generate');
console.log('   npx prisma db pull  # 验证连接\n');

