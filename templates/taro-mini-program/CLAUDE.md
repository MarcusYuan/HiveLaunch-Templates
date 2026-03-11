# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 技术栈

- **框架**: Taro 4
- **UI**: React 18 + TypeScript
- **样式**: Tailwind CSS 3 + taro-plugin-tailwind
- **组件库**: NutUI React Taro
- **状态**: Zustand 5
- **类型**: TypeScript strict mode

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 页面 | 小写 | `pages/index/index.tsx` |
| 组件 | PascalCase | `components/Button.tsx` |
| Hooks | camelCase + use | `hooks/useAuth.ts` |
| Store | camelCase + Store | `stores/userStore.ts` |

---

## 页面规范

### 页面结构

```
pages/
└── index/
    ├── index.tsx         # 页面组件
    ├── index.config.ts   # 页面配置
    └── index.scss        # 页面样式
```

### 页面组件

```tsx
import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="index">
      <Text>Hello World</Text>
    </View>
  );
}
```

### 页面配置

```typescript
export default definePageConfig({
  navigationBarTitleText: '页面标题',
  enableShareAppMessage: true,
});
```

---

## 样式规范

### Tailwind CSS

```tsx
// ✅ 推荐
<View className="flex items-center justify-center p-4">
  <Text className="text-lg font-bold text-gray-900">
    Hello
  </Text>
</View>
```

### SCSS

```scss
// 使用 BEM 命名
.page {
  &__header {
    padding: 32px;
  }
  
  &__title {
    font-size: 40px;
    font-weight: bold;
  }
}
```

---

## 状态管理

### Zustand

```typescript
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## Taro API 使用

### 路由

```tsx
import Taro from '@tarojs/taro';

// 跳转
Taro.navigateTo({ url: '/pages/detail/index?id=1' });

// 返回
Taro.navigateBack();

// Tab 切换
Taro.switchTab({ url: '/pages/index/index' });
```

### 存储

```tsx
// 同步存储
Taro.setStorageSync('key', 'value');
const value = Taro.getStorageSync('key');

// 异步存储
await Taro.setStorage({ key: 'key', data: 'value' });
const { data } = await Taro.getStorage({ key: 'key' });
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止在页面组件外使用 Taro API
3. ❌ 禁止直接操作 DOM
4. ❌ 禁止使用 `window` / `document` 对象
5. ❌ 禁止在循环中使用 `index` 作为 key

---

## 跨端兼容

### 条件编译

```tsx
// 微信小程序
if (process.env.TARO_ENV === 'weapp') {
  // 微信特有代码
}

// H5
if (process.env.TARO_ENV === 'h5') {
  // H5 特有代码
}
```

---

## 相关文档

- [Taro 文档](https://docs.taro.zone/)
- [NutUI 文档](https://nutui.jd.com/taro/react/2x/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
