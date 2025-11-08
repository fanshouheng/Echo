/**
 * 自动完成数据库配置脚本
 * 1. 检查 .env.local 配置
 * 2. 生成 Prisma Client
 * 3. 验证数据库连接
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ID = 'crgzhjlxmbzqvblyqjih';
const envPath = join(process.cwd(), '.env.local');

console.log('🚀 开始自动配置数据库...\n');

// 1. 检查 .env.local 文件
if (!existsSync(envPath)) {
  console.log('❌ .env.local 文件不存在');
  console.log('请先运行: npx tsx scripts/create-env-config.ts');
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf-8');

// 2. 检查 DATABASE_URL 是否已配置
if (envContent.includes('[YOUR-PASSWORD]')) {
  console.log('⚠️  数据库密码未配置');
  console.log('\n请按以下步骤操作：');
  console.log(`1. 访问: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database`);
  console.log('2. 在 "Connection string" 部分找到 "URI" 格式');
  console.log('3. 复制完整的连接字符串');
  console.log('4. 更新 .env.local 文件中的 DATABASE_URL\n');
  console.log('配置完成后，再次运行此脚本。');
  process.exit(0);
}

// 3. 提取 DATABASE_URL
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
if (!dbUrlMatch) {
  console.log('❌ 未找到 DATABASE_URL 配置');
  process.exit(1);
}

const databaseUrl = dbUrlMatch[1];
console.log('✅ DATABASE_URL 已配置\n');

// 4. 生成 Prisma Client
console.log('📦 正在生成 Prisma Client...');
try {
  // 设置环境变量
  process.env.DATABASE_URL = databaseUrl;
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl }
  });
  console.log('✅ Prisma Client 生成成功\n');
} catch (error) {
  console.log('❌ Prisma Client 生成失败');
  console.log('错误:', error);
  process.exit(1);
}

// 5. 验证数据库连接
console.log('🔍 正在验证数据库连接...');
try {
  execSync('npx prisma db pull --force', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl }
  });
  console.log('✅ 数据库连接验证成功\n');
} catch (error) {
  console.log('⚠️  数据库连接验证失败');
  console.log('请检查 DATABASE_URL 是否正确\n');
  process.exit(1);
}

// 6. 检查表结构
console.log('📊 检查数据库表结构...');
try {
  const result = execSync('npx prisma db pull --print', { 
    encoding: 'utf-8',
    env: { ...process.env, DATABASE_URL: databaseUrl }
  });
  
  const tables = [
    'users',
    'accounts', 
    'sessions',
    'verification_tokens',
    'echos',
    'echo_images',
    'interview_answers'
  ];
  
  const foundTables = tables.filter(table => result.includes(`model ${table}`));
  console.log(`✅ 找到 ${foundTables.length}/${tables.length} 个表`);
  
  if (foundTables.length === tables.length) {
    console.log('✅ 所有表结构正确\n');
  } else {
    console.log('⚠️  部分表可能缺失\n');
  }
} catch (error) {
  console.log('⚠️  无法检查表结构\n');
}

console.log('🎉 配置完成！');
console.log('\n下一步：');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 测试登录功能');
console.log('3. 测试 Echo 生成和保存功能\n');

