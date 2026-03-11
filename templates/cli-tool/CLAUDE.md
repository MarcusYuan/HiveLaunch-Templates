# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 项目技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| oclif | 5.x | CLI 框架 (Open CLI Framework) |
| TypeScript | 5.x | 类型安全 (ESM 推荐) |
| Inquirer | 11.x | 交互式输入 |
| @oclif/plugin-plugins | 5.x | 插件系统 |

---

## 项目初始化

### 使用 oclif 生成器

```bash
# 全局安装 oclif
npm install -g oclif

# 创建新 CLI 项目
oclif generate my-cli

# 或使用 oclif init (更轻量)
oclif init
```

生成器支持以下选项：
- `--module-type ESM|CommonJS` - 推荐 ESM
- `--package-manager npm|yarn|pnpm` - 推荐 pnpm
- `--topic-separator colons|spaces` - 命令分隔符

---

## 命名规范

### 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 命令 | kebab-case | `src/commands/hello.ts` |
| Hook | kebab-case | `src/hooks/init.ts` |
| 插件 | kebab-case | `src/plugins/*` |
| 工具 | camelCase | `src/utils/logger.ts` |
| 类型 | PascalCase | `src/types/index.ts` |

### 代码命名

```typescript
// 命令: PascalCase + Command
export default class HelloCommand extends Command {
  static args = [{ name: 'name' }];
  async run() { ... }
}

// 标志: kebab-case
static flags = {
  verbose: Flags.boolean({ char: 'v' }),
};
```

---

## 目录结构

```
cli-tool/
├── src/
│   ├── commands/           # CLI 命令
│   │   ├── hello.ts
│   │   └── index.ts
│   ├── hooks/              # 生命周期 Hook
│   │   └── init.ts
│   ├── plugins/            # 插件
│   ├── utils/              # 工具函数
│   │   ├── logger.ts
│   │   └── config.ts
│   └── types/              # 类型定义
├── bin/                    # 可执行文件
│   └── run
├── test/                   # 测试
├── CLAUDE.md
├── package.json.tmpl
├── tsconfig.json
└── oclif.config.mjs
```

---

## 命令开发

### 基本命令

```typescript
// src/commands/hello.ts
import { Command, Args, Flags } from '@oclif/core';

export default class HelloCommand extends Command {
  static description = 'Say hello';

  static args = {
    name: Args.string({ description: 'Name to greet' }),
  };

  static flags = {
    verbose: Flags.boolean({ char: 'v', description: 'Verbose output' }),
  };

  async run() {
    const { args, flags } = await this.parse(HelloCommand);
    
    if (flags.verbose) {
      this.log('Running in verbose mode');
    }
    
    this.log(`Hello, ${args.name || 'World'}!`);
  }
}
```

### 子命令

```typescript
// src/commands/greet/index.ts
export default class GreetCommand extends Command {
  static description = 'Greeting commands';
  
  static aliases = ['g'];
  
  async run() {
    this.log('Use: mycli greet:formal or mycli greet:casual');
  }
}
```

---

## 交互式输入

### 使用 Inquirer

```typescript
import inquirer from 'inquirer';

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-project',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: ['React', 'Vue', 'Angular'],
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true,
    },
  ]);
  
  return answers;
}
```

---

## 配置管理

### 使用 oclif config

```typescript
import { Config } from '@oclif/core';

const config = await Config.load();

// 读取配置
const debug = config.configDir;

// 写入配置
await config.set('key', 'value');
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止使用 `@ts-ignore`
3. ❌ 禁止在命令中直接 `process.exit` (使用 `this.exit`)
4. ❌ 禁止使用 `console.log` (使用 `this.log`)
5. ❌ 禁止在命令中同步长时间操作 (使用 async/await)
6. ❌ 禁止直接在命令中调用其他命令 (应提取为共享模块)
7. ❌ 禁止忽略命令解析错误

---

## 最佳实践

### 命令结构

```typescript
import { Command, Args, Flags } from '@oclif/core';

export default class HelloCommand extends Command {
  static description = 'Say hello';

  static examples = [
    '$ mycli hello',
    '$ mycli hello World --verbose',
  ];

  static args = {
    name: Args.string({ description: 'Name to greet', required: false }),
  };

  static flags = {
    verbose: Flags.boolean({ char: 'v', description: 'Verbose output' }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(HelloCommand);
    
    if (flags.verbose) {
      this.log('Running in verbose mode');
    }
    
    this.log(`Hello, ${args.name || 'World'}!`);
  }
}
```

### 错误处理

```typescript
import { Command, Errors } from '@oclif/core';

export default class MyCommand extends Command {
  async run(): Promise<void> {
    try {
      await this.doSomething();
    } catch (error) {
      if (error instanceof Errors.CLIError) {
        this.error(error.message, { exit: error.exitCode });
      }
      this.error('Unexpected error occurred', { exit: 1 });
    }
  }
}
```

### 共享代码模块

将命令逻辑提取为独立模块，避免直接调用命令类：

```typescript
// src/utils/config.ts
export function getConfig(): Config {
  // 业务逻辑
  return config;
}

// src/commands/config/list.ts
import { Command } from '@oclif/core';
import { getConfig } from '../../utils/config';

export default class ConfigList extends Command {
  async run(): Promise<void> {
    const config = getConfig();
    this.log(JSON.stringify(config, null, 2));
  }
}
```

### 性能优化

```typescript
// 启用性能追踪
import { settings } from '@oclif/core';
settings.performanceEnabled = true;
```

### Inquirer 交互最佳实践

```typescript
import inquirer from 'inquirer';

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-project',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Project name cannot be empty';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: ['React', 'Vue', 'Angular'],
      default: 'React',
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true,
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your API token:',
      mask: '*',
    },
  ]);
  
  return answers;
}
```

### 插件开发

```typescript
// src/plugins/my-plugin/index.ts
import { Plugin } from '@oclif/core';

export default class MyPlugin extends Plugin {
  async init(): Promise<void> {
    // 插件初始化
  }
}
```

---

## 开发命令

```bash
# 本地测试
./bin/run hello

# 链接本地包
npm link

# 发布
npm publish

# 构建
npm run build
```

---

## 相关文档

- [oclif 文档](https://oclif.io/docs)
- [Inquirer 文档](https://github.com/SBoudrias/Inquirer.js)
