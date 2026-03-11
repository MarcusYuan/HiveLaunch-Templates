# {{DISPLAY_NAME}} - AI 开发规则

> 本文档为 Claude Code 等 AI 助手提供开发指南

---

## 技术栈

- **框架**: Tauri v2
- **前端**: React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **状态**: Zustand 5
- **数据**: TanStack Query 5
- **路由**: React Router 7
- **后端**: Rust

---

## 项目结构

```
src/
├── components/         # React 组件
├── pages/             # 页面组件
├── hooks/             # React Hooks
├── lib/               # 工具函数
├── services/          # Tauri API 封装
├── stores/            # Zustand stores
├── types/             # TypeScript 类型
├── App.tsx            # 根组件
└── main.tsx           # 入口文件

src-tauri/
├── src/
│   ├── main.rs        # Rust 入口
│   └── commands/      # Tauri 命令
├── Cargo.toml
└── tauri.conf.json
```

---

## Tauri 命令规范

### Rust 端

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 前端调用

```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke<string>('greet', { name: 'World' });
```

---

## 常用 Tauri API

### 文件系统

```typescript
import { readFile, writeFile } from '@tauri-apps/plugin-fs';

// 读取文件
const contents = await readFile('path/to/file.txt');

// 写入文件
await writeFile('path/to/file.txt', 'content');
```

### 对话框

```typescript
import { open, save } from '@tauri-apps/plugin-dialog';

// 打开文件对话框
const file = await open({
  multiple: false,
  filters: [{ name: 'Text', extensions: ['txt'] }]
});

// 保存文件对话框
const path = await save({
  defaultPath: 'untitled.txt'
});
```

### 通知

```typescript
import { sendNotification } from '@tauri-apps/plugin-notification';

await sendNotification({
  title: 'Notification',
  body: 'This is a notification'
});
```

---

## 窗口管理

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

const window = getCurrentWindow();

// 最小化
await window.minimize();

// 最大化
await window.maximize();

// 关闭
await window.close();
```

---

## 状态管理

### Zustand Store

```typescript
// src/stores/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

## 禁止事项

1. ❌ 禁止使用 `any` 类型
2. ❌ 禁止在前端直接使用 Node.js API
3. ❌ 禁止在 Rust 中使用 `unwrap()` (生产代码)
4. ❌ 禁止硬编码文件路径
5. ❌ 禁止在前端暴露敏感信息

---

## Rust 最佳实践

### 错误处理

```rust
// ✅ 推荐: 使用 Result
#[tauri::command]
fn read_config() -> Result<String, String> {
    std::fs::read_to_string("config.json")
        .map_err(|e| e.to_string())
}

// ❌ 避免: unwrap
fn bad() -> String {
    std::fs::read_to_string("config.json").unwrap()
}
```

### 命令参数

```rust
#[tauri::command]
fn process_file(
    path: String,
    options: Option<ProcessOptions>
) -> Result<ProcessResult, String> {
    // ...
}
```

---

## 测试规范

### Rust 测试

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!(greet("World"), "Hello, World!");
    }
}
```

### React 测试

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  await user.click(screen.getByRole('button'));
});
```

---

## 相关文档

- [Tauri v2 文档](https://v2.tauri.app/)
- [Tauri 插件](https://v2.tauri.app/plugin/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
