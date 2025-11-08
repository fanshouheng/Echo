/**
 * 数据库配置助手脚本
 * 用于获取 Supabase 数据库连接字符串
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = 'crgzhjlxmbzqvblyqjih';
const DB_HOST = `db.${PROJECT_ID}.supabase.co`;

console.log('📋 Supabase 数据库配置信息：\n');
console.log(`项目 ID: ${PROJECT_ID}`);
console.log(`数据库主机: ${DB_HOST}`);
console.log(`端口: 5432`);
console.log(`数据库名: postgres`);
console.log(`用户名: postgres\n`);

console.log('🔑 获取数据库密码：');
console.log(`1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database`);
console.log('2. 在 "Connection string" 部分找到 "URI" 格式');
console.log('3. 复制完整的连接字符串（包含密码）\n');

console.log('📝 连接字符串格式：');
console.log(`postgresql://postgres:[YOUR-PASSWORD]@${DB_HOST}:5432/postgres?pgbouncer=true&connection_limit=1\n`);

// 检查 .env.local 是否存在
const envLocalPath = join(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  const content = readFileSync(envLocalPath, 'utf-8');
  if (content.includes('[YOUR-PASSWORD]')) {
    console.log('⚠️  .env.local 文件存在，但需要填入数据库密码');
    console.log('请按照上述步骤获取密码并更新 .env.local 文件中的 DATABASE_URL\n');
  } else if (content.includes('DATABASE_URL=')) {
    console.log('✅ .env.local 文件已配置 DATABASE_URL');
    const match = content.match(/DATABASE_URL="([^"]+)"/);
    if (match && !match[1].includes('[YOUR-PASSWORD]')) {
      console.log('✅ 数据库连接字符串已配置\n');
    }
  }
} else {
  console.log('⚠️  .env.local 文件不存在，请先创建配置文件\n');
}

console.log('🚀 配置完成后，运行以下命令：');
console.log('  npx prisma generate');
console.log('  npx prisma db pull  # 验证连接');

