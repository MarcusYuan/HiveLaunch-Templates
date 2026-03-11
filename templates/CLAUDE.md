# Templates 目录规则（最终版）

**语言**: 中文  
**统一协议版本**: `2.0`（`index.json` 与 `template.json` 均使用同一版本语义）

---

## 1. 目标与边界

`templates/` 是 HiveLaunch 的模板真源目录，用于管理项目初始化资产与能力声明。

- 真源原则：模板真实内容仅保存在 Git 仓库
- 单仓原则：当前模板统一存放在 `hivelaunch/templates/`
- 索引原则：数据库只保存索引与快照，不保存模板正文
- 扩展原则：协议必须支持多执行器、多 Agent 包
- 分发原则：运行时优先远程索引，失败后回退本地目录

---

## 2. 目录结构规范

每个模板目录必须为 `kebab-case`，并至少包含：

```text
templates/{template-id}/
├── template.json
├── CLAUDE.md
├── README.md
└── ... 模板源码与配置文件
```

模板根目录必须包含：

```text
templates/
├── index.json
├── CLAUDE.md
└── {template-id}/...
```

强制要求：

- `{template-id}` 必须与 `template.json.id` 一致
- `template.json` 是模板元数据唯一入口
- 模板正文资产在模板目录内管理，不在数据库中长期冗余
- 模板可包含 `.opencode/`、`.claude/`、`AGENTS.md`、`mcp.json` 等初始化资产

---

## 3. index.json 协议（2.0）

`templates/index.json` 负责模板发现与入口声明，示例：

```json
{
  "schema_version": "2.0",
  "version": "2026-03-10.1",
  "signature": "",
  "source": {
    "repo_url": "https://github.com/MarcusYuan/HiveLaunch-Templates",
    "default_ref": "main"
  },
  "templates": [
    {
      "id": "ai-web-app",
      "manifest_path": "templates/ai-web-app/template.json"
    }
  ]
}
```

字段规则：

- `schema_version`：必填，固定 `2.0`
- `version`：索引发布版本，用于缓存识别与展示
- `signature`：签名占位字段，后续用于完整性校验
- `source.repo_url`：默认模板来源仓库
- `source.default_ref`：默认分支或 tag
- `templates[].id`：模板唯一标识
- `templates[].manifest_path`：manifest 相对仓库根路径
- `templates[].source`：可选覆盖源，未配置时继承根 `source`

---

## 4. template.json 协议（2.0）

`template.json` 必须声明 `schema_version: "2.0"`，示例：

```json
{
  "schema_version": "2.0",
  "id": "ai-web-app",
  "name": "AI Web App",
  "description": "模板描述",
  "category": "web",
  "phase": 1,
  "source": {
    "repo_url": "https://github.com/MarcusYuan/HiveLaunch-Templates",
    "template_path": "templates/ai-web-app",
    "default_ref": "main",
    "mirrors": [
      "https://github.com/MarcusYuan/HiveLaunch-Templates"
    ]
  },
  "variables": [],
  "runtimes": [],
  "agent_packs": [],
  "defaults": {
    "runtime_id": "opencode",
    "agent_pack_id": "default-pack"
  },
  "recommended_swarms": [],
  "post_clone_script": []
}
```

字段规则：

- `schema_version`：必填，固定 `2.0`
- `id/name/description/category/phase`：模板基础元信息
- `source.repo_url`：建议必填，未配置时继承索引源
- `source.template_path`：建议必填，未配置时由 `manifest_path` 推导
- `source.default_ref`：建议必填，未配置时继承索引默认 ref
- `source.mirrors[]`：可选镜像仓库地址
- `variables[]`：初始化变量定义与校验规则
- `runtimes[]`：执行器能力声明，至少一个
- `agent_packs[]`：Agent 包声明，至少一个
- `defaults`：必须引用存在的 `runtime_id` 与 `agent_pack_id`
- `recommended_swarms[]`：仅声明蜂群 ID，不包含蜂群完整配置
- `post_clone_script[]`：克隆后可执行脚本

---

## 5. 蜂群与模板的数据边界

模板负责声明：

- 可复现的默认能力与资产引用（运行时、Agent 包、规则文档、配置文件）
- 变量、默认执行器、默认 Agent 包、推荐蜂群关系

数据层负责保存：

- 用户在创建项目时的能力开关与覆盖值
- 项目绑定、使用计数、运行状态、快照引用

禁止边界漂移：

- 禁止把模板正文作为数据库主存储
- 禁止让数据库字段成为模板能力真源
- 禁止在 `recommended_swarms` 中内嵌蜂群完整配置

---

## 6. 远程加载与回退规则

加载顺序：

1. 读取环境变量 `BEE_TEMPLATE_INDEX_URL`（若配置）
2. 依次尝试默认索引地址（GitHub Raw / Gitee Raw）
3. 远程失败时回退本地 `templates/`

接口返回约束：

- `/api/templates` 与 `/api/templates/:template_id` 必须返回 `sourceVersion`
- `sourceVersion` 优先使用 `index.json.version`
- 若缺失 `version`，可回退使用 HTTP `ETag`
- 本地回退模式应返回可识别来源值（如 `local-index`、`local-filesystem`）

---

## 7. 数据库存储约束

数据库只允许保存：

- 模板索引：`template_id`、`name`、`category`、`phase`、`source_ref`
- 能力索引：`runtime_ids`、`agent_pack_ids`
- 项目快照：`template_id + source_ref + schema_version + runtime_id + agent_pack_id + swarm_template_id`

数据库不保存：

- 模板源码
- 模板完整 `CLAUDE.md` / `AGENTS.md` 文本
- skills、mcp 文件正文

---

## 8. 项目创建与快照复现

创建项目时必须固化模板快照：

- 固化字段：`template_id`、`source_ref`、`schema_version`
- 初始化内容来自该快照对应模板文件
- 模板后续更新不得影响已创建项目

---

## 9. 变更流程

模板变更必须走 Git 流程：

1. 更新模板目录内容、`template.json`、`templates/index.json`
2. 在 PR 说明 schema 兼容性与迁移策略
3. 涉及破坏性变更时提升 `schema_version`
4. 合并后由模板索引同步流程更新数据库索引

---

## 10. 禁止事项

- 禁止在 `template.json` 写死仅单执行器可用的全局结构
- 禁止把模板大文本直接冗余存入数据库
- 禁止在模板路径引用中使用绝对路径
- 禁止模板 id 与目录名不一致
- 禁止新增模板却不更新 `templates/index.json`
