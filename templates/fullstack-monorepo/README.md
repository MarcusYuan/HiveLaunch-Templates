# {{DISPLAY_NAME}}

> 全栈 Monorepo 项目 - Turborepo + tRPC + Drizzle + Next.js + Hono

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Turborepo | 2.x | Monorepo 构建工具 |
| Next.js | 15.x | React 全栈框架 |
| Hono | 4.x | 高性能 Web 框架 |
| tRPC | 11.x | 类型安全 API |
| Drizzle ORM | 0.38.x | 轻量级 ORM |
| PostgreSQL | 16.x | 关系数据库 |
| Better Auth | 1.x | 认证方案 |
| Tailwind CSS | 4.x | 原子化 CSS |
| shadcn/ui | 0.12.x | UI 组件库 |
| Zustand | 5.x | 状态管理 |
| TanStack Query | 5.x | 数据获取 |

---

## 目录结构

```
{{PROJECT_NAME}}/
├── apps/
│   ├── web/              # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/      # App Router
│   │   │   ├── components/
│   │   │   ├── lib/      # tRPC 客户端
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/              # Hono + tRPC 后端
│       ├── src/
│       │   ├── router/   # tRPC 路由
│       │   ├── service/  # 业务逻辑
│       │   ├── db/       # Drizzle 配置
│       │   └── index.ts  # 入口
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── database/        # Drizzle Schema
│   │   ├── src/
│   │   │   ├── schema.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── auth/            # Better Auth 配置
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ui/              # 共享 UI 组件
│       ├── src/
│       └── package.json
│
├── packages/            # 根目录
├── turbo.json           # Turborepo 配置
├── pnpm-workspace.yaml
└── .env.example
```

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入数据库连接字符串
```

### 3. 生成 Drizzle Client

```bash
pnpm db:generate
```

### 4. 推送 Schema 到数据库

```bash
pnpm db:push
```

### 5. 启动开发

```bash
# 启动所有 apps
pnpm dev

# 单独启动
pnpm dev:web   # http://localhost:3000
pnpm dev:api   # http://localhost:4000
```

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)

---

## 环境要求

- Node.js 18+
- pnpm 9+
- PostgreSQL 16+
- Docker (可选，用于本地数据库)
