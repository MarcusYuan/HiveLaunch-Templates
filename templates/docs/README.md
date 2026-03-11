# 脚手架场景讨论

> 本目录记录 HiveLaunch 脚手架系统的**规划阶段**文档
> 创建日期：2025-03-08

---

## 背景

### HiveLaunch 脚手架系统是什么？

HiveLaunch 的脚手架系统是一个**项目启动加速器**，让用户从"有一个想法"到"看板上开始派发 Agent 任务"的路径缩短到 **3 步操作、2 分钟内完成**。

核心价值：
- 用户选择一个场景模板
- 自动创建项目目录 + 绑定 AI 蜂群配置
- 开箱即用，AI 开发环境已就绪

### 为什么需要做这件事？

| 痛点 | 解决方案 |
|------|----------|
| 新项目配置繁琐 | 模板一键创建 |
| AI 开发环境配置复杂 | 预置 CLAUDE.md + 蜂群配置 |
| 技术选型困难 | 场景化最佳实践模板 |
| 重复造轮子 | 标准化项目结构 |

---

## 调研阶段

### 调研目标

1. **市场需求调研** - 哪些开发场景是刚需？
2. **技术栈验证** - 每个场景 2025 年的最佳技术栈是什么？
3. **官方初始化方式** - 各框架官方 CLI 和模板来源

### 调研结论

#### 场景优先级

| Phase | 场景 | 优先级 | 状态 |
|-------|------|--------|------|
| **Phase 1** | Expo 移动 APP | 核心 | ✅ 调研完成 |
| **Phase 1** | AI Web 应用 | 核心 | ✅ 调研完成 |
| **Phase 1** | SaaS/Dashboard | 核心 | ✅ 调研完成 |
| **Phase 1** | 小程序 (Taro) | 核心 | ✅ 调研完成 |
| **Phase 1** | Tauri 桌面 | 核心 | ✅ 调研完成 |
| **Phase 2** | REST API 服务 | 扩展 | ✅ 调研完成 |
| **Phase 2** | 全栈 Monorepo | 扩展 | ✅ 调研完成 |
| **Phase 2** | 电商应用 | 扩展 | ✅ 调研完成 |
| **Phase 2** | 博客/内容站 | 扩展 | ✅ 调研完成 |
| **Phase 3** | Chrome 扩展 | 差异化 | ✅ 调研完成 |
| **Phase 3** | CLI 工具 | 差异化 | ✅ 调研完成 |
| **Phase 3** | H5 游戏 | 差异化 | ✅ 调研完成 |

#### 关键技术决策

| 场景 | 核心技术栈 | 关键决策 |
|------|-----------|----------|
| Expo 移动 | Expo SDK 54 + NativeWind + Zustand | NativeWind 实现跨平台样式共享 |
| AI Web | Next.js 15 + Vercel AI SDK + LangChain | Vercel AI SDK 统一多模型 API |
| SaaS/Dashboard | Next.js 15 + shadcn/ui + Better Auth | Better Auth 替代 Auth.js (2025 推荐) |
| 小程序 | Taro 4 + NutUI + Tailwind | NutUI (React 生态，更新活跃) |
| Tauri 桌面 | Tauri v2 + React 19 | Core APIs 内置，插件按需安装 |
| REST API | Hono + Drizzle + Zod | Hono 边缘优先，Drizzle 轻量 |
| Monorepo | Turborepo + tRPC + Drizzle | tRPC 端到端类型安全 |
| 电商 | Next.js + Stripe + Medusa/Sanity | Medusa 开源，Sanity 灵活 CMS |
| 博客 | Astro 5 + Content Collections | 零 JS 默认，性能最佳 |
| Chrome 扩展 | WXT + React + Tailwind | WXT 是 2025 年首选框架 |
| CLI 工具 | oclif / Commander + Inquirer | oclif 企业级，Commander 简单 |
| H5 游戏 | Phaser 3 + TypeScript + Zustand | Phaser 完整游戏框架 |

---

## 下一步行动

### ✅ 决策：模板放在 hivelaunch/templates/ 下

**为什么放在 hivelaunch 下？**

| 理由 | 说明 |
|------|------|
| 开发方便 | 不需要切换项目，统一管理 |
| 本地引用 | F4 脚手架直接引用本地模板 |
| Monorepo | 模板是 HiveLaunch 的核心能力 |

**目录结构**：

```
hivelaunch/
├── apps/                    # HiveLaunch 应用
├── features/               # HiveLaunch 功能
├── infra/                  # 基础设施
├── packages/               # 共享包
├── templates/              # 🆕 脚手架模板目录
│   ├── expo-app/           # Expo 移动 APP 模板
│   ├── ai-web-app/         # AI Web 应用模板
│   ├── saas-dashboard/     # SaaS Dashboard 模板
│   ├── taro-mini-program/  # 小程序模板
│   ├── tauri-desktop/      # Tauri 桌面模板
│   ├── rest-api/           # REST API 模板
│   ├── fullstack-monorepo/ # Monorepo 模板
│   ├── ecommerce/          # 电商模板
│   ├── blog-content/       # 博客模板
│   ├── chrome-extension/   # Chrome 扩展模板
│   ├── cli-tool/           # CLI 工具模板
│   └── h5-game/            # H5 游戏模板
└── docs/
```

**用户如何使用？**

1. 用户在 HiveLaunch 选择模板
2. F4 脚手架 clone `templates/xxx/` 到用户目标位置
3. 用户得到的是独立项目，与 hivelaunch 无关

### 实施路径

| 阶段 | 任务 | 产出 |
|------|------|------|
| **阶段 1** | 创建 templates/ 目录 | `hivelaunch/templates/` |
| **阶段 2** | 实现每个场景模板 | 12 个模板子目录 |
| **阶段 3** | 更新 F4 脚手架配置 | 模板注册表指向 templates/ |
| **阶段 4** | 编写每个模板的 CLAUDE.md | AI 开发规则 |

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [场景列表.md](./场景列表.md) | 12 个场景的详细描述和市场需求 |
| [场景初始化技术方案.md](./场景初始化技术方案.md) | 每个场景的技术栈 + 官方 CLI |
| [技术栈Review报告.md](./技术栈Review报告.md) | 2025 最佳实践验证 |

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2025-03-08 | 初始版本，完成全部 12 个场景调研 |
| 2025-03-08 | 确定模板放在 hivelaunch/templates/ 下 |
