#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== AI算命大全 停止脚本 ==="

stop_port() {
    local port=$1
    local label=$2

    pids=$(ss -tlnp | grep ":${port} " | grep -oP 'pid=\K[0-9]+' | sort -u)

    if [ -z "$pids" ]; then
        echo "[$label] Not running (port $port)."
        return 0
    fi

    for pid in $pids; do
        echo "[$label] Stopping (PID: $pid, port: $port)..."
        kill $pid
    done

    for i in $(seq 1 10); do
        sleep 0.5
        if ! ss -tlnp | grep -q ":${port} "; then
            echo "[$label] Stopped."
            return 0
        fi
    done

    echo "[$label] Force killing..."
    for pid in $pids; do
        kill -9 $pid
    done
    sleep 1

    if ss -tlnp | grep -q ":${port} "; then
        echo "[$label] ERROR: Failed to stop process on port $port."
        return 1
    fi

    echo "[$label] Stopped (force)."
}

stop_port 3000 "Backend"
stop_port 5174 "Frontend"

echo ""
echo "=== All services stopped ==="
