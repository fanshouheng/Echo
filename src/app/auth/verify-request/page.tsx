/**
 * Verify Request Page
 * NextAuth 邮箱验证请求页面（如果使用邮箱登录）
 */

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">检查您的邮箱</h1>
        <p className="text-muted-foreground">
          我们已向您的邮箱发送了登录链接，请查收。
        </p>
      </div>
    </div>
  );
}

