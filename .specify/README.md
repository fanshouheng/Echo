# Echo Project Specification System

这个目录包含了 Echo 项目的规范化管理系统，确保所有开发工作符合项目宪法（Constitution）规定的核心原则。

---

## 📁 目录结构

```
.specify/
├── README.md                          # 本文件
├── memory/
│   └── constitution.md                # 项目宪法 - 核心原则与治理框架
└── templates/
    ├── plan-template.md               # 项目计划模板
    ├── spec-template.md               # 技术规范模板
    ├── tasks-template.md              # 任务列表模板
    └── commands/
        └── (Cursor AI 命令文件)
```

---

## 🏛️ 宪法（Constitution）

**文件位置：** `.specify/memory/constitution.md`

### 什么是项目宪法？

项目宪法定义了 Echo 的 **7 大核心原则**，所有设计决策、技术实现、功能添加都必须符合这些原则：

1. **Generation-First, Not Conversation** - Echo 是创作工具，不是聊天机器人
2. **Emotional Authenticity Through Deep Understanding** - 深度情感理解与真实人格生成
3. **Visual and Aesthetic Excellence** - 视觉与美学卓越
4. **Privacy, Security, and Ethical Data Handling** - 隐私安全与伦理数据处理
5. **Performance and Reliability** - 性能与可靠性
6. **Simplicity and Focus** - 简洁与专注
7. **Cultural and Linguistic Appropriateness** - 文化与语言适配性

### 何时查阅宪法？

- ✅ **开始新功能开发前** - 确保功能符合核心原则
- ✅ **设计决策时** - 当有多个方案时，选择最符合原则的方案
- ✅ **代码审查时** - 检查是否违反任何原则
- ✅ **发布前** - 最终合规性检查

### 如何修改宪法？

1. 提出修改提案（说明原因与影响）
2. 评审对齐度与可行性
3. 由项目负责人决策通过
4. 更新版本号（遵循语义化版本控制）
5. 更新 Sync Impact Report

---

## 📋 模板系统

### 1. 项目计划模板（Plan Template）

**用途：** 规划新功能或重要改进

**何时使用：**
- 开始开发一个新的主要功能
- 规划技术架构变更
- 制定发布计划

**包含内容：**
- 宪法合规性检查清单
- 目标与成功标准
- 范围定义（In/Out of Scope）
- 时间线与里程碑
- 技术方案
- 风险评估
- 测试策略

**示例：**
```
.specify/plans/interview-system-plan.md
.specify/plans/image-generation-plan.md
```

---

### 2. 技术规范模板（Spec Template）

**用途：** 详细的技术实现文档

**何时使用：**
- 实现复杂组件或功能
- 定义 API 接口
- 设计数据模型
- 集成第三方服务

**包含内容：**
- 宪法对齐声明
- 功能与非功能需求
- 系统设计与架构
- 数据模型
- API 规范
- 错误处理
- 测试计划
- 安全考量
- 部署方案

**示例：**
```
.specify/specs/personality-generation-api-spec.md
.specify/specs/image-generation-service-spec.md
```

---

### 3. 任务列表模板（Tasks Template）

**用途：** 跟踪开发任务进度

**何时使用：**
- 规划 Sprint 或开发周期
- 日常任务管理
- 团队协作时分配任务

**包含内容：**
- 按宪法原则分类的任务
- 任务优先级（P0/P1/P2）
- 时间估算与状态
- 验收标准
- 进度追踪
- 阻塞问题
- 每日站会记录

**特色：**
任务按 7 大原则分类，确保均衡发展：
- 🎨 Generation-First Tasks
- 💭 Emotional Authenticity Tasks
- 🎭 Visual Excellence Tasks
- 🔒 Privacy & Security Tasks
- ⚡ Performance & Reliability Tasks
- 🎯 Simplicity & Focus Tasks
- 🌏 Cultural Appropriateness Tasks

**示例：**
```
.specify/tasks/week-1-mvp-tasks.md
.specify/tasks/sprint-2-tasks.md
```

---

## 🚀 使用工作流

### 典型开发流程

```
1. 新功能构思
   ↓
2. 查阅宪法 - 确认是否符合原则
   ↓
3. 创建项目计划（使用 plan-template.md）
   ├─ 填写宪法合规性检查
   ├─ 定义目标与范围
   └─ 制定时间线
   ↓
4. 编写技术规范（使用 spec-template.md）
   ├─ 详细设计
   ├─ API 定义
   └─ 测试计划
   ↓
5. 拆解任务（使用 tasks-template.md）
   ├─ 按原则分类任务
   ├─ 设置优先级
   └─ 分配负责人
   ↓
6. 执行开发
   ├─ 每日更新任务状态
   └─ 遇到决策点参考宪法
   ↓
7. 代码审查
   └─ 验证宪法合规性
   ↓
8. 发布前检查
   └─ 完整的宪法符合性审查
```

