/**
 * 生成 Prisma Client（带环境变量）
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

console.log('🔄 生成 Prisma Client...\n');

try {
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('\n✅ Prisma Client 生成完成！');
} catch (error) {
  console.log('\n❌ Prisma Client 生成失败');
  process.exit(1);
}

