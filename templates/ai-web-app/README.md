# AI Web 应用模板

> 基于 Next.js 15 + Vercel AI SDK + LangChain + shadcn/ui

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 15 | App Router |
| React | 19 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式 |
| shadcn/ui | 最新 | UI 组件 |
| Vercel AI SDK | 4.x | AI 功能 |
| LangChain.js | 0.3.x | LLM 编排 |
| Zustand | 5.x | 状态管理 |
| TanStack Query | 5.x | 数据获取 |
| Zod | 3.x | Schema 验证 |

---

## 核心功能

- ✅ AI 聊天界面 (useChat)
- ✅ 流式响应支持
- ✅ OpenAI / Anthropic 模型支持
- ✅ LangChain 集成
- ✅ RAG 支持 (可选)
- ✅ 响应式设计
- ✅ 深色模式支持

---

## 目录结构

```
ai-web-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts     # Chat API
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页 (聊天界面)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   └── types/
├── public/
├── CLAUDE.md                    # AI 开发规则
├── package.json.tmpl
├── tsconfig.json
├── next.config.ts
└── template.json                # 模板配置
```

---

## 环境变量

创建 `.env.local` 文件:

```env
# OpenAI (必需)
OPENAI_API_KEY=sk-...

# Anthropic (可选)
ANTHROPIC_API_KEY=sk-ant-...

# Vector DB for RAG (可选)
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
```

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm dev

# 构建
pnpm build

# 生产运行
pnpm start

# 类型检查
pnpm typecheck

# Lint
pnpm lint
```

---

## 使用 AI SDK

### 聊天功能

```tsx
import { useChat } from 'ai/react';

function Chat() {
  const { messages, input, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={...} />
      </form>
    </div>
  );
}
```

### 流式响应

```typescript
// API Route
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## 扩展功能

### 添加 RAG

1. 配置向量数据库 (Pinecone/Weaviate)
2. 创建 embeddings
3. 实现检索逻辑

详见 CLAUDE.md
