/**
 * 更新 .env.local 中的 DATABASE_URL
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
const newDbUrl = 'postgresql://postgres.crgzhjlxmbzqvblyqjih:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

if (!existsSync(envPath)) {
  console.log('❌ .env.local 文件不存在');
  process.exit(1);
}

let envContent = readFileSync(envPath, 'utf-8');

// 检查是否已有 DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  // 替换现有的 DATABASE_URL
  envContent = envContent.replace(
    /DATABASE_URL="[^"]*"/,
    `DATABASE_URL="${newDbUrl}"`
  );
  console.log('✅ 已更新 DATABASE_URL\n');
} else {
  // 添加 DATABASE_URL
  envContent = `DATABASE_URL="${newDbUrl}"\n\n` + envContent;
  console.log('✅ 已添加 DATABASE_URL\n');
}

writeFileSync(envPath, envContent, 'utf-8');

console.log('📝 重要提示：');
console.log('⚠️  请将连接字符串中的 [YOUR-PASSWORD] 替换为实际的数据库密码\n');
console.log('当前连接字符串：');
console.log(newDbUrl + '\n');
console.log('更新密码后，运行：');
console.log('  npx prisma db pull  # 验证连接\n');

