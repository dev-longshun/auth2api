#!/bin/bash
set -e

cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node &>/dev/null; then
  echo "❌ 未找到 Node.js，请先安装 Node.js 20+"
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "❌ Node.js 版本过低 ($(node -v))，需要 20+"
  exit 1
fi

# 安装后端依赖
if [ ! -d "node_modules" ]; then
  echo "📦 安装后端依赖..."
  npm install
else
  echo "✅ 后端依赖已就绪"
fi

# 编译后端
echo "🔨 编译后端 TypeScript..."
npm run build

# 构建前端（如果 admin-ui 目录存在）
if [ -d "admin-ui" ]; then
  if [ ! -d "admin-ui/node_modules" ]; then
    echo "📦 安装前端依赖..."
    (cd admin-ui && npm install)
  fi
  echo "🎨 构建 Admin UI..."
  (cd admin-ui && npm run build)
fi

# 配置文件
if [ ! -f "config.yaml" ]; then
  cp config.example.yaml config.yaml
  echo "📝 已从 config.example.yaml 创建 config.yaml，请按需修改"
fi

# 启动
echo "🚀 启动 auth2api..."
echo "   API:      http://127.0.0.1:8317"
echo "   Admin UI: http://127.0.0.1:8317/admin-ui/"
echo ""
node dist/index.js "$@"
