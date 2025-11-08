/**
 * 启动 Prisma Studio（带环境变量）
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

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL 未找到');
  process.exit(1);
}

console.log('🚀 启动 Prisma Studio...\n');
console.log('📊 Prisma Studio 将在浏览器中打开');
console.log('   默认地址: http://localhost:5555\n');
console.log('💡 提示: 按 Ctrl+C 停止服务器\n');

try {
  execSync('npx prisma studio', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  // 用户按 Ctrl+C 退出是正常的
  if ((error as any).signal === 'SIGINT') {
    console.log('\n\n✅ Prisma Studio 已停止');
  } else {
    console.log('\n❌ Prisma Studio 启动失败');
    process.exit(1);
  }
}

