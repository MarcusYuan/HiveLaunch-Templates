# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **框架**: WXT (Next.js 驱动)
- **前端**: React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **状态**: Zustand
- **打包**: Chrome, Firefox, Edge, Safari, Opera

---

## 目录结构

### WXT 推荐结构 (Flat)

```
chrome-extension/
├── .output/                  # 构建产物
├── .wxt/                     # WXT 生成文件
├── assets/                   # CSS、图片等资源
├── components/               # UI 组件 (自动导入)
├── composables/              # Vue/React Composable (自动导入)
├── entrypoints/              # 扩展入口点
│   ├── popup/
│   │   ├── App.tsx
│   │   └── main.ts
│   ├── options/
│   │   ├── App.tsx
│   │   └── main.ts
│   ├── background/
│   │   └── main.ts
│   ├── content/
│   │   └── main.ts
│   └── devtools/
│       └── main.ts
├── hooks/                    # React Hooks (自动导入)
├── public/                   # 静态资源 (直接复制到输出)
├── utils/                    # 工具函数 (自动导入)
├── modules/                  # 本地 WXT 模块
├── wxt.config.ts             # WXT 配置
├── tsconfig.json
└── package.json.tmpl
```

### 使用 src/ 目录的结构

```
chrome-extension/
├── src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── entrypoints/
│   ├── hooks/
│   └── utils/
├── public/
├── wxt.config.ts
└── package.json.tmpl
```

在 `wxt.config.ts` 中启用:
```typescript
export default defineConfig({
  srcDir: 'src',
});
```

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `Popup.tsx`, `Options.tsx` |
| Hooks | camelCase + use | `useStorage.ts`, `useMessage.ts` |
| 工具 | camelCase | `chrome.ts`, `storage.ts` |
| 类型 | PascalCase | `Message.ts`, `Settings.ts` |

---

## WXT 基础

### 创建入口点

WXT 使用基于文件的入口点系统。manifest 会根据 `entrypoints/` 目录中的文件自动生成。

```typescript
// entry/popup/main.ts
import { defineApp } from 'wxt';

export default defineApp({
  main: () => {
    // 初始化逻辑
  },
});
```

### 入口点目录结构

- `entrypoints/popup/` - 弹出窗口
- `entrypoints/options/` - 设置页
- `entrypoints/background/` - Service Worker (后台脚本)
- `entrypoints/content/` - Content Script (内容脚本)
- `entrypoints/devtools/` - DevTools 面板
- `entrypoints/newtab/` - 新标签页
- `entrypoints/sidebar/` - 侧边栏

### 使用 Chrome API

```typescript
// 安全地使用 chrome API - 推荐方式
import { useChrome } from '@/composables/useChrome';

function MyComponent() {
  const { chrome } = useChrome();
  
  // 使用 chrome.bookmarks, chrome.storage 等
}
```

或直接使用 WXT 提供的 Storage API:

```typescript
import { useStorage } from '@vueuse/core';

const settings = useStorage('settings', {
  theme: 'system',
  notifications: true,
});

// 自动持久化
settings.value.theme = 'dark';
```

---

## 状态管理

### Zustand

```typescript
// stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

interface SettingsState extends Settings {
  setTheme: (theme: Settings['theme']) => void;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    { name: 'settings' }
  )
);
```

---

## 消息通信

### WXT 消息系统

WXT 提供了统一的消息通信 API，支持所有类型的脚本间通信。

```typescript
// 发送消息 (任意位置)
import { sendMessage } from 'wxt/utils';

const response = await sendMessage('get-data', { key: 'value' });

// 接收消息 (background 或其他脚本)
import { onMessage } from 'wxt/utils';

onMessage('get-message', (message, sender) => {
  return { data: 'response' };
});
```

### Content Script ↔ Background

```typescript
// Content Script
const port = chrome.runtime.connect({ name: 'content-script' });
port.postMessage({ type: 'PAGE_STATE', data: '...' });
port.onMessage.addListener((msg) => { ... });
```