---

## 📊 宪法合规性检查清单

在提交代码或发布功能前，使用此清单：

### Principle 1: Generation-First
- [ ] 没有引入聊天/对话功能
- [ ] 所有交互都产生可分享的成果物
- [ ] 用户流程明确结束于创作完成

### Principle 2: Emotional Authenticity
- [ ] 访谈问题具有心理学意义
- [ ] 生成的人格描述具体、独特（非模板化）
- [ ] Prompt 工程经过测试和优化

### Principle 3: Visual Excellence
- [ ] 遵循设计系统（PRD 第9节）
- [ ] 移动端响应式设计测试通过
- [ ] 加载状态和动画流畅
- [ ] 分享卡片视觉吸引力强

### Principle 4: Privacy & Security
- [ ] 用户数据加密存储和传输
- [ ] 隐私政策已显示
- [ ] 用户可删除自己的数据
- [ ] API 密钥使用环境变量
- [ ] 内容审核机制就绪

### Principle 5: Performance & Reliability
- [ ] 人格生成 < 30秒
- [ ] 图像生成 < 60秒
- [ ] 实现重试逻辑（最多3次）
- [ ] 错误提示友好（中文，共情式）
- [ ] 性能监控配置完成

### Principle 6: Simplicity & Focus
- [ ] 功能直接服务于生成流程或分享能力
- [ ] 未引入不必要的复杂性
- [ ] 代码可维护性良好
- [ ] MVP 范围未扩展

### Principle 7: Cultural Appropriateness
- [ ] 所有文案使用自然中文
- [ ] 访谈问题经过文化审查
- [ ] 生成内容符合中文文化语境
- [ ] 分享格式适配微信/Soul

---

## 🔄 版本控制

### 宪法版本控制

- **MAJOR (X.0.0):** 删除或根本性重新定义现有原则
- **MINOR (0.X.0):** 新增原则或显著扩展现有原则
- **PATCH (0.0.X):** 澄清、措辞改进、非语义变更

### 当前版本

**Constitution Version:** 1.0.0  
**Ratified:** 2025-10-24

---

## 📝 最佳实践

### 文档命名规范

```
计划文档：    [feature-name]-plan.md
技术规范：    [component-name]-spec.md
任务列表：    [sprint-name]-tasks.md 或 week-[N]-tasks.md
```

### 文档存放位置建议

```
.specify/
├── memory/
│   └── constitution.md
├── plans/
│   ├── mvp-plan.md
│   └── v1.1-plan.md
├── specs/
│   ├── interview-api-spec.md
│   └── image-generation-spec.md
└── tasks/
    ├── week-1-tasks.md
    └── week-2-tasks.md
```

### 更新频率建议

- **宪法：** 仅在必要时修改（重大决策变更）
- **计划：** 每个主要功能一份
- **规范：** 每个复杂组件一份，实现完成后归档
- **任务：** 每周或每个 Sprint 更新

---

## 🤝 协作指南

### 单人开发

1. 使用模板保持开发结构化
2. 重大决策前查阅宪法
3. 定期更新任务列表追踪进度

### 团队协作

1. 新成员先阅读宪法
2. 计划和规范共同评审
3. 任务列表用于分配与同步
4. 每日更新任务状态
5. 代码审查时检查宪法合规性

---

## 🆘 常见问题

**Q: 如果两个原则冲突怎么办？**  
A: 参考宪法第 "Conflict Resolution" 部分。优先考虑 Principle 1（Generation-First）和 Principle 4（Privacy），记录冲突和解决方案。

**Q: 必须使用所有模板吗？**  
A: MVP 阶段可简化。建议至少使用任务列表模板追踪进度，并在重要决策点参考宪法。

**Q: 如何提议新原则？**  
A: 遵循宪法中的 "Amendment Process"，记录提议、影响分析，由项目负责人审批。

**Q: 模板太复杂怎么办？**  
A: 模板是指南非强制。可以只填写关键部分，删除不相关的章节。重点是思考过程，而非表格填写。

---

## 📚 相关文档

- [项目宪法](./memory/constitution.md)
- [PRD - 产品需求文档](../PRD.md)
- [参赛文档](../参赛文档.md)

---

**维护者：** Echo Project Team  
**最后更新：** 2025-10-24

