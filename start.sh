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

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
else
  echo "✅ 依赖已就绪"
fi

# 编译
echo "🔨 编译 TypeScript..."
npm run build

# 配置文件
if [ ! -f "config.yaml" ]; then
  cp config.example.yaml config.yaml
  echo "📝 已从 config.example.yaml 创建 config.yaml，请按需修改"
fi

# 启动
echo "🚀 启动 auth2api..."
echo "   地址: http://127.0.0.1:8317"
echo ""
node dist/index.js "$@"
