#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/tianji-app"
BACKEND_DIR="$SCRIPT_DIR/tianji-server"

echo "=== AI算命大全 启动脚本 ==="

echo "[Stop] Stopping existing services..."
"$SCRIPT_DIR/stop.sh"

echo ""
echo "[Clean] Cleaning build caches..."
rm -rf "$FRONTEND_DIR/node_modules/.vite"
rm -rf "$FRONTEND_DIR/dist"
rm -rf "$BACKEND_DIR/dist"

echo ""
echo "[Install] Installing dependencies..."
echo "[Install] Frontend..."
cd "$FRONTEND_DIR"
npm install
echo "[Install] Backend..."
cd "$BACKEND_DIR"
npm install

echo ""
echo "[Backend] Starting on port 3000..."
cd "$BACKEND_DIR"
nohup npm run dev > /tmp/tianji-server.log 2>&1 &
echo "[Backend] PID: $!"

echo "[Backend] Waiting for startup..."
for i in $(seq 1 30); do
    if ss -tlnp | grep -q ":3000 "; then
        echo "[Backend] Ready."
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[Backend] ERROR: Failed to start on port 3000."
        echo "--- Last 30 lines from server log ---"
        tail -n 30 /tmp/tianji-server.log
        exit 1
    fi
    sleep 1
done

echo ""
echo "[Frontend] Starting on port 5174..."
cd "$FRONTEND_DIR"
nohup npm run dev > /tmp/tianji-app.log 2>&1 &
echo "[Frontend] PID: $!"

echo "[Frontend] Waiting for startup..."
for i in $(seq 1 30); do
    if ss -tlnp | grep -q ":5174 "; then
        echo "[Frontend] Ready."
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[Frontend] ERROR: Failed to start on port 5174."
        echo "--- Last 30 lines from frontend log ---"
        tail -n 30 /tmp/tianji-app.log
        exit 1
    fi
    sleep 1
done

echo ""
echo "=== All services started ==="
echo "Frontend: http://localhost:5174"
echo "Backend:  http://localhost:3000"

echo ""
echo "[Report] 发送进程检查报告到飞书..."
"$SCRIPT_DIR/check-process.sh"
