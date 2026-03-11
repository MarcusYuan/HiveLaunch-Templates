# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南
>
> **模板变量**: 项目使用 `{{PROJECT_NAME}}`、`{{DISPLAY_NAME}}`、`{{VERSION}}` 占位符，在项目初始化时由 HiveLaunch 替换。

---

## 项目技术栈

- **引擎**: Phaser 3 (CE 社区版)
- **语言**: TypeScript
- **打包**: Vite
- **状态**: Zustand (游戏外状态)

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 场景 | PascalCase | `BootScene.ts`, `GameScene.ts` |
| 实体 | PascalCase | `Player.ts`, `Enemy.ts` |
| 组件 | PascalCase | `HealthBar.ts`, `Weapon.ts` |
| 工具 | camelCase | `gameUtils.ts`, `physics.ts` |
| 类型 | PascalCase | `GameState.ts`, `EntityConfig.ts` |

### 代码命名

```typescript
// 场景: PascalCase + Scene
export class BootScene extends Phaser.Scene { }

// 实体: PascalCase
export class Player extends Phaser.Physics.Arcade.Sprite { }

// 预制件: PascalCase + Factory
Phaser.GameObjects.Factory.register('player', Player);
```

---

## 目录结构

```
h5-game/
├── src/
│   ├── scenes/              # Phaser 场景
│   │   ├── BootScene.ts    # 初始化场景
│   │   ├── PreloadScene.ts # 资源预加载
│   │   ├── GameScene.ts    # 主游戏逻辑
│   │   └── UIScene.ts      # UI 层
│   ├── entities/            # 游戏实体
│   │   └── Player.ts       # 玩家实体
│   ├── components/          # 游戏组件（扩展）
│   │   ├── HealthBar.ts
│   │   └── Weapon.ts
│   ├── ui/                 # UI 组件（扩展）
│   │   ├── ScoreBoard.ts
│   │   └── GameOver.ts
│   ├── stores/              # 状态管理（扩展）
│   │   └── gameStore.ts
│   ├── utils/               # 工具函数（扩展）
│   │   ├── physics.ts
│   │   └── config.ts
│   ├── types/               # 类型定义（扩展）
│   │   └── index.ts
│   ├── game.ts              # Phaser 游戏配置
│   └── main.ts              # Web 入口
├── public/                  # 静态资源（部署时）
│   └── assets/              # 图片、音频等资源
├── index.html               # HTML 入口
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── package.json.tmpl        # 包管理模板
├── template.json            # 模板元数据
└── CLAUDE.md               # 本开发指南
```

> **扩展说明**：以上目录为完整结构。基础模板仅包含核心文件（scenes、entities），可根据项目需求逐步添加 components、ui、stores、utils、types 目录。

---

## Phaser 场景

### 场景生命周期

```typescript
export class GameScene extends Phaser.Scene {
  // 1. 初始化
  constructor() {
    super({ key: 'GameScene' });
  }

  // 2. 预加载资源
  preload() {
    this.load.image('player', 'assets/player.png');
  }

  // 3. 创建对象
  create() {
    this.player = this.physics.add.sprite(400, 300, 'player');
  }

  // 4. 每帧更新 (60fps)
  update(time: number, delta: number) {
    // 游戏逻辑
  }
}
```

---

## 物理系统

### Arcade 物理

Phaser 3 默认启用 Arcade 物理系统，无需额外配置：

```typescript
// 在 Game Config 中启用物理（可选，默认已启用）
const config: Phaser.Types.Core.GameConfig = {
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

// 碰撞
this.physics.add.collider(player, platforms);
this.physics.add.overlap(player, collectibles, collectCallback);

// 跳跃
if (cursors.up.isDown && player.body.touching.down) {
  player.setVelocityY(-330);
}
```

---

## 状态管理

### Zustand (游戏外状态)

```typescript
// stores/gameStore.ts
import { create } from 'zustand';

interface GameState {
  score: number;
  lives: number;
  isPaused: boolean;
  addScore: (points: number) => void;
  loseLife: () => void;
  togglePause: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  lives: 3,
  isPaused: false,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  loseLife: () => set((state) => ({ lives: state.lives - 1 })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在 update 中创建新对象 (预先创建对象池)
4. ❌ 禁止在 update 中加载资源 (在 preload 中完成)
5. ❌ 生产环境禁止使用 `console.log` (开发调试时可用)

---

## 性能优化

### 资源加载优化

| 优化项 | 说明 |
|--------|------|
| 懒加载 | 按需加载非关键资源 |
| 资源压缩 | 图片使用 WebP、音频使用 Audio Sprites |
| 分场景加载 | 不同场景使用不同的资源集合 |
| 预加载策略 | loading 界面与进度管理 |

### 渲染性能优化

```typescript
// 启用 WebGL 渲染器（默认）
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  // 视口剔除：只渲染可见区域的对象
  render: {
    powerPreference: 'high-performance',
  },
};
```

### 内存管理

| 规则 | 说明 |
|------|------|
| 对象池 | 预创建对象，避免运行时频繁创建销毁 |
| 资源释放 | 场景切换时正确销毁与释放资源 |
| 监控工具 | 使用 Chrome DevTools 监控内存泄漏 |

### 对象池示例

```typescript
class BulletPool {
  private pool: Phaser.GameObjects.Image[] = [];

