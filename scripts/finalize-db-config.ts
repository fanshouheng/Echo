/**
 * 更新数据库密码并验证连接
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const envPath = join(process.cwd(), '.env.local');
const password = 'U4wmWDflh1p2oIDA';
const dbUrl = `postgresql://postgres.crgzhjlxmbzqvblyqjih:${password}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`;

if (!existsSync(envPath)) {
  console.log('❌ .env.local 文件不存在');
  process.exit(1);
}

let envContent = readFileSync(envPath, 'utf-8');

// 更新 DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  envContent = envContent.replace(
    /DATABASE_URL="[^"]*"/,
    `DATABASE_URL="${dbUrl}"`
  );
  console.log('✅ 已更新 DATABASE_URL（密码已配置）\n');
} else {
  envContent = `DATABASE_URL="${dbUrl}"\n\n` + envContent;
  console.log('✅ 已添加 DATABASE_URL（密码已配置）\n');
}

writeFileSync(envPath, envContent, 'utf-8');

// 设置环境变量
process.env.DATABASE_URL = dbUrl;

// 验证数据库连接
console.log('🔍 正在验证数据库连接...\n');
try {
  execSync('npx prisma db pull --force', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl }
  });
  console.log('\n✅ 数据库连接验证成功！\n');
  console.log('🎉 配置完成！所有步骤已成功执行\n');
  console.log('下一步：');
  console.log('  npm run dev  # 启动开发服务器\n');
} catch (error) {
  console.log('\n⚠️  数据库连接验证失败');
  console.log('请检查：');
  console.log('1. 密码是否正确');
  console.log('2. 网络连接是否正常');
  console.log('3. Supabase 项目状态是否正常\n');
  process.exit(1);
}

