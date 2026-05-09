# auth2api

## 项目基础信息

- **技术栈**：TypeScript / Node.js (Express)
- **最低支持版本**：Node 20

## 项目结构

```
src/
├── index.ts          # 入口
├── server.ts         # Express 服务器
├── config.ts         # 配置加载
├── accounts/         # 账户管理
├── auth/             # OAuth 认证
├── handlers/         # 请求处理器
├── providers/        # Provider 实现
├── upstream/         # 上游 API 调用
└── utils/            # 工具函数
tests/                # 测试
```

## 开发协议

本项目在 Claude Code 侧使用 `./.claude/skills/protocol-dev/` 作为通用开发协议 skill，使用 `./.claude/skills/repo-detach-reset/` 处理克隆仓库去关联与历史重置场景。生成提交信息时必须遵循 `protocol-dev` 的 commit 规范。

### 关键约束

- 任何代码变更需求，必须先给方案，等待用户明确授权后才能执行
- 仓库去关联/重置类破坏性操作（如删除历史、切断 remote）必须先给方案，明确风险与回滚点，等待用户授权后执行
- 克隆仓库 DIY 时必须先做 License 检查；许可证义务不明确时默认不删除许可证与版权声明
- 去关联操作必须隔离原工作流与部署链路，禁止将部署任务误触发到原作者仓库或原命名空间
- 禁止使用 `rm` 删除文件，必须使用 `trash`
- `git commit` 流程：先输出 commit 信息供用户审核，用户确认后再执行提交，提交内容必须与展示内容完全一致，禁止附加任何辅助编程标识信息（如 Co-Authored-By 等）
- 禁止使用 Markdown 表格
- `git worktree` 规范：新建 worktree 时，必须将工作树创建在项目同级目录下，目录名格式为 `{项目名}--{分支名}`（分支名中的 `/` 替换为 `-`）。例如项目为 `my-app`，分支为 `feat/login`，则 worktree 路径为 `../my-app--feat-login/`。禁止使用默认的 `.git/worktrees` 或项目内部路径
