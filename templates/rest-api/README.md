# REST API 模板

Hono + Drizzle ORM + Zod + PostgreSQL

## 快速开始

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## API 端点

- `GET /health` - 健康检查
- `GET /api/users` - 用户列表
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /docs` - Swagger UI
