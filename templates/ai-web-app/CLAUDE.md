# {{DISPLAY_NAME}} - AI Web 应用开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS 4 + shadcn/ui
- **AI SDK**: Vercel AI SDK 4 + LangChain.js
- **状态**: Zustand 5
- **数据**: TanStack Query 5
- **表单**: React Hook Form + Zod

---

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   ├── (chat)/            # 聊天相关页面
│   ├── api/               # API Routes
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/
│   ├── ui/                # shadcn/ui 组件
│   ├── chat/              # 聊天组件
│   └── shared/            # 共享组件
├── hooks/                 # React Hooks
├── lib/                   # 工具函数
├── services/              # API 服务
├── stores/                # Zustand stores
└── types/                 # TypeScript 类型
```

---

## AI 功能开发

### 聊天 API

```typescript
// src/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 使用 Vercel AI SDK

```tsx
'use client';

import { useChat } from 'ai/react';

export function Chat() {
  const { messages, input, handleSubmit } = useChat({
    api: '/api/chat',
  });

  // ...
}
```

### LangChain 集成

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({ modelName: 'gpt-4o' });

const prompt = PromptTemplate.fromTemplate('...');
const chain = prompt.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({ input: '...' });
```

---

## API 路由规范

### Edge Runtime

```typescript
// ✅ 推荐: Edge Runtime for AI
export const runtime = 'edge';

export async function POST(req: Request) {
  // ...
}
```

### 错误处理

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // ...
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## 环境变量

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic (可选)
ANTHROPIC_API_KEY=sk-ant-...

# Vector DB (RAG)
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
```

---

## RAG 模式

### 向量存储

```typescript
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone();
const index = pinecone.Index('my-index');

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex: index }
);

// Similarity search
const results = await vectorStore.similaritySearch(query, 4);
```

---

## 组件规范

### Server Components (默认)

```tsx
// ✅ Server Component
async function UserProfile({ id }: { id: string }) {
  const user = await getUser(id);
  
  return <div>{user.name}</div>;
}
```

### Client Components

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}
```

---

## 禁止事项

1. ❌ 禁止在 Server Component 中使用 `useState`, `useEffect`
2. ❌ 禁止在 Client Component 中直接访问数据库
3. ❌ 禁止将 API Key 硬编码在代码中
4. ❌ 禁止在客户端暴露敏感环境变量
5. ❌ 禁止使用 `any` 类型
6. ❌ **禁止将用户输入直接传递给 LLM** - 必须经过验证和清理
7. ❌ **禁止在 API 路由中省略 Rate Limiting** - AI 应用必须有访问限制

---

## 安全规范（AI 应用特有）

### Prompt Injection 防护

```typescript
// ❌ 危险：直接传递用户输入
await generateText({
  model: openai('gpt-4o'),
  prompt: userMessage,
});

// ✅ 安全：使用结构化消息 + 输入验证
import { z } from 'zod';

const UserMessageSchema = z.object({
  content: z.string().max(2000).trim(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { content } = UserMessageSchema.parse(body);
  
  // 使用消息数组而非原始 prompt
  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      { role: 'system', content: '你是一个有帮助的助手。' },
      { role: 'user', content }
    ],
  });
  
  return result.toDataStreamResponse();
}
```

### Rate Limiting（必选）

```typescript
// src/app/api/chat/route.ts
import { Ratelimit } from '@upstash/ratelimit';
import kv from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, '30s'), // 30秒内最多10次请求
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  // ...
}
```

### 环境变量安全

```typescript
// ✅ 正确：服务端专用
import { OPENAI_API_KEY } from process.env;

// ❌ 错误：客户端暴露
// 不要在 .env.local 中使用 NEXT_PUBLIC_ 前缀暴露 API Key
```

---

## 错误处理规范

### API 错误处理

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 业务逻辑
  } catch (error) {
    // 区分可预知错误和未知错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    // 生产环境不泄露内部错误详情
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### LangChain 错误处理

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { withFallbacks } from '@langchain/core/runnables';

const model = new ChatOpenAI({ modelName: 'gpt-4o' });

// 优雅降级链
const chain = model.withFallbacks({
  fallbacks: [
    // 降级到更小的模型
    new ChatOpenAI({ modelName: 'gpt-3.5-turbo' }),
  ],
});

// 工具调用错误处理
try {
  const result = await chain.invoke(input);
} catch (error) {
  if (error instanceof Error) {
    // 处理模型错误
    if (error.message.includes('rate limit')) {
      throw new AppError('Service temporarily unavailable', 503);
    }
  }
  throw error;
}
```

---

## 类型安全规范

### Result 模式

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

// 使用
const result = await fetchUser('123');
if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.message);
}
```

### Zod 验证

```typescript
import { z } from 'zod';

// API 请求验证
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().max(10000),
  })),
  model: z.string().optional(),
});

// 环境变量验证
const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().optional(),
});

const env = EnvSchema.parse(process.env);
```

---

## 性能优化

### 流式响应

```typescript
export const maxDuration = 30; // Edge Function 超时时间

export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    // 增量更新
    experimental_transform: smoothStream(),
  });
  
  return result.toDataStreamResponse();
}
```

### 缓存策略

```typescript
import { unstable_cache } from 'next/cache';

// 缓存不频繁变化的数据
const getCachedModels = unstable_cache(
  async () => {
    return await fetchAvailableModels();
  },
  ['available-models'],
  { revalidate: 3600 } // 1小时
);
```

---

## 测试规范

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('chat sends message', async () => {
  const user = userEvent.setup();
  render(<Chat />);
  
  await user.type(screen.getByPlaceholderText('Type...'), 'Hello');
  await user.click(screen.getByRole('button', { name: /send/i }));
  
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

// API 路由测试
import { POST } from './route';
import { NextRequest } from 'next/server';

test('POST returns rate limit on too many requests', async () => {
  const req = new NextRequest('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [] }),
  });
  
  // 模拟多次请求...
});
```

---

## 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [LangChain.js](https://js.langchain.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI Rate Limiting](https://vercel.com/kb/guide/securing-ai-app-rate-limiting)
