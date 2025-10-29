# 🔧 快速修复 503 错误

## 立即诊断

### 步骤 1: 打开测试页面

在浏览器访问：
```
http://localhost:3000/test-api
```

点击 **"开始测试"** 按钮。

---

### 步骤 2: 查看测试结果

测试页面会显示：
- ✅ 环境配置状态
- ✅ API 连接状态
- ✅ 实际 API 调用结果
- ⚠️ 详细错误信息和故障排除建议

---

### 步骤 3: 查看详细日志

#### 浏览器控制台 (F12 → Console)
会显示：
```
=== Generate Personality API Called ===
Using DeepSeek API with model: deepseek-chat
API Key configured: Yes (length: 48)
```

#### 终端/命令行
会显示更详细的错误：
```
API 尝试 1/3 失败:
Error status: 503
⚠️ API 服务暂时不可用 (503)
```

---

## 🎯 根据测试结果操作

### 情况 A: API Key 无效 (401)

**解决方案：**
1. 访问 https://platform.deepseek.com/
2. 重新生成 API Key
3. 更新 `.env.local`:
```env
DEEPSEEK_API_KEY=sk-你的新key
```
4. 重启服务器: `npm run dev`

---

### 情况 B: 服务不可用 (503)

**原因可能是：**
- DeepSeek 服务器过载
- API 额度用完
- 区域限制

**解决方案 1: 等待重试**
稍等 5-10 分钟后再试

**解决方案 2: 切换到 OpenAI** ⭐ 推荐

1. **编辑 `.env.local`:**
```env
# 注释掉 DeepSeek
# DEEPSEEK_API_KEY=sk-...

# 使用 OpenAI
OPENAI_API_KEY=sk-proj-你的OpenAI-key

# Gemini 保持不变
GOOGLE_GEMINI_API_KEY=AIzaSyCmmKpY0xwXVrF6A96Hsq6ku4ecXeGxNUU
```

2. **获取 OpenAI Key:**
   - 访问 https://platform.openai.com/api-keys
   - 创建新 Key
   - 充值至少 $5

3. **重启服务器:**
```bash
npm run dev
```

4. **刷新测试页面验证:**
```
http://localhost:3000/test-api
```

---

### 情况 C: 速率限制 (429)

**解决方案：**
- 等待 1 分钟
- 检查 API 使用配额
- 升级 API 套餐

---

## ✅ 验证修复成功

修复后：

1. **访问测试页面:**
```
http://localhost:3000/test-api
```

2. **看到绿色的 ✓ 测试通过**

3. **返回主应用测试完整流程:**
```
http://localhost:3000
```

---

## 💰 成本对比

如果切换到 OpenAI：

| 方案 | 人格生成 | 图像生成 | 总计/Echo |
|------|---------|---------|-----------|
| **DeepSeek + Gemini** | ¥0.01 | ¥0.21 | **¥0.22** |
| **OpenAI + Gemini** | ¥0.14 | ¥0.21 | **¥0.35** |

*OpenAI 贵一些，但更稳定*

---

## 🆘 仍然失败？

如果测试页面仍然显示失败：

1. **复制完整的测试结果 JSON**
2. **截图终端错误日志**
3. **告诉我：**
   - 使用的是 DeepSeek 还是 OpenAI？
   - API Key 长度是多少？
   - 完整的错误状态码和消息

---

## 🎉 测试页面功能

你刚创建的 `/test-api` 页面可以：

- ✅ 自动检测环境配置
- ✅ 测试 API 连接
- ✅ 显示详细诊断信息
- ✅ 提供针对性的故障排除建议
- ✅ 实时显示测试结果

**现在就去试试！** → http://localhost:3000/test-api

