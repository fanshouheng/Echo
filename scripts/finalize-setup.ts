/**
 * 加载环境变量并运行 Prisma 命令
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

// 解析环境变量
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)="?([^"]+)"?$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // 移除引号
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

console.log('🔧 环境变量已加载\n');

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL 未找到');
  console.log('请检查 .env.local 文件中的 DATABASE_URL 配置\n');
  process.exit(1);
}

if (process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
  console.log('⚠️  DATABASE_URL 中仍包含 [YOUR-PASSWORD]');
  console.log('请先配置数据库密码\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL 已配置\n');

// 生成 Prisma Client
console.log('📦 正在生成 Prisma Client...\n');
try {
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('\n✅ Prisma Client 生成成功\n');
} catch (error) {
  console.log('\n❌ Prisma Client 生成失败');
  process.exit(1);
}

// 验证数据库连接
console.log('🔍 正在验证数据库连接...\n');
try {
  execSync('npx prisma db pull --force', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('\n✅ 数据库连接验证成功\n');
} catch (error) {
  console.log('\n⚠️  数据库连接验证失败');
  console.log('请检查 DATABASE_URL 是否正确\n');
  process.exit(1);
}

console.log('🎉 配置完成！所有步骤已成功执行\n');
console.log('下一步：');
console.log('  npm run dev  # 启动开发服务器\n');

