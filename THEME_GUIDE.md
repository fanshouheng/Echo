# Echo 主题系统指南

## 🎨 配色方案

### 深色模式（Dark Mode）
- **背景**: `#0A0A0A` - 深黑
- **卡片**: `#1F1F1F` - 深灰
- **文字**: `#FFFFFF` - 纯白
- **主色**: `#00BFFF` - 明亮青色
- **边框**: `#4D4D4D` - 中灰

### 浅色模式（Light Mode）
- **背景**: `#FAFAFA` - 接近纯白
- **卡片**: `#FFFFFF` - 纯白
- **文字**: `#262626` - 深黑
- **主色**: `#00BFFF` - 明亮青色（保持一致）
- **边框**: `#E6E6E6` - 浅灰

## 🔄 主题切换

### 使用 ThemeToggle 组件

```tsx
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// 在页面中使用
<ThemeToggle size="md" />
```

### 使用 useTheme Hook

```tsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      当前主题: {theme}
    </button>
  );
}
```

## 📦 组件说明

### ThemeToggle
- **位置**: `src/components/theme/ThemeToggle.tsx`
- **功能**: 显示太阳/月亮图标，点击切换主题
- **Props**:
  - `size`: `"sm" | "md" | "lg"` - 按钮尺寸
  - `className`: 自定义样式

### ThemeProvider
- **位置**: `src/components/theme/ThemeProvider.tsx`
- **功能**: 初始化主题，防止闪烁
- **使用**: 已在 `layout.tsx` 中使用

### useTheme Hook
- **位置**: `src/hooks/useTheme.ts`
- **返回值**:
  - `theme`: 当前主题 (`"light" | "dark"`)
  - `toggleTheme()`: 切换主题
  - `setTheme(theme)`: 设置主题
  - `mounted`: 是否已挂载（用于防止闪烁）

## 💾 持久化

主题偏好会自动保存到 `localStorage` 的 `theme` 键：
- 刷新页面后保持用户选择
- 如果没有保存的主题，会检测系统偏好（`prefers-color-scheme`）

## 🎯 设计原则

1. **一致性**: 深色和浅色模式都使用相同的青色作为主色
2. **对比度**: 确保文字和背景有足够的对比度
3. **平滑过渡**: 使用 CSS transition 实现平滑切换
4. **无闪烁**: 使用 Script 在 React 渲染前初始化主题

## 📱 响应式

主题切换在所有设备上都可用：
- 桌面端：右上角切换按钮
- 移动端：可添加到导航栏或设置菜单

## 🔧 自定义

如需调整颜色，编辑 `src/app/globals.css`：
- `:root` - 浅色模式变量
- `.dark` - 深色模式变量

