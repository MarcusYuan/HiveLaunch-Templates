# {{DISPLAY_NAME}}

> H5 游戏 - Phaser 3 + TypeScript

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Phaser 3 CE | 3.70.x | 2D 游戏引擎 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Zustand | 5.x | 状态管理 |

---

## 目录结构

```
{{PROJECT_NAME}}/
├── src/
│   ├── scenes/              # Phaser 场景
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── GameScene.ts
│   │   └── UIScene.ts
│   ├── entities/            # 游戏实体
│   ├── components/          # 游戏组件
│   ├── ui/                  # UI 组件
│   ├── stores/              # 状态管理
│   ├── utils/               # 工具函数
│   ├── types/               # 类型定义
│   ├── game.ts              # 游戏入口
│   └── main.ts              # Web 入口
├── public/
│   └── assets/              # 图片、音频等
├── vite.config.ts
├── index.html
├── package.json.tmpl
└── CLAUDE.md
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

---

## 游戏场景

1. **BootScene** - 初始化
2. **PreloadScene** - 预加载资源
3. **GameScene** - 主游戏逻辑
4. **UIScene** - UI 层

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)

---

## 发布

将 `dist` 目录部署到任何静态服务器即可。
