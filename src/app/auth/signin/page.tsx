/**
 * Sign In Page
 * 登录/注册页面
 */

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Github } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true: 登录, false: 注册
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "注册失败");
        return;
      }

      // 注册成功后自动登录
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("注册成功，但登录失败，请手动登录");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("github", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("GitHub 登录失败，请稍后重试");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">欢迎来到 Echo</CardTitle>
          <CardDescription>
            {isLogin ? "登录以保存和管理你的 Echo 档案" : "注册新账户"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 登录/注册表单 */}
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  昵称（可选）
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "请输入密码" : "至少6位"}
                required
                minLength={isLogin ? undefined : 6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLogin ? (
                <>
                  <Mail className="w-4 h-4" />
                  {isLoading ? "登录中..." : "登录"}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isLoading ? "注册中..." : "注册"}
                </>
              )}
            </Button>
          </form>

          {/* 切换登录/注册 */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setPassword("");
              }}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "还没有账户？立即注册" : "已有账户？立即登录"}
            </button>
          </div>

          {/* 分隔线 */}
          {process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    或
                  </span>
                </div>
              </div>

              {/* GitHub 登录 */}
              <Button
                onClick={handleGitHubSignIn}
                variant="outline"
                className="w-full gap-2"
                disabled={isLoading}
              >
                <Github className="w-4 h-4" />
                GitHub 登录
              </Button>
            </>
          )}

          {/* 提示 */}
          <p className="text-xs text-center text-muted-foreground">
            {isLogin 
              ? "登录即表示您同意我们的隐私政策和服务条款"
              : "注册即表示您同意我们的隐私政策和服务条款"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
