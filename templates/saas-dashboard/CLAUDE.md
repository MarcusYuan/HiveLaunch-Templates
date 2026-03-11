# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS v4 + shadcn/ui
- **认证**: Better Auth
- **数据库**: Drizzle ORM + PostgreSQL
- **状态**: Zustand + TanStack Query
- **表单**: React Hook Form + Zod

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `Dashboard.tsx`, `UserCard.tsx` |
| Hooks | camelCase + use | `useAuth.ts`, `useDashboard.ts` |
| Store | camelCase + Store | `dashboardStore.ts` |
| 工具 | camelCase | `formatDate.ts`, `api.ts` |
| 类型 | PascalCase | `User.ts`, `ApiResponse.ts` |

---

## 目录结构

```
saas-dashboard/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # 认证路由
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/    # Dashboard 路由
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   ├── api/            # API 路由
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/      # Dashboard 专用组件
│   │   ├── shared/         # 共享组件
│   │   └── ui/             # shadcn/ui 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── services/           # API 服务
│   ├── stores/             # Zustand stores
│   └── types/              # TypeScript 类型
├── CLAUDE.md
├── package.json.tmpl
└── tailwind.config.ts
```

---

## 组件规范

### 函数组件

```tsx
// ✅ 推荐
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <div className="p-6 pt-0">{children}</div>
    </div>
  );
}
```

---

## 认证

### Better Auth

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在 client 组件中使用 async/await (Server Actions 除外)
4. ❌ 禁止在组件内部直接修改 props
5. ❌ 禁止使用 `console.log` (使用 logger)

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

---

## 相关文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Better Auth 文档](https://www.better-auth.com/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