  constructor(private scene: Phaser.Scene) {
    // 预先创建对象池
    for (let i = 0; i < 50; i++) {
      const bullet = this.scene.add.image(0, 0, 'bullet');
      bullet.setActive(false).setVisible(false);
      this.pool.push(bullet);
    }
  }

  get(): Phaser.GameObjects.Image | null {
    const bullet = this.pool.find(b => !b.active);
    if (bullet) {
      bullet.setActive(true).setVisible(true);
    }
    return bullet || null;
  }

  release(bullet: Phaser.GameObjects.Image): void {
    bullet.setActive(false).setVisible(false);
  }
}
```

---

## 移动端适配

### 触摸事件处理

```typescript
// 触摸点击
this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
  // 处理触摸事件
});

// 虚拟摇杆（推荐使用插件或自定义实现）
```

### 响应式设计

```typescript
// 自适应画布尺寸
const config: Phaser.Types.Core.GameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
};
```

### 移动端优化要点

| 优化项 | 说明 |
|--------|------|
| 触摸响应 | 优先使用 touch 事件，避免 300ms 延迟 |
| 按钮尺寸 | 移动端按钮尺寸不小于 44x44 像素 |
| 横竖屏 | 明确游戏支持的屏幕方向 |
| 性能目标 | 稳定 60 FPS，控制在 30 FPS 以上 |

---

## 用户界面与交互

### UI 组件模式

```typescript
// 独立的 UI 场景
export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // 始终保持在最上层
    this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
    });
  }
}
```

### 输入系统

| 输入方式 | 适用场景 |
|----------|----------|
| 键盘 | PC 浏览器开发 |
| 触摸 | 移动端浏览器 |
| 虚拟按键 | 移动端游戏操作 |

### 视觉反馈

- 粒子效果：爆炸、击中、拾取
- 屏幕震动：冲击感反馈
- 音效同步：音频与视觉协调

---

## 测试与调试

### Debug 模式配置

```typescript
const config: Phaser.Types.Core.GameConfig = {
  physics: {
    arcade: {
      debug: true, // 显示碰撞盒
    },
  },
};
```

### Chrome DevTools 性能分析

| 工具 | 用途 |
|------|------|
| Performance | 分析帧率、脚本执行时间 |
| Memory | 追踪内存泄漏 |
| Network | 监控资源加载 |

### 常见问题排查

| 问题 | 排查方法 |
|------|----------|
| 白屏 | 检查资源路径、加载失败 |
| 卡顿 | 分析主线程阻塞、减少 draw call |
| 内存泄漏 | 检查对象未正确销毁 |

---

## 设计模式

### GameObjectFactory 模式

```typescript
// 注册自定义工厂方法
Phaser.GameObjects.Factory.register('player', function (
  this: Phaser.Scene,
  x: number,
  y: number,
  texture: string
) {
  return new Player(this, x, y, texture);
});

// 使用
const player = this.add.player(100, 300, 'player');
```

### 状态模式

适用于 AI 行为和玩家状态切换：

```typescript
interface State {
  enter(): void;
  update(): void;
  exit(): void;
}

class IdleState implements State { /* ... */ }
class WalkState implements State { /* ... */ }
class JumpState implements State { /* ... */ }
```

### 依赖注入

解耦游戏组件，提升可测试性：

```typescript
class GameContainer {
  private services: Map<string, unknown> = new Map();

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  get<T>(key: string): T {
    return this.services.get(key) as T;
  }
}
```

---

## 进阶主题

### 多人游戏

- WebSocket 实时通信
- 房间系统管理
- 延迟补偿机制

### 音效管理

```typescript
// 音频精灵（Audio Sprites）
this.load.audioSprite('sfx', 'assets/sfx.json', [
  'assets/sfx.ogg',
  'assets/sfx.mp3',
]);

// 播放音效
this.sound.playAudioSprite('sfx', 'jump');
```

### 国际化

- 文案与资源配置分离
- 中文字体动态加载
- 日期与数字本地化

---

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 配置文件

### vite.config.ts

Vite 构建配置，定义入口文件和输出目录。

### tsconfig.json

TypeScript 配置，确保严格类型检查。

### template.json

模板元数据，定义项目初始化时的变量（PROJECT_NAME、DISPLAY_NAME、VERSION）。

---

## 相关文档

- [Phaser 3 文档](https://newdocs.phaser.io/)
- [Phaser 3 CE](https://phaser.io/phaser3)
