# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **框架**: Astro 5
- **内容**: Astro Content Collections (Content Layer API)
- **样式**: Tailwind CSS v4
- **UI**: React 19 (交互组件)
- **部署**: Vercel / Netlify

---

## 目录结构

```
blog-content/
├── src/
│   ├── content/             # Content Collections
│   │   └── blog/           # 博客文章
│   │       ├── post-1.md
│   │       └── post-2.md
│   ├── components/          # Astro 组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   └── SEO.astro       # SEO 组件
│   ├── layouts/            # 布局
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── pages/              # 页面
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── rss.xml.js      # RSS 订阅
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── content/            # 内容配置
│   │   └── config.ts       # Collection schema
│   └── styles/             # 样式
├── public/                 # 静态资源
│   └── images/            # 文章图片
├── CLAUDE.md
├── astro.config.mjs
└── package.json.tmpl
```

---

## 内容集合 (Content Collections)

### 定义 Collection (生产级 Schema)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // 必填字段
    title: z.string().max(100, '标题不超过100字符'),
    description: z.string().max(160, '描述不超过160字符'),
    pubDate: z.coerce.date(),
    
    // 可选字段
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
    
    // 标签系统
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    
    // SEO
    canonicalURL: z.string().optional(),
    
    // 作者信息
    author: z.string().default('默认作者'),
    authorImage: image().optional(),
    
    // 分类
    category: z.string().default('uncategorized'),
  }),
});

// 标签规范化工具函数
function normalizeTags(tags: string[]) {
  return [...new Set(tags.map(t => t.toLowerCase().trim()))];
}

export const collections = { blog };
```

### 编写文章

```markdown
---
title: '我的第一篇文章'
description: '这是一篇关于某个主题的文章简介'
pubDate: '2024-01-01'
updatedDate: '2024-01-15'
heroImage: /images/my-post-cover.jpg
heroImageAlt: '文章封面图描述'
tags: ['tutorial', 'astro', 'webdev']
category: 'tutorial'
author: '作者名'
draft: false
---

# 内容标题

正文内容...
```

### 查询内容

```typescript
// 获取所有文章（按日期排序）
const posts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

// 按标签筛选
const postsByTag = posts.filter(post => 
  post.data.tags.includes('astro')
);
```

---

## SEO 最佳实践

### 必需配置

1. **Sitemap** - 使用 `@astrojs/sitemap`
2. **RSS 订阅** - 使用 `@astrojs/rss`
3. **Meta 标签** - 使用 `astro-meta-tags` 或手动配置

```bash
pnpm add @astrojs/sitemap @astrojs/rss
```

### astro.config.mjs 配置

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yoursite.com', // 必填，用于 sitemap 和 RSS
  integrations: [
    sitemap(),
    tailwind(),
  ],
});
```

### SEO 组件示例

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  pubDate?: Date;
}

const { title, description, image = '/default-og.png', article = false, pubDate } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!-- Canonical URL -->
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:type" content={article ? 'article' : 'website'} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:url" content={canonicalURL} />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, Astro.site)} />

{article && pubDate && (
  <meta property="article:published_time" content={pubDate.toISOString()} />
)}
```

### RSS 订阅

```javascript
// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  return rss({
    title: '博客名称',
    description: '博客描述',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

---

## UI/UX 开发规范

### Tailwind CSS v4 最佳实践

1. **使用语义化颜色**
```css
/* src/styles/globals.css */
@theme {
  --color-background: oklch(0.98 0.02 240);
  --color-foreground: oklch(0.2 0.02 240);
  --color-primary: oklch(0.6 0.15 240);
  --color-muted: oklch(0.95 0.01 240);
}
```

2. **暗色模式支持**
```astro
<!-- 使用 html.dark 类进行主题切换 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  内容
</div>
```

### 博客卡片组件

```astro
---
// src/components/PostCard.astro
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, description, pubDate, heroImage, tags } = post.data;
---

<article class="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
  {heroImage && (
    <div class="aspect-video overflow-hidden">
      <Image 
        src={heroImage} 
        alt={title}
        width={800}
        height={450}
        class="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  )}
  <div class="flex flex-1 flex-col p-5">
    <div class="mb-2 flex gap-2">
      {tags?.slice(0, 3).map(tag => (
        <span class="text-xs font-medium rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
          {tag}
        </span>
      ))}
    </div>
    <h3 class="mb-2 text-xl font-bold line-clamp-2">
      <a href={`/blog/${post.slug}`} class="hover:text-primary transition-colors">
        {title}
      </a>
    </h3>
    <p class="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>
    <time datetime={pubDate.toISOString()} class="text-xs text-muted">
      {pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
    </time>
  </div>
</article>
```

### 动画效果

- **悬停动画**: 使用 `transition-all duration-300`
- **入场动画**: 使用 `animate-fade-in` 或 Framer Motion
- **图片悬停放大**: `group-hover:scale-105`

---

## 组件开发

### Astro 组件

```astro
---
// src/components/Header.astro
const { title = 'My Blog' } = Astro.props;
---
<header class="py-4">
  <nav class="flex justify-between items-center">
    <a href="/" class="text-xl font-bold">{title}</a>
    <ul class="flex gap-4">
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

### React 交互组件

```tsx
// src/components/Search.tsx
'use client';

import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索文章..."
      class="rounded-lg border bg-background px-4 py-2"
    />
  );
}
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在客户端组件中过度使用状态
4. ❌ 禁止使用 `console.log`
5. ❌ 禁止在 `src/pages` 目录下直接存放内容文件
6. ❌ 禁止跳过 Content Collections schema 验证

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

---

## 相关文档

- [Astro 文档](https://docs.astro.build/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro SEO 指南](https://astrojs.dev/articles/astro-seo-structure/)
- [Tailwind CSS](https://tailwindcss.com/)
