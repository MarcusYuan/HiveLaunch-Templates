# REST API AI 开发规则

## 技术栈
- Hono 4 - Web 框架
- Drizzle ORM - 数据库
- Zod - 验证
- PostgreSQL - 数据库

## API 设计规范

### 资源命名
- 使用名词复数：`/users` 而非 `/user`
- 嵌套资源表示关系：`/users/123/orders`
- URL 长度控制在 200 字符以内，层级深度不超过 4 层

### HTTP 方法语义
| 方法 | 用途 | 幂等 | 注意事项 |
|------|------|------|----------|
| GET | 查询 | ✅ | 可缓存，安全 |
| POST | 创建 | ❌ | 返回 201 + Location Header |
| PUT | 全量更新 | ✅ | 替换整个资源 |
| PATCH | 部分更新 | ❌ | 仅修改字段 |
| DELETE | 删除 | ✅ | 返回 204 No Content |

### 状态码规范
- 2xx：成功
- 4xx：客户端错误
- 5xx：服务端错误

### 版本化
通过 URI 进行版本控制：`/v1/users`

## 代码规范

### Hono 最佳实践
- ✅ 直接在路由定义后写 handlers，避免创建 RoR 风格的 Controllers
- ✅ 使用 zValidator 进行请求验证
- ✅ 保持类型安全，利用 TypeScript 推断

```typescript
// ✅ 正确：直接在路由定义 handler
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ data: { id } })
})
```

### Drizzle ORM 规范
- ✅ 使用 identity columns 代替 serial types
- ✅ 使用 drizzle-zod 进行验证
- ✅ Schema 定义使用 TypeScript 类型

```typescript
// 现代 Schema 使用 identity columns
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
})
```

### 响应格式
- 错误统一返回：`{ error: string }`
- 成功返回：`{ data: any }`

## 禁止事项
- ❌ 禁止 any 类型
- ❌ 禁止 unwrap()
- ❌ 禁止在 URI 中使用动词（如 /getUser）
- ❌ 避免创建 Controller 层

## 开发命令
```bash
pnpm install
cp .env.example .env
pnpm dev
```
