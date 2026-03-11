# Expo 移动 APP 模板

> 基于 Expo SDK 54 + NativeWind + Zustand + TanStack Query

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Expo SDK | 54 | React Native 开发框架 |
| Expo Router | 5.x | 文件系统路由 |
| React Native | 0.78 | 移动端框架 |
| React | 19 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| NativeWind | 4.x | Tailwind CSS for RN |
| Zustand | 5.x | 状态管理 |
| TanStack Query | 5.x | 数据获取 |
| React Hook Form | 7.x | 表单处理 |
| Zod | 3.x | Schema 验证 |
| MMKV | 2.x | 本地存储 |
| FlashList | 1.x | 高性能列表 |

---

## 目录结构

```
expo-app/
├── app/                    # Expo Router 页面
│   ├── _layout.tsx        # 根布局
│   ├── index.tsx          # 首页
│   └── (tabs)/            # Tab 导航
│       ├── _layout.tsx
│       ├── index.tsx
│       └── settings.tsx
├── src/
│   ├── components/        # 组件
│   ├── hooks/             # Hooks
│   ├── lib/               # 工具库
│   ├── services/          # API 服务
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript 类型
├── assets/                # 静态资源
├── CLAUDE.md              # AI 开发规则
├── app.json.tmpl          # Expo 配置模板
├── package.json.tmpl      # 依赖配置模板
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.ts     # Tailwind 配置
└── global.css             # 全局样式
```

---

## 变量替换

创建项目时会替换以下变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{PROJECT_NAME}}` | 项目名称 (kebab-case) | `my-awesome-app` |
| `{{DISPLAY_NAME}}` | 显示名称 | `My Awesome App` |
| `{{BUNDLE_ID}}` | Bundle ID | `com.company.myapp` |

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm start

# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web

# 类型检查
pnpm typecheck

# Lint
pnpm lint
```

---

## 环境要求

- Node.js 18+
- pnpm 9+
- Xcode 15+ (iOS)
- Android Studio (Android)
