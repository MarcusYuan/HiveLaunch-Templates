# {{DISPLAY_NAME}}

> 电商应用 - Next.js 15 + Medusa.js + Stripe

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 15.x | React 全栈框架 |
| Medusa | 2.x | 开源电商引擎 |
| Stripe | 13.x | 支付处理 |
| Tailwind CSS | 4.x | 原子化 CSS |
| shadcn/ui | 0.12.x | UI 组件库 |
| Zustand | 5.x | 状态管理 |

---

## 目录结构

```
{{PROJECT_NAME}}/
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React 组件
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/                  # 工具库
│   ├── stores/               # Zustand stores
│   └── types/                # 类型定义
├── public/                   # 静态资源
├── CLAUDE.md
├── package.json.tmpl
└── tailwind.config.ts
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动 Medusa 后端

```bash
pnpm medusa start
```

### 启动前端

```bash
pnpm dev
```

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)
