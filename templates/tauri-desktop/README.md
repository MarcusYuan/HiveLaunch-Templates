# Tauri 桌面应用模板

> 基于 Tauri v2 + React 19 + TypeScript + Tailwind CSS

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Tauri | v2 | Rust 后端 + Web 前端 |
| React | 19 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式 |
| Zustand | 5.x | 状态管理 |
| TanStack Query | 5.x | 数据获取 |
| React Router | 7.x | 路由 |

---

## Tauri 插件

| 插件 | 功能 |
|------|------|
| shell | Shell 命令执行 |
| dialog | 原生对话框 |
| fs | 文件系统 |
| store | 持久化存储 |
| notification | 系统通知 |

---

## 目录结构

```
tauri-desktop/
├── src/                    # React 前端
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
├── CLAUDE.md
├── package.json.tmpl
├── tsconfig.json
├── vite.config.ts
└── template.json
```

---

## 变量替换

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{PROJECT_NAME}}` | 项目名称 | `my-desktop-app` |
| `{{DISPLAY_NAME}}` | 显示名称 | `My Desktop App` |
| `{{BUNDLE_ID}}` | Bundle ID | `com.company.myapp` |

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm tauri:dev

# 构建生产版
pnpm tauri:build

# 仅构建前端
pnpm build
```

---

## 环境要求

- Node.js 18+
- pnpm 9+
- Rust 1.70+
- 系统依赖 (参考 Tauri 官方文档)
