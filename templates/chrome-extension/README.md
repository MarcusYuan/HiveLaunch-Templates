# {{DISPLAY_NAME}}

> Chrome 扩展 - WXT + React + Tailwind CSS

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| WXT | 0.22.x | Chrome 扩展构建框架 |
| React | 19.x | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS |
| Zustand | 5.x | 状态管理 |
| VueUse | 12.x | 工具 Hooks |

---

## 目录结构

```
{{PROJECT_NAME}}/
├── entry/
│   ├── popup/              # 弹出窗口
│   ├── options/            # 设置页
│   ├── background/         # Service Worker
│   ├── content/            # Content Script
│   └── devtools/           # DevTools
├── components/             # 共享组件
├── composables/            # 共享 Hooks
├── utils/                  # 工具函数
├── types/                  # 类型定义
├── stores/                 # Zustand stores
├── public/                 # 静态资源
├── wxt.config.ts           # WXT 配置
├── tailwind.config.ts
├── package.json.tmpl
└── CLAUDE.md
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 打包

```bash
pnpm zip
```

---

## 权限配置

在 `wxt.config.ts` 中配置需要的权限：

```typescript
export default defineConfig({
  manifest: {
    permissions: ['storage', 'bookmarks', 'tabs'],
  },
});
```

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)

---

## 浏览器支持

- Chrome 120+
- Firefox 120+
- Edge 120+
- Safari 15+
- Opera 100+
