/**
 * 直接同步数据库 schema（带环境变量）
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const envPath = join(process.cwd(), '.env.local');

if (!existsSync(envPath)) {
  console.log('❌ .env.local 文件不存在');
  process.exit(1);
}

// 读取环境变量
const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)="?([^"]+)"?$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  }
});

// 设置环境变量
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL 未找到');
  process.exit(1);
}

console.log('🔄 同步数据库 schema（添加 password 字段）...\n');
console.log('💡 这会直接更新 Supabase 数据库，不会创建迁移文件\n');

try {
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('\n✅ Schema 同步完成！');
  console.log('\n📝 下一步：运行 npx prisma generate 重新生成 Prisma Client');
} catch (error) {
  console.log('\n❌ Schema 同步失败');
  process.exit(1);
}

