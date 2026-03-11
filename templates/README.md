# HiveLaunch 脚手架模板

> 12 个场景化的项目模板，开箱即用

---

## 目录结构

```
templates/
├── docs/                    # 规划文档
│   ├── README.md           # 调研背景与结论
│   ├── 场景列表.md         # 12 个场景详细描述
│   ├── 场景初始化技术方案.md # 技术栈 + 官方 CLI
│   └── 技术栈Review报告.md  # 2025 最佳实践验证
│
├── expo-app/               # 📱 Expo 移动 APP
├── ai-web-app/             # 🤖 AI Web 应用
├── saas-dashboard/         # 🌐 SaaS/Dashboard
├── taro-mini-program/      # 📲 小程序
├── tauri-desktop/          # 💻 Tauri 桌面
├── rest-api/               # ⚡ REST API
├── fullstack-monorepo/     # 📦 全栈 Monorepo
├── ecommerce/              # 🛒 电商应用
├── blog-content/           # 📝 博客/内容站
├── chrome-extension/       # 🔌 Chrome 扩展
├── cli-tool/               # 🖥️ CLI 工具
└── h5-game/                # 🎮 H5 游戏
```

---

## 模板状态

| 模板 | Phase | 技术栈 | 状态 |
|------|-------|--------|------|
| expo-app | 1 | Expo SDK 54 + NativeWind + Zustand | 📋 待实现 |
| ai-web-app | 1 | Next.js 15 + Vercel AI SDK + LangChain | 📋 待实现 |
| saas-dashboard | 1 | Next.js 15 + shadcn/ui + Better Auth | 📋 待实现 |
| taro-mini-program | 1 | Taro 4 + NutUI + Tailwind | 📋 待实现 |
| tauri-desktop | 1 | Tauri v2 + React 19 | 📋 待实现 |
| rest-api | 2 | Hono + Drizzle + Zod | 📋 待实现 |
| fullstack-monorepo | 2 | Turborepo + tRPC + Drizzle | 📋 待实现 |
| ecommerce | 2 | Next.js + Stripe + Medusa | 📋 待实现 |
| blog-content | 2 | Astro 5 + Content Collections | 📋 待实现 |
| chrome-extension | 3 | WXT + React + Tailwind | 📋 待实现 |
| cli-tool | 3 | oclif / Commander + Inquirer | 📋 待实现 |
| h5-game | 3 | Phaser 3 + TypeScript + Zustand | 📋 待实现 |

---

## 每个模板的结构

```
{template-name}/
├── .opencode/              # AI 配置 (由 F2 蜂群管理)
│   ├── oh-my-opencode.jsonc
│   ├── opencode.json
│   └── skills/
├── CLAUDE.md               # 场景化 AI 开发规则 ⭐
├── package.json
├── tsconfig.json
├── README.md
└── src/                    # 项目源码
```

---

## 使用方式

1. 用户在 HiveLaunch 选择模板
2. F4 脚手架复制模板到用户目标目录
3. 变量替换 (项目名、Bundle ID 等)
4. 绑定 AI 蜂群配置
5. 用户得到独立项目，可立即开发

---

## 相关文档

详见 [docs/](./docs/) 目录
