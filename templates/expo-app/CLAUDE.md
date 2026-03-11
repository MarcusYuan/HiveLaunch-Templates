# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

- **框架**: Expo SDK 54 + Expo Router 5
- **语言**: TypeScript (strict mode)
- **样式**: NativeWind 4 (Tailwind CSS for RN)
- **状态**: Zustand 5
- **数据**: TanStack Query 5
- **表单**: React Hook Form + Zod
- **存储**: MMKV
- **列表**: FlashList

---

## 目录结构

```
expo-app/
├── app/                    # Expo Router 页面 (也可放在 src/app/)
│   ├── _layout.tsx        # 根布局
│   ├── index.tsx          # 匹配 / 路由
│   ├── (group)/           # 分组路由 (URL 不显示)
│   │   ├── _layout.tsx
│   │   └── page.tsx
│   └── (tabs)/            # Tab 导航
│       ├── _layout.tsx
│       └── index.tsx
├── src/
│   ├── components/        # 组件 (不在 app/ 目录)
│   ├── hooks/             # 自定义 Hooks
│   ├── lib/               # 工具库
│   ├── services/          # API 服务
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript 类型
└── assets/                # 静态资源
```

### 目录规范
- `app/` 目录只放路由文件
- 组件放在 `src/components/` 或 `src/ui/`
- 路由与业务代码分离：路由在 `app/`，其他在 `src/`

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件 | PascalCase | `Button.tsx`, `UserCard.tsx` |
| Hooks | camelCase + use | `useAuth.ts`, `useUser.ts` |
| Store | camelCase + Store | `userStore.ts`, `appStore.ts` |
| 类型 | PascalCase | `User.ts`, `ApiResponse.ts` |
| 工具 | camelCase | `formatDate.ts`, `api.ts` |

### 代码命名

```typescript
// 组件: PascalCase
export function UserProfile() {}

// 函数: camelCase
function formatDate() {}

// 常量: UPPER_SNAKE_CASE
const API_BASE_URL = '...';

// 类型/接口: PascalCase
interface User {}
type ApiResponse = {};
```

---

## 样式规范

### 使用 NativeWind (Tailwind)

```tsx
// ✅ 推荐: 使用 className
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">
    Hello
  </Text>
</View>

// ❌ 避免: 使用 style
<View style={{ flex: 1, backgroundColor: 'white' }}>
```

### 颜色系统

```tsx
// 使用 Tailwind 颜色
<Text className="text-gray-900">Primary text</Text>
<Text className="text-gray-600">Secondary text</Text>
<Text className="text-primary-600">Brand color</Text>
```

### NativeWind 最佳实践

```tsx
// 1. 使用 CSS 变量定义主题色
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
    },
  },
};

// 2. Dark Mode 支持
<Text className="dark:text-white">自适应深色模式</Text>

// 3. 条件样式
<View className={isActive ? 'bg-blue-500' : 'bg-gray-200'}>
```

### 推荐依赖版本

```json
{
  "nativewind": "4.1.23",
  "tailwindcss": "3.4.17",
  "react-native-reanimated": "~3.16.1",
  "react-native-safe-area-context": "^4.12.0"
}
```

---

## 组件规范

### 函数组件

```tsx
// ✅ 推荐
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={...}>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

### SafeAreaView

```tsx
// ✅ 页面必须使用 SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* content */}
    </SafeAreaView>
  );
}
```

---

## 状态管理

### 状态分离原则

- **Zustand**: 管理客户端状态 (UI 状态、用户信息、主题)
- **TanStack Query**: 管理服务端状态 (API 数据、缓存)

### Zustand Store

```typescript
// src/stores/userStore.ts
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 使用 Store (Zustand v5)

```tsx
// ✅ 单字段选择器 - 推荐
const user = useUserStore((state) => state.user);

// ❌ 对象选择器 - 必须使用 useShallow
import { useShallow } from 'zustand/react/shallow';
const { user, setUser } = useUserStore(useShallow((state) => ({
  user: state.user,
  setUser: state.setUser,
})));
```

### Zustand 最佳实践

```typescript
// 1. 使用 selectors 避免不必要渲染
const userId = useAuthStore((state) => state.userId);

// 2. 分离 Client State 和 Server State
// - Client: 用户信息、主题、UI 状态
// - Server: API 数据 (用 TanStack Query)

// 3. 使用 Middleware
import { devtools, persist, immer } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      immer((set) => ({ ... }))
    ),
    { name: 'my-store' }
  )
);
```

---

## 数据获取

### TanStack Query

```typescript
// src/services/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

---

## 表单处理

### React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
}
```

---

## 路由规范

### Expo Router

```tsx
// 导航
import { Link, router } from 'expo-router';

// Link 组件
<Link href="/profile">Go to Profile</Link>

// 编程式导航
router.push('/profile');
router.back();
```

### Expo Router 最佳实践

```tsx
// 分组路由 - URL 不显示分组名
app/(auth)/login.tsx      // 匹配 /login
app/(tabs)/index.tsx      // 匹配 / (在 tab 中)

// 动态路由
app/user/[id].tsx         // 匹配 /user/123

// 路由组共享布局
app/(auth)/_layout.tsx    // 认证页面共享布局
app/(tabs)/_layout.tsx    // Tab 页面共享布局
```

### 文件命名规则

| 文件 | 匹配路由 |
|------|----------|
| `app/index.tsx` | `/` |
| `app/about.tsx` | `/about` |
| `app/about/index.tsx` | `/about` |
| `app/user/[id].tsx` | `/user/123` |
| `app/(tabs)/_layout.tsx` | Tab 导航布局 |

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在渲染函数中定义组件
4. ❌ 禁止在循环中使用 `index` 作为 key
5. ❌ 禁止在组件内部直接修改 props
6. ❌ 禁止使用 `console.log` (使用 logger)

---

## 测试规范

```typescript
// 使用 React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';

test('button calls onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Click" onPress={onPress} />);
  
  fireEvent.press(getByText('Click'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## 相关文档

- [Expo 文档](https://docs.expo.dev/)
- [NativeWind 文档](https://www.nativewind.dev/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [TanStack Query 文档](https://tanstack.com/query/latest)
