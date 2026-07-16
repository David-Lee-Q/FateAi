#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INTERVAL="${1:-300}"

echo "=== AI算命大全 守护进程 ==="
echo "检查间隔: ${INTERVAL}s"
echo "PID: $$"
echo ""

LAST_STATUS="unknown"

while true; do
    START_TIME=$(date +%s)

    BACKEND_OK=false
    FRONTEND_OK=false

    if ss -tlnp | grep -q ":3000 "; then
        BACKEND_OK=true
    fi

    if ss -tlnp | grep -q ":5174 "; then
        FRONTEND_OK=true
    fi

    CURRENT_STATUS="$BACKEND_OK-$FRONTEND_OK"
    HEALTHY=false
    if $BACKEND_OK && $FRONTEND_OK; then
        HEALTHY=true
    fi

    if [ "$CURRENT_STATUS" != "$LAST_STATUS" ]; then
        echo "[$(date '+%H:%M:%S')] 状态变更：后端=$BACKEND_OK 前端=$FRONTEND_OK"

        if $HEALTHY; then
            echo "[$(date '+%H:%M:%S')] 服务已恢复，发送正常报告..."
        else
            echo "[$(date '+%H:%M:%S')] 服务异常，发送告警报告..."
        fi

        "$SCRIPT_DIR/check-process.sh"
        LAST_STATUS="$CURRENT_STATUS"
    fi

    END_TIME=$(date +%s)
    ELAPSED=$((END_TIME - START_TIME))
    SLEEP_TIME=$((INTERVAL - ELAPSED))
    if [ "$SLEEP_TIME" -lt 1 ]; then
        SLEEP_TIME=1
    fi

    sleep "$SLEEP_TIME"
done
