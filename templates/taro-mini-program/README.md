# Taro 小程序模板

> 基于 Taro 4 + React + TypeScript + Tailwind CSS

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Taro | 4.x | 多端统一框架 |
| React | 18.x | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式 |
| Zustand | 5.x | 状态管理 |
| NutUI | 2.x | UI 组件库 |

---

## 支持平台

- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ 小程序
- H5

---

## 目录结构

```
src/
├── app.config.ts       # 全局配置
├── app.tsx             # 入口组件
├── app.scss            # 全局样式
├── pages/              # 页面
│   ├── index/          # 首页
│   │   ├── index.tsx
│   │   ├── index.config.ts
│   │   └── index.scss
│   └── user/           # 用户页
├── components/         # 组件
├── hooks/              # Hooks
├── lib/                # 工具库
├── services/           # API 服务
├── stores/             # Zustand stores
├── types/              # TypeScript 类型
└── assets/             # 静态资源
```

---

## 变量替换

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{PROJECT_NAME}}` | 项目名称 | `my-mini-program` |
| `{{DISPLAY_NAME}}` | 显示名称 | `我的小程序` |
| `{{APP_ID}}` | 微信 AppID | `wx1234567890` |

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 微信小程序开发
pnpm dev:weapp

# H5 开发
pnpm dev:h5

# 构建微信小程序
pnpm build:weapp

# 构建所有平台
pnpm build:all
```

---

## 环境要求

- Node.js 18+
- pnpm 9+
- 微信开发者工具 (微信小程序)
