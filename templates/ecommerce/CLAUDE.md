# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS v4 + shadcn/ui
- **电商**: Medusa.js (开源电商引擎)
- **支付**: Stripe
- **状态**: Zustand + TanStack Query

---

## 目录结构

```
ecommerce/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (shop)/              # 商店路由组 (不影响 URL)
│   │   │   ├── page.tsx         # 首页 /
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # 产品列表 /products
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # 产品详情 /products/[slug]
│   │   │   └── cart/
│   │   │       └── page.tsx    # 购物车 /cart
│   │   ├── (checkout)/          # 结账路由组
│   │   │   ├── page.tsx        # 结账首页
│   │   │   └── success/
│   │   │       └── page.tsx    # 支付成功 /checkout/success
│   │   ├── api/                 # API 路由
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   │       └── route.ts
│   │   │   └── auth/
│   │   │       └── route.ts
│   │   ├── layout.tsx           # 根布局
│   │   └── not-found.tsx       # 404 页面
│   ├── components/
│   │   ├── products/            # 产品组件
│   │   ├── cart/               # 购物车组件
│   │   ├── checkout/           # 结账组件
│   │   └── ui/                 # 共享 UI 组件
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── usePayment.ts
│   ├── lib/                    # 工具库
│   │   ├── medusa.ts          # Medusa 客户端
│   │   ├── stripe.ts           # Stripe 工具
│   │   └── utils.ts
│   ├── stores/                 # Zustand stores
│   │   └── cartStore.ts
│   └── types/                  # 类型定义
├── public/                     # 静态资源
├── CLAUDE.md
├── package.json.tmpl
└── tailwind.config.ts
```

---

## Next.js 15 开发规范

### 组件类型原则

| 类型 | 标记 | 使用场景 |
|------|------|----------|
| Server Component | 默认 | 数据获取、展示组件、静态内容 |
| Client Component | `"use client"` | 交互组件 (useState, useEffect, 事件处理) |

```tsx
// ✅ 推荐：Server Component 数据获取
async function ProductList() {
  const products = await getProducts();
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// ✅ 推荐：Client Component 交互组件
"use client";
export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

### 路由规范

- 使用路由组 `(folder)` 分组路由，不影响 URL
- API 路由使用 `route.ts` 命名
- 动态路由使用 `[folder]` 语法
- 特殊文件：`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### 数据获取

```tsx
// Server Component 直接获取
async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await medusa.products.retrieve(params.slug);
  return <ProductDetail product={product} />;
}

// 使用 TanStack Query 客户端获取
"use client";
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => medusa.products.retrieve(slug),
  });
}
```

### 缓存策略

| 场景 | 策略 |
|------|------|
| 产品详情 | `revalidate = 60` (ISR) |
| 用户数据 | `no-store` (不缓存) |
| 静态资源 | `force-cache` |

```tsx
// 产品列表 - ISR 缓存
export const revalidate = 60;

// 用户专属 - 不缓存
fetch('/api/user', { cache: 'no-store' });
```

### SEO 元数据

```tsx
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.title,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}
```

---

## Medusa.js 集成规范

### 客户端初始化

```typescript
// src/lib/medusa.ts
import Medusa from "@medusajs/medusa-js";
import { create } from "zustand";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const useMedusaStore = create<{ client: Medusa | null }>(() => ({
  client: null,
}));

export function getMedusaClient() {
  const { client } = useMedusaStore.getState();
  if (!client) {
    const newClient = new Medusa({ baseUrl: MEDUSA_BACKEND_URL });
    useMedusaStore.setState({ client: newClient });
    return newClient;
  }
  return client;
}
```

### 常用 API 操作

```typescript
// 产品
const products = await medusa.products.list({ limit: 20 });
const product = await medusa.products.retrieve(productId);

// 购物车
const cart = await medusa.carts.create();
await medusa.carts.addLineItems(cartId, { variant_id, quantity });
const cart = await medusa.carts.retrieve(cartId);

// 结账
const { paymentSession } = await medusa.carts.setPaymentSession(cartId, {
  provider_id: "stripe",
});
```

---

## Stripe 支付规范

### 安全原则

1. **🔒 禁止在前端直接处理卡号** - 使用 Stripe Elements/Checkout
2. **🔑 密钥存储** - Secret Key 仅在后端使用，Publishable Key 可暴露
3. **✅ Webhook 验签** - 必须验证 Stripe 签名
4. **📜 PCI 合规** - 使用 Stripe 托管页面或 Elements

### 前端集成

```tsx
// src/lib/stripe.ts
"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export { stripePromise };
```

```tsx
// src/components/checkout/PaymentForm.tsx
"use client";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";

export function PaymentForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentElement />
    </Elements>
  );
}
```

### Webhook 处理

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: "Webhook验签失败" }, { status: 400 });
  }

  // 处理事件
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // 更新订单状态
      await handlePaymentSuccess(paymentIntent.id);
      break;
    case "payment_intent.payment_failed":
      // 处理失败
      break;
  }

  return Response.json({ received: true });
}
```

### 环境变量

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## 状态管理规范

### 购物车 Store (Zustand)

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

### TanStack Query 使用

```typescript
// src/hooks/useProducts.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { getMedusaClient } from "@/lib/medusa";

export function useProducts(limit = 20) {
  return useQuery({
    queryKey: ["products", limit],
    queryFn: async () => {
      const medusa = getMedusaClient();
      const { products } = await medusa.products.list({ limit });
      return products;
    },
    staleTime: 60 * 1000, // 1 分钟内数据新鲜
  });
}
```

---

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `ProductCard.tsx`, `CartDrawer.tsx` |
| 页面 | page.tsx | `app/products/page.tsx` |
| API 路由 | route.ts | `app/api/products/route.ts` |
| Hooks | use + PascalCase | `useCart.ts`, `useProducts.ts` |
| Store | camelCase + Store | `cartStore.ts` |
| 类型 | PascalCase | `Product`, `CartItem` |
| 服务/工具 | camelCase | `medusa.ts`, `stripe.ts` |

---

## 禁止事项

1. ❌ **禁止使用 `any` 类型** - 使用具体类型或 `unknown`
2. ❌ **禁止使用 `@ts-ignore`** - 修复类型错误而非忽略
3. ❌ **禁止在前端直接调用支付 API** - 必须通过后端 API
4. ❌ **禁止存储敏感支付信息** - 卡号、CVV 等绝不存储
5. ❌ **禁止使用 `console.log`** - 使用日志服务或条件调试
6. ❌ **禁止过度使用 Client Components** - 优先使用 Server Components
7. ❌ **禁止明文存储 Stripe Secret Key** - 必须使用环境变量

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# Medusa 命令
pnpm medusa seed    # 种子数据
pnpm medusa start   # 启动后端 (端口 9000)

# Stripe Webhook 转发 (开发用)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Medusa 文档](https://docs.medusajs.com/)
- [Stripe 文档](https://stripe.com/docs)
- [Stripe 安全指南](https://docs.stripe.com/security/guide)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
