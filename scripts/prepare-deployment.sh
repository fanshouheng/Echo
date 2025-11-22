#!/usr/bin/env bash

# Echo AI Project - Netlify Deployment Preparation Script
# 作者: Echo Project Team
# 版本: 1.0.0

set -e

echo "🚀 Echo AI - Netlify 部署准备脚本"
echo "=================================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 未安装，请先安装 $1${NC}"
        exit 1
    fi
}

check_file() {
    if [ ! -f "$1" ]; then
        echo -e "${RED}❌ 文件不存在: $1${NC}"
        exit 1
    fi
}

check_dir() {
    if [ ! -d "$1" ]; then
        echo -e "${RED}❌ 目录不存在: $1${NC}"
        exit 1
    fi
}

# 1. 环境检查
echo -e "${YELLOW}📋 1. 环境检查${NC}"
check_command "node"
check_command "npm"
check_command "git"

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo "✅ Git 版本: $(git --version)"

# 2. 项目文件检查
echo -e "${YELLOW}📁 2. 项目文件检查${NC}"
check_file "package.json"
check_file "next.config.ts"
check_file "netlify.toml"
check_file "src/pages/api/image/index.ts" || check_file "src/app/api/image/route.ts"
check_file ".env.local.example"

if [ -d "netlify/functions" ]; then
    echo "✅ Netlify Functions 目录存在"
else
    echo -e "${RED}❌ Netlify Functions 目录不存在${NC}"
    exit 1
fi

# 3. 环境变量检查
echo -e "${YELLOW}⚙️ 3. 环境变量检查${NC}"
if [ -f ".env.local" ]; then
    echo "✅ .env.local 文件存在"

    # 检查必需的环境变量
    required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
        "DEEPSEEK_API_KEY"
        "DOUBAO_API_KEY"
        "EMAIL_SERVER_HOST"
        "EMAIL_SERVER_PORT"
        "EMAIL_SERVER_USER"
        "EMAIL_SERVER_PASSWORD"
        "EMAIL_FROM"
    )

    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env.local; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo "✅ 所有必需的环境变量都已配置"
    else
        echo -e "${RED}❌ 缺少以下环境变量:${NC}"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo -e "${YELLOW}💡 提示: 复制 .env.local.example 到 .env.local 并填入你的配置${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  .env.local 文件不存在，正在创建示例文件...${NC}"
    cp .env.local.example .env.local
    echo "✅ 已创建 .env.local 文件，请根据需要配置环境变量"
fi

# 4. 依赖检查
echo -e "${YELLOW}📦 4. 依赖检查${NC}"
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 5. 数据库检查
echo -e "${YELLOW}🗄️ 5. 数据库检查${NC}"
if grep -q "postgresql://" .env.local; then
    echo "✅ 数据库 URL 已配置"
else
    echo -e "${YELLOW}⚠️  数据库 URL 未正确配置${NC}"
    echo "💡 推荐使用 Supabase 获取 PostgreSQL 连接字符串"
fi

# 6. 构建测试
echo -e "${YELLOW}🔨 6. 构建测试${NC}"
echo "正在运行构建测试..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo -e "${RED}❌ 构建失败，请检查错误并修复${NC}"
    exit 1
fi

# 7. 部署配置检查
echo -e "${YELLOW}⚙️ 7. 部署配置检查${NC}"

# 检查 netlify.toml 配置
if grep -q "NODE_VERSION.*20" netlify.toml; then
    echo "✅ Node.js 版本配置正确"
else
    echo -e "${RED}❌ Node.js 版本配置不正确${NC}"
fi

if grep -q "npm run build" netlify.toml; then
    echo "✅ 构建命令配置正确"
else
    echo -e "${RED}❌ 构建命令配置不正确${NC}"
fi

# 检查函数文件
if [ -f "netlify/functions/api-image.js" ]; then
    echo "✅ API 图像函数已配置"
else
    echo -e "${RED}❌ API 图像函数未找到${NC}"
fi

if [ -f "netlify/functions/auth.js" ]; then
    echo "✅ 认证函数已配置"
else
    echo -e "${RED}❌ 认证函数未找到${NC}"
fi

# 8. Git 状态检查
echo -e "${YELLOW}🌿 8. Git 状态检查${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
    echo "建议提交所有更改后再部署:"
    echo "  git add ."
    echo "  git commit -m 'Prepare for Netlify deployment'"
else
    echo "✅ 所有更改都已提交"
fi

# 9. 部署建议
echo -e "${YELLOW}🚀 9. 部署建议${NC}"
echo "部署前请确保："
echo "  1. 所有环境变量已在 Netlify 仪表板中设置"
echo "  2. 数据库已正确配置并允许外部连接"
echo "  3. API 密钥有效且有足够的配额"
echo "  4. 自定义域名（如果有）已正确配置"

echo ""
echo "部署步骤："
echo "  1. 推送代码到 GitHub: git push origin main"
echo "  2. 在 Netlify 仪表板中触发部署"
echo "  3. 或使用 Netlify CLI: netlify deploy --prod"

# 10. 总结
echo ""
echo -e "${GREEN}🎉 部署准备完成！${NC}"
echo "=================================="
echo "项目已准备好部署到 Netlify"
echo ""
echo "📖 详细部署说明请查看: NETLIFY_DEPLOYMENT.md"
echo "🆘 遇到问题？查看故障排除部分或联系支持"

# 可选：自动部署到 Netlify
if command -v netlify &> /dev/null; then
    echo ""
    read -p "是否要立即部署到 Netlify？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 开始部署..."
        netlify deploy --prod
    fi
fi