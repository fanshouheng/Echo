# Echo：AI灵魂共鸣体生成器

> **"Echo，不是回荡的声音，而是你灵魂的回应。"**

![Version](https://img.shields.io/badge/version-0.1.0--mvp-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 🎯 项目简介

**Echo** 是一个基于大语言模型与多模态生成技术的 **AI灵魂共鸣体生成器**。通过深度情感访谈，帮助用户探索自我、具象化理想共鸣者，并生成包含文字、图像的数字人格作品。

### ⚠️ 重要说明

**Echo 不是聊天机器人！**

- ✅ 一次性深度体验（15-20分钟，25题专业问卷）
- ✅ 基于 Big Five 人格理论的科学分析
- ✅ 输出可分享的数字艺术作品（文字+图像）
- ✅ 帮助自我认知与情感探索
- ✅ 文艺与生活气息并存的人格描述
- ❌ 不提供持续对话功能

---

## 🚀 快速开始

### 前置要求

- Node.js 20.x 或更高版本
- npm 或 pnpm
- OpenAI API Key 或 Anthropic API Key
- Replicate API Token

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/echo.git
cd echo

# 安装依赖
npm install

# 复制环境变量模板
cp .env.local.example .env.local

# 编辑 .env.local 添加你的 API keys
# OPENAI_API_KEY=sk-...
# REPLICATE_API_TOKEN=r8_...
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

### 构建

```bash
# 生产构建
npm run build

# 启动生产服务器
npm start
```

---

## 📁 项目结构

```
echo/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── interview/              # 访谈页面
│   │   ├── generate/               # 生成页面
│   │   ├── profile/[id]/           # Echo档案页面
│   │   └── api/                    # API路由
│   ├── components/                 # React组件
│   │   ├── ui/                     # shadcn/ui基础组件
│   │   ├── interview/              # 访谈相关组件
│   │   ├── generation/             # 生成加载组件
│   │   ├── profile/                # 档案展示组件
│   │   └── share/                  # 分享组件
│   ├── lib/                        # 工具函数
│   │   ├── api/                    # API客户端
│   │   ├── prompts/                # LLM prompts
│   │   ├── validators/             # 数据验证
│   │   └── animations.ts           # Framer Motion配置
│   ├── store/                      # Zustand状态管理
│   ├── types/                      # TypeScript类型定义
│   └── data/                       # 静态数据（问题库）
├── public/                         # 静态资源
├── .specify/                       # 项目规范文档
└── package.json
```

---

## 🧠 人格系统（Big Five理论）

### 核心特性

Echo采用**Big Five人格理论**（五大人格特质模型），这是心理学领域最科学、最权威的人格评估框架。

#### 五大维度（1-10分量化）
- **开放性 (Openness)** - 创造力、好奇心、对新事物的接受度
- **尽责性 (Conscientiousness)** - 自律、计划性、可靠性
- **外向性 (Extraversion)** - 社交活力、表达欲、人际能量
- **宜人性 (Agreeableness)** - 同理心、合作性、信任度
- **神经质 (Neuroticism)** - 情绪稳定性（低分=稳定）

### 25题专业问卷

#### 问卷结构
| 分类 | 题数 | 内容 |
|------|------|------|
| 生活作息与习惯 | 4题 | 作息时间、房间整洁、饮食习惯等 |
| 社交模式 | 3题 | 社交能量、朋友圈、问题处理方式 |
| 决策与计划 | 3题 | 做计划风格、拖延症、旅行准备 |
| 情绪与压力 | 3题 | 压力应对、情绪调节、批评反应 |
| 开放性与好奇心 | 2题 | 尝试新事物、兴趣爱好类型 |
| 沟通风格 | 3题 | 回消息习惯、冲突处理 |
| 价值观与关系 | 3题 | 相处模式、关系看重点 |
| 开放式问题 | 3题 | 理想周末、开心小事 |

### 生成内容（丰富细节）

生成的人格档案包含：

#### 1. 基础信息
- 名字、昵称、年龄感、整体氛围

#### 2. 生活细节（6大类）
- 作息习惯、社交模式、决策风格
- 情绪管理、兴趣爱好、日常小习惯

#### 3. 行为场景（5个具体场景）
- 早晨开启一天的方式
- 晚上结束一天的仪式
- 典型的周末活动
- 压力大时会做什么
- 开心时的表现

#### 4. 相处画面（4个互动场景）
- 日常聊天时的样子
- 你难过时TA会怎么做
- 你开心时TA会怎么做
- 一起度过周末的画面

#### 5. 匹配原因（3个维度）
- 生活方式契合点
- 情感需求契合点
- 价值观契合点

#### 6. 独特细节
- 口头禅、小癖好
- 最喜欢的时间段
- 治愈食物

### 输出风格：文艺+生活并存

**避免空洞诗意：**
- ❌ "如星河般深邃"
- ❌ "灵魂的共鸣"

**提倡有细节的文艺：**
- ✅ "会在深夜给你发长消息，像是把白天攒下的话，在月光下慢慢说给你听"
- ✅ "你难过时，TA会安静坐在你旁边，偶尔递个纸巾，像递一份无声的理解"

---

## 🛠️ 技术栈

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State:** Zustand
- **Animation:** Framer Motion
- **AI:**
  - DeepSeek-Chat (人格生成，推荐) / OpenAI GPT-4o (备用)
  - **Pollinations AI (图像生成，免费推荐)** 🆓
  - Google Gemini Imagen 4 (图像生成备用) / Replicate Flux/SDXL (备用)
- **Validation:** Zod
- **HTTP:** Axios

---

## 🎨 设计系统

### 色彩

```css
/* 主色调 - 神秘紫 */
--primary: #8B7FFF;

/* 辅助色 */
--secondary: #FF9ECD;  /* 温柔粉 */
--accent: #4ECDC4;      /* 清新青 */

/* 背景 */
--background: #0F0F1E;  /* 深邃背景 */
--surface: #1A1A2E;     /* 卡片背景 */
```

### 字体

- **中文:** PingFang SC, Microsoft YaHei, 思源黑体
- **英文:** Geist Sans
- **代码:** Geist Mono

---

## 📋 功能特性

### ✅ 已完成 (Phase 1-6, 75% MVP)

- [x] **Phase 1-2:** 项目初始化 + API 集成基础
- [x] **Phase 3:** 灵魂访谈流程（25题专业问卷，基于Big Five理论）⭐ NEW
- [x] **Phase 4:** AI人格生成（DeepSeek-Chat + 专业Prompt）⭐ UPGRADED
  - ✨ 新增：Big Five 五维人格分数
  - ✨ 新增：6大生活细节分析
  - ✨ 新增：5个典型行为场景
  - ✨ 新增：4个相处互动画面
  - ✨ 风格：文艺与生活气息并存
- [x] **Phase 5:** 视觉形象生成（Pollinations AI免费 + Gemini/Flux备用）⭐ UPGRADED
- [x] **Phase 6:** Echo档案展示（完整人格档案页面）
- [x] 响应式设计（移动端 + 桌面端）
- [x] 状态持久化（自动保存访谈和生成结果）
- [x] 深色模式优化

### 🚧 开发中 (Phase 7-9, 剩余 25% MVP)

- [ ] **Phase 7:** 分享功能（生成分享卡片和导出）
- [ ] **Phase 8:** 重新生成（人格和图像微调）
- [ ] **Phase 9:** 性能优化和部署准备

### 📅 未来计划 (v0.2.0+)

- [ ] 视频生成（将静态形象转为动态视频）
- [ ] 用户认证系统
- [ ] 历史记录管理
- [ ] Echo社区画廊

---

## 🏛️ 项目宪法

Echo 遵循 7 大核心原则（详见 `.specify/memory/constitution.md`）：

1. **🎨 Generation-First** - 生成优先，拒绝聊天
2. **💭 Emotional Authenticity** - 情感真实性
3. **🎭 Visual Excellence** - 视觉卓越
4. **🔒 Privacy & Security** - 隐私安全
5. **⚡ Performance** - 性能可靠
6. **🎯 Simplicity** - 简洁专注
7. **🌏 Cultural Appropriateness** - 文化适配

---

## 📝 开发文档

完整的开发文档位于 `.specify/` 目录：

- **[constitution.md](/.specify/memory/constitution.md)** - 项目宪法
- **[PRD.md](/PRD.md)** - 产品需求文档
- **[spec.md](/.specify/features/mvp/spec.md)** - 功能规范
- **[plan.md](/.specify/features/mvp/plan.md)** - 实施计划
- **[tasks.md](/.specify/features/mvp/tasks.md)** - 任务列表

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

**注意:** 所有贡献必须符合[项目宪法](/.specify/memory/constitution.md)的7大原则。

---

## 📄 许可证

本项目为 Soul AI 创新大赛参赛作品，版权归项目团队所有。

---

## 🙏 致谢

- Soul 平台提供的创新大赛机会
- OpenAI、Anthropic、Replicate 提供的 AI 能力
- 开源社区的优秀工具与框架

---

## 📞 联系方式

**项目团队:** Echo Project Team  
**参赛项目:** Soul AI 创新大赛

---

**开始你的灵魂探索之旅 →** [查看完整文档](/PRD.md)