### 长连接 (Long-lived Connections)

```typescript
// 建立长连接
const port = chrome.runtime.connect();

// 发送消息
port.postMessage({ type: 'REQUEST', data: '...' });

// 接收消息
port.onMessage.addListener((message) => {
  if (message.type === 'RESPONSE') {
    // 处理响应
  }
});
```

---

## 存储

### WXT Storage (@wxt-dev/storage)

WXT 提供了专门的存储模块，简化了跨脚本的数据共享。

```typescript
// 使用 @wxt-dev/storage
import { storage } from 'wxt/storage';

// 在任意入口点使用
await storage.set('settings.theme', 'dark');
const theme = await storage.get('settings.theme');

// 使用 VueUse (推荐用于 UI 组件)
import { useStorage } from '@vueuse/core';

const settings = useStorage('settings', {
  theme: 'system',
  notifications: true,
});
```

### Manifest V3 存储最佳实践

- **同步数据**: 使用 `chrome.storage.sync` (自动跨设备同步)
- **大量数据**: 使用 `chrome.storage.local`
- **敏感数据**: 避免存储在扩展存储中，使用 Session Storage

```typescript
// 推荐: 使用 storage 模块
import { storage } from 'wxt/storage';

// 同步存储 (适合用户设置)
await storage.set('preferences', { theme: 'dark' }, { area: 'sync' });

// 本地存储 (适合大量数据)
await storage.set('cache', data, { area: 'local' });
```

---

## 配置

### wxt.config.ts

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  // 入口点目录
  srcDir: '.',
  entrypointsDir: 'entrypoints',
  
  // 构建配置
  manifest: {
    name: '{{DISPLAY_NAME}}',
    version: '{{VERSION}}',
    description: '{{DESCRIPTION}}',
    permissions: ['storage', 'tabs'],
  },
  
  // Vite 配置
  vite: {
    build: {
      rollupOptions: {
        // 配置依赖打包
      },
    },
  },
});
```

### 权限配置

```typescript
export default defineConfig({
  manifest: {
    permissions: [
      'storage',
      'tabs',
      'bookmarks',
      'cookies',
      'activeTab',
      'scripting',
    ],
    host_permissions: [
      'https://*/*',
      'http://*/*',
    ],
  },
});
```

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式 (热重载，自动打开浏览器)
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 打包为 zip (用于发布)
pnpm zip

# 运行 E2E 测试
pnpm test:e2e

# 运行单元测试
pnpm test:unit
```

---

## 最佳实践

### 1. Manifest V3 兼容性

- 使用 Service Worker 替代后台脚本
- 使用声明式网络请求替代 webRequest
- 使用 `chrome.scripting.executeScript` 替代 `chrome.tabs.executeScript`

### 2. 性能优化

- 懒加载 Content Script
- 使用 `chrome.storage.session` 存储临时数据
- 避免在 Content Script 中加载大型库

### 3. 安全

- 最小化权限请求
- 使用 `host_permissions` 限制域名访问
- 避免在 Content Script 中存储敏感数据

### 4. 跨浏览器支持

WXT 支持多浏览器打包:

```typescript
export default defineConfig({
  target: ['chrome', 'firefox', 'edge', 'safari'],
});
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止直接访问 `window.chrome` (使用 useChrome 或 wxt/utils)
4. ❌ 禁止在前端直接调用非公开的 Chrome API
5. ❌ 禁止使用 `console.log` (使用 logger)
6. ❌ 禁止在 Content Script 中使用某些 Chrome API
7. ❌ 禁止使用 Manifest V2 (已废弃)

---

## 相关文档

- [WXT 官方文档](https://wxt.dev/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)
- [VueUse Storage](https://vueuse.org/core/useStorage/)
- [WXT Storage 模块](https://wxt.dev/storage)
- [WXT Messaging](https://wxt.dev/guide/essentials/messaging)
