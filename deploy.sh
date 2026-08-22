#!/bin/bash
# 生产部署脚本：构建前端 + 后端，启动单端口生产服务
# 生产模式由后端 Express 直接托管前端构建产物（/api 为 API，其余路径为前端页面）
# 用法：./deploy.sh            # 默认端口 3000
#       PORT=8080 ./deploy.sh  # 自定义端口
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3000}"

echo "=== AI算命大全 生产部署 ==="

echo "[1/4] 停止现有服务..."
"$SCRIPT_DIR/stop.sh"

echo ""
echo "[2/4] 构建后端..."
(cd "$SCRIPT_DIR/tianji-server" && npm install --no-audit --no-fund && npm run build)

echo ""
echo "[3/4] 构建前端..."
(cd "$SCRIPT_DIR/tianji-app" && npm install --no-audit --no-fund && npm run build)

echo ""
echo "[4/4] 启动生产服务（端口 $PORT）..."
cd "$SCRIPT_DIR/tianji-server"
PORT="$PORT" nohup node dist/index.js > /tmp/tianji-prod.log 2>&1 &
echo "[Prod] PID: $!"

echo "[Prod] Waiting for startup..."
for i in $(seq 1 30); do
    if curl -s "http://localhost:$PORT/api/health" 2>/dev/null | grep -q '"status":"ok"'; then
        echo "[Prod] Ready."
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[Prod] ERROR: Failed to start on port $PORT."
        echo "--- Last 30 lines from prod log ---"
        tail -n 30 /tmp/tianji-prod.log
        exit 1
    fi
    sleep 1
done

echo ""
echo "=== 生产服务已启动 ==="
echo "统一入口: http://localhost:$PORT （根路径即首页，/api 为后端接口）"
