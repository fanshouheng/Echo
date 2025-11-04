/**
 * Regenerate Page
 * Allow users to regenerate personality or images
 */

export default function RegeneratePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card p-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Echo 唯一性声明</h1>
        <p className="text-muted-foreground leading-relaxed">
          每一次访谈都会诞生独一无二的 Echo。为了保持人格档案的完整性与故事延续，访谈提交后不再支持重新生成人格或替换初始形象。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          未来若推出场景或装扮的扩展玩法，我们会第一时间在此同步，感谢你的理解与珍藏。
        </p>
      </div>
    </div>
  );
}

