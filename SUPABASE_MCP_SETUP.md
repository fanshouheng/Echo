# Supabase MCP 连接指南

## 📋 概述

Supabase MCP (Model Context Protocol) 允许 AI 工具（如 Cursor）直接连接到你的 Supabase 项目，让 AI 助手可以查询数据库、管理项目等。

## 🚀 快速连接（推荐）

### 方法 1：一键安装（最简单）

1. 访问 [Supabase MCP 文档](https://supabase.com/docs/guides/getting-started/mcp)
2. 选择你的项目
3. 点击 "Add to Cursor" 按钮
4. 会自动配置并打开浏览器进行认证

### 方法 2：手动配置

1. **创建配置文件**
   
   配置文件已创建在 `.cursor/mcp.json`：
   ```json
   {
     "mcpServers": {
       "supabase": {
         "url": "https://mcp.supabase.com/mcp"
       }
     }
   }
   ```

2. **重启 Cursor**
   
   保存配置文件后，重启 Cursor 让配置生效。

3. **认证**
   
   - Cursor 会自动打开浏览器窗口
   - 登录你的 Supabase 账号
   - 授权组织访问权限
   - 完成认证后，MCP 连接就建立好了

## 🔒 安全最佳实践

根据 Supabase 官方建议：

### ⚠️ 重要安全提示

1. **不要连接到生产环境**
   - MCP 服务器仅用于开发和测试
   - 使用开发项目，不要连接生产数据库
   - 确保开发环境使用非生产数据（或脱敏数据）

2. **不要给客户使用**
   - MCP 服务器运行在你的开发者权限下
   - 仅作为内部开发工具使用
   - 不要给客户或最终用户使用

3. **启用只读模式**（如果必须连接真实数据）
   - 设置服务器为只读模式
   - 所有查询以只读 Postgres 用户执行

4. **项目范围限制**
   - 将 MCP 服务器限制到特定项目
   - 防止访问其他项目的数据

5. **手动批准工具调用**
   - 在 Cursor 中保持手动批准设置启用
   - 在执行前始终审查工具调用的详细信息

## 🎯 使用场景

连接成功后，你可以：

- **查询数据库**：用自然语言查询数据库
- **管理项目**：查看和管理 Supabase 项目
- **生成代码**：基于数据库结构生成代码
- **调试问题**：让 AI 帮助调试数据库相关问题

## 📝 配置选项

### 限制到特定项目

如果你想限制 MCP 只能访问特定项目，可以在 URL 中添加项目引用：

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"
    }
  }
}
```

### 只读模式

如果你需要只读访问，可以在配置中添加：

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp",
      "readOnly": true
    }
  }
}
```

## 🔧 CI 环境配置（高级）

如果你在 CI 环境中使用，需要手动认证：

1. 创建 Personal Access Token (PAT)
   - 访问 [Supabase Access Tokens](https://supabase.com/dashboard/account/tokens)
   - 生成新 token，命名为 "CI MCP token"

2. 配置环境变量
   ```bash
   SUPABASE_ACCESS_TOKEN=your_token_here
   SUPABASE_PROJECT_REF=your_project_ref
   ```

3. 更新配置
   ```json
   {
     "mcpServers": {
       "supabase": {
         "type": "http",
         "url": "https://mcp.supabase.com/mcp?project_ref=${SUPABASE_PROJECT_REF}",
         "headers": {
           "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
         }
       }
     }
   }
   ```

## ✅ 验证连接

连接成功后，你可以尝试：

1. 在 Cursor 中询问："查询我的数据库表"
2. 或者："显示我的 Supabase 项目信息"
3. AI 应该能够访问你的 Supabase 项目

## 📚 参考文档

- [Supabase MCP 官方文档](https://supabase.com/docs/guides/getting-started/mcp)
- [Cursor MCP 文档](https://docs.cursor.com/mcp)

## 🆘 常见问题

**Q: 连接失败怎么办？**
A: 检查配置文件格式是否正确，确保已重启 Cursor，检查网络连接。

**Q: 如何撤销授权？**
A: 访问 Supabase 账号设置，撤销对 MCP 客户端的授权。

**Q: 可以同时连接多个项目吗？**
A: 可以，但建议限制到特定项目以确保安全。



