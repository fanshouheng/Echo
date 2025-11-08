/**
 * NextAuth Configuration
 * 用户认证配置
 */

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

// 动态导入 GitHub 和 Google providers（如果配置了）
let GitHubProvider: any = null;
let GoogleProvider: any = null;

try {
  if (process.env.GITHUB_ID) {
    GitHubProvider = require("next-auth/providers/github").default;
  }
} catch {}

try {
  if (process.env.GOOGLE_CLIENT_ID) {
    GoogleProvider = require("next-auth/providers/google").default;
  }
} catch {}

export const authOptions = {
  // 注意：使用 CredentialsProvider + JWT 策略时不需要 adapter
  // 只有在使用 OAuth providers（GitHub/Google）时才需要 adapter
  // adapter: PrismaAdapter(prisma) as any,
  providers: [
    // 用户名密码登录
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("请输入邮箱和密码");
          }

          const user = await prisma.users.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) {
            throw new Error("邮箱或密码错误");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("邮箱或密码错误");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
    // GitHub 登录（可选）
    ...(GitHubProvider && process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    // Google 登录（可选）
    ...(GoogleProvider && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const, // 使用 JWT 策略，更适合 serverless
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
