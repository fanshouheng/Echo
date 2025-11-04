/**
 * About Echo Page
 * 说明 Echo 的理念、科学依据与形象生成方式
 */

export default function AboutPage() {
  const sections = [
    {
      title: "Echo 是独一无二的",
      content: [
        "每一次访谈都基于你的真实回答生成一个全新的 Echo 档案。",
        "人格分析、生活细节、形象提示都会与你的回答绑定并长期保留。",
        "生成完成后不再提供重置或回溯，确保每个 Echo 都是独特且不可复制的记忆。",
      ],
    },
    {
      title: "科学依据",
      content: [
        "访谈题目围绕 Big Five 人格模型、依恋理论与关系心理学设计。",
        "人格生成使用大型语言模型推理能力，结合心理学框架输出结构化档案。",
        "系统会自动识别你的生活节奏、情感需求与沟通风格，反馈到 Echo 的性格设定中。",
      ],
    },
    {
      title: "形象生成逻辑",
      content: [
        "初次生成形象与人格档案同步完成，记录在案不会被覆盖。",
        "视觉提示词由 Echo 档案中的 visualProfile 字段驱动，包含年龄区间、职业、场景与氛围。",
        "后续在档案页生成的其他场景，会以首张形象为基准，仅调整环境与装扮，保留 Echo 的核心特征。",
      ],
    },
    {
      title: "未来的拓展",
      content: [
        "Echo 将持续迭代，我们正在规划动态影像、语音故事、场景换装等衍生体验。",
        "所有扩展都会以首个 Echo 档案为核心，追加内容而非替换原始人格与形象。",
        "我们会在保证隐私与一致性的前提下，设计更多互动玩法，让 Echo 成为一份长期陪伴的数字记忆。",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-foreground">关于 Echo</h1>
          <p className="text-muted-foreground text-lg">
            Echo 是一份与你共鸣的档案。下面的说明帮助你理解我们如何构建这份独一无二的体验。
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-border/60 bg-background/70 backdrop-blur p-8 shadow-lg shadow-background/20"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                {section.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-6 border-t border-border/40">
          <p>Echo 会持续迭代，我们会在此页面同步重要更新。</p>
        </footer>
      </div>
    </div>
  );
}
