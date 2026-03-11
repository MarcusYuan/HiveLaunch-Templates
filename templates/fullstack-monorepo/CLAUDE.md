# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **Monorepo**: Turborepo 2.x
- **前端**: Next.js 15 (App Router) + React 19
- **后端**: Hono + tRPC v11
- **数据库**: Drizzle ORM + PostgreSQL
- **认证**: Better Auth
- **样式**: Tailwind CSS v4 + shadcn/ui
- **状态**: Zustand + TanStack Query
- **包管理**: pnpm 9+

---

## 命名规范

### 目录命名

| 类型 | 格式 | 示例 |
|------|------|------|
| App | kebab-case | `web`, `api`, `admin` |
| Package | kebab-case | `ui`, `database`, `auth` |

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `Button.tsx`, `UserCard.tsx` |
| Hooks | camelCase + use | `useAuth.ts`, `useUser.ts` |
| tRPC 路由 | camelCase | `user.ts`, `auth.ts` |
| Drizzle Schema | camelCase | `user.ts`, `post.ts` |
| 工具 | camelCase | `formatDate.ts`, `api.ts` |

---

## Monorepo 结构

```
├── apps/
│   ├── web/              # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/       # App Router 页面
│   │   │   ├── components/# 业务组件
│   │   │   ├── lib/       # tRPC 客户端、配置
│   │   │   └── styles/    # 全局样式
│   │   └── package.json
│   │
│   └── api/              # Hono + tRPC 后端
│       ├── src/
│       │   ├── index.ts   # 入口 (Hono app)
│       │   ├── router/    # tRPC 路由聚合
│       │   ├── trpc.ts    # tRPC 初始化
│       │   ├── service/   # 业务逻辑层
│       │   └── context.ts # 上下文 (DB, Session)
│       └── package.json
│
├── packages/
│   ├── database/         # Drizzle Schema + ORM
│   │   ├── src/
│   │   │   ├── schema/   # 表定义
│   │   │   ├── index.ts  # ORM 导出
│   │   │   └── migrations/# 迁移文件
│   │   └── package.json
│   │
│   ├── auth/            # Better Auth 配置
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared/          # 共享类型
│   │   ├── src/
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── ui/              # 共享 UI 组件
│       ├── src/
│       └── package.json
│
├── package.json         # 根 package.json
├── turbo.json           # Turborepo 配置
├── pnpm-workspace.yaml
└── .env.example
```

---

## 类型安全架构

### tRPC 类型共享 (核心)

API 类型必须从 `apps/api` 导出，供 `apps/web` 消费：

```typescript
// apps/api/package.json
{
  "name": "@hivelaunch/api",
  "exports": {
    ".": "./src/index.ts",
    "./router": "./src/router/index.ts"
  }
}
```

```typescript
// apps/web/src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@hivelaunch/api';

export const trpc = createTRPCReact<AppRouter>();

// Provider 配置
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 类型导出约定

```typescript
// apps/api/src/router/index.ts (路由聚合)
import { router } from '../trpc';
import { userRouter } from './user';
import { postRouter } from './post';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
```

---

## 前后端通信

### tRPC 路由定义

```typescript
// apps/api/src/router/user.ts
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
  // 公开路由
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 登录逻辑
    }),

  // 受保护路由
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      avatar: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 更新逻辑
    }),
});
```

### Hono + tRPC 集成

```typescript
// apps/api/src/index.ts
import { Hono } from 'hono';
import { trpcServer } from '@trpc/server/adapters/hono';
import { appRouter } from './router';

const app = Hono();

app.route('/trpc', trpcServer({
  router: appRouter,
  createContext: () => ({}),
}));

export default app;
```

---

## 数据库操作

### Drizzle Schema 定义

```typescript
// packages/database/src/schema/user.ts
import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 关系定义
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

### Service 层查询

```typescript
// apps/api/src/service/user.ts
import { db } from '@hivelaunch/database';
import { users, posts } from '@hivelaunch/database/schema';
import { eq } from 'drizzle-orm';

export const userService = {
  async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: { posts: true }, // 关联查询
    });
  },

  async create(data: InsertUser) {
    return db.insert(users).values(data).returning();
  },

  async update(id: string, data: UpdateUser) {
    return db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
  },
};
```

### Turborepo 管道配置

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

---

## 认证

### Better Auth 配置

```typescript
// packages/auth/src/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@hivelaunch/database';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
});
```

### tRPC Context 中的认证

```typescript
// apps/api/src/context.ts
import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts: FetchCreateContextFnOptions) {
  // 从 cookie 或 header 获取 session
  const session = await getSession(opts.req);
  
  return {
    db: createDbClient(),
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

```typescript
// apps/api/src/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// 受保护路由中间件
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { session: ctx.session } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在 apps 之间直接导入 (通过 packages 共享)
4. ❌ 禁止在前端直接调用数据库
5. ❌ 禁止使用 `console.log` (使用 logger)
6. ❌ 禁止在 client 组件中直接使用 tRPC (使用 hooks)
7. ❌ 禁止在前端 package 中使用 server-only 代码
8. ❌ 禁止在 schema 中使用 `any`

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式 (所有 apps)
pnpm dev

# 单独开发 web
pnpm dev:web      # http://localhost:3000

# 单独开发 api
pnpm dev:api      # http://localhost:4000

# 构建 (Turborepo)
pnpm build        # 构建所有 packages 和 apps
pnpm build --filter=web    # 仅构建 web
pnpm build --filter=api    # 仅构建 api

# 数据库操作
pnpm db:generate  # 生成 Drizzle Client
pnpm db:push      # 推送 schema 到数据库
pnpm db:migrate   # 执行迁移
pnpm db:studio   # 打开 Drizzle Studio
pnpm db:seed      # 种子数据

# 代码质量
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm format       # Prettier
```

---

## 环境变量

```bash
# 根目录 .env
DATABASE_URL=postgres://user:pass@localhost:5432/db

# apps/api/.env
AUTH_SECRET=your-secret-key
DATABASE_URL=postgres://user:pass@localhost:5432/db

# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:4000/trpc
```

---

## 相关文档

- [Turborepo 文档](https://turbo.build/repo)
- [tRPC 文档](https://trpc.io/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Better Auth 文档](https://www.better-auth.com/)
- [Hono 文档](https://hono.dev)
- [Vercel Turborepo + Hono 模板](https://examples.vercel.com/templates/monorepos/turborepo-with-hono)
