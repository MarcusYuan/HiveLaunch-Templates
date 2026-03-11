# {{DISPLAY_NAME}}

> CLI 工具 - oclif + TypeScript + Inquirer

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| oclif | 5.x | CLI 框架 |
| TypeScript | 5.x | 类型安全 |
| Inquirer | 11.x | 交互式输入 |
| @oclif/plugin-plugins | 5.x | 插件系统 |

---

## 目录结构

```
{{PROJECT_NAME}}/
├── src/
│   ├── commands/           # CLI 命令
│   │   ├── hello.ts
│   │   └── index.ts
│   ├── hooks/              # 生命周期 Hook
│   │   └── init.ts
│   ├── plugins/            # 插件
│   ├── utils/              # 工具函数
│   └── types/              # 类型定义
├── bin/                    # 可执行文件
│   └── run
├── test/                   # 测试
├── oclif.config.mjs       # oclif 配置
├── package.json.tmpl
└── CLAUDE.md
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地测试

```bash
./bin/run hello
# 或
./bin/run hello World
./bin/run hello World --verbose
```

### 链接本地包

```bash
npm link
```

---

## 使用方法

```bash
# 显示帮助
{{BIN_NAME}} --help

# 运行命令
{{BIN_NAME}} hello

# 带参数
{{BIN_NAME}} hello Alice
```

---

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md)

---

## 发布

```bash
# 构建
npm run build

# 发布到 npm
npm publish
```
