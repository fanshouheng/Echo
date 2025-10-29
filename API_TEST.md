# API 连接测试指南

## 🔍 诊断 503 错误

你遇到的 **503 错误**通常表示以下情况之一：

### 可能原因

1. **DeepSeek API 服务不可用**
   - DeepSeek 服务器暂时过载
   - 维护中
   - 区域限制

2. **API Key 问题**
   - API Key 无效
   - 额度已用完
   - Key 格式错误

3. **网络问题**
   - 本地网络连接问题
   - 防火墙阻止

---

## 📊 查看详细错误信息

现在刷新浏览器（F5），然后查看：

### 1. 浏览器控制台（F12 → Console）
会显示：
```
=== Generate Personality API Called ===
Request body received, answers count: 12
Using DeepSeek API with model: deepseek-chat
API Key configured: Yes (length: XX)
Calling DeepSeek API...
```

### 2. 终端/命令行窗口（运行 npm run dev 的地方）
会显示更详细的错误：
```
API 尝试 1/3 失败:
Error status: 503
⚠️ API 服务暂时不可用 (503)
可能原因：
1. DeepSeek API 服务器过载或维护中
2. API Key 额度已用完
3. 区域限制或网络问题
```

---

## 🔧 解决方案

### 方案 1: 验证 DeepSeek API Key

**检查 API Key 是否有效：**

1. 访问 https://platform.deepseek.com/
2. 登录账号
3. 进入 API Keys 页面
4. 检查：
   - [ ] Key 是否有效（未过期）
   - [ ] 是否有剩余额度
   - [ ] Key 的状态是否为"启用"

**重新获取 Key：**
如果 Key 有问题，创建新的 Key 并更新 `.env.local`：

```bash
# 停止开发服务器（Ctrl+C）
# 编辑 .env.local 文件，更新 DEEPSEEK_API_KEY
# 重新启动
npm run dev
```

---

### 方案 2: 切换到 OpenAI

如果 DeepSeek 持续不可用，可以暂时切换到 OpenAI：

**步骤：**

1. **编辑 `.env.local`**:
```env
# 注释掉 DeepSeek
# DEEPSEEK_API_KEY=sk-...

# 启用 OpenAI
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Gemini 保持不变
GOOGLE_GEMINI_API_KEY=AIzaSyCmmKpY0xwXVrF6A96Hsq6ku4ecXeGxNUU
```

2. **重启服务器**:
```bash
npm run dev
```

**获取 OpenAI API Key：**
- 访问 https://platform.openai.com/api-keys
- 创建新的 API Key
- 至少充值 $5

---

### 方案 3: 检查网络连接

**测试 DeepSeek API 连接：**

在终端/命令行运行：

```bash
curl https://api.deepseek.com/v1/models -H "Authorization: Bearer sk-f224e57f5c974f6fa702aafa0f6512a8"
```

**预期结果：**
- ✅ 如果返回 JSON 数据 → API 可用，问题可能在代码或配置
- ❌ 如果返回 503/timeout → DeepSeek 服务确实不可用

---

## 🧪 快速测试脚本

创建测试脚本验证 API：

**Windows PowerShell:**
```powershell
$headers = @{
    "Authorization" = "Bearer sk-f224e57f5c974f6fa702aafa0f6512a8"
    "Content-Type" = "application/json"
}

$body = @{
    model = "deepseek-chat"
    messages = @(
        @{
            role = "user"
            content = "Hello"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.deepseek.com/v1/chat/completions" -Method Post -Headers $headers -Body $body
```

---

## ✅ 验证修复

修复后，请：

1. **刷新浏览器**（F5）
2. **查看控制台和终端日志**
3. **完成访谈并生成人格**

如果成功，你会在终端看到：
```
=== Generate Personality API Called ===
Using DeepSeek API with model: deepseek-chat
API Key configured: Yes (length: 48)
Calling DeepSeek API...
API call successful, personality generated: [名字]
```

---

## 📞 需要帮助？

如果上述方案都不行，请提供：

1. **浏览器控制台的完整错误日志**
2. **终端的完整错误输出**
3. **你的 `.env.local` 配置**（隐藏 API Key 的后半部分）

示例：
```
Using DeepSeek API with model: deepseek-chat
API Key configured: Yes (length: 48)
Error status: 503
Error message: Service Unavailable
```

---

## 🔄 临时绕过方案

如果你想先测试其他功能，可以：

1. **跳过人格生成**：直接在代码中硬编码一个测试人格
2. **只测试图像生成**：Gemini Imagen 是独立的

**临时测试用人格（可以硬编码）：**
```typescript
const testPersonality = {
  name: "星河",
  tagline: "在沉默中读懂你的声音",
  keywords: ["共情型", "理性", "温柔坚定", "深邃"],
  communicationStyle: "擅用比喻和隐喻，不急于给建议...",
  values: "理解比喜欢更重要...",
  whyMatch: "你需要的不是热烈的回应，而是深刻的懂得...",
  uniqueTraits: "喜欢在深夜发长消息..."
};
```

---

**现在请按照方案 1 检查你的 DeepSeek API Key！** 🔍

