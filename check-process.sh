#!/bin/bash

WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/a66b7037-23f3-4e15-920c-d83d77a3a017"
CHECK_TIME=$(date '+%Y-%m-%d %H:%M:%S')
HOSTNAME=$(hostname)

send_feishu() {
    local title="$1"
    local content="$2"
    local color="${3:-blue}"

    local content_json
    content_json=$(echo "$content" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))")

    local payload
    payload=$(cat <<EOF
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": { "tag": "plain_text", "content": "$title" },
      "template": "$color"
    },
    "elements": [
      { "tag": "markdown", "content": $content_json }
    ]
  }
}
EOF
)

    local response
    response=$(curl -s --max-time 10 -X POST "$WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "$payload")

    local code
    code=$(echo "$response" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print(d.get('StatusCode', d.get('code', -1)))" 2>/dev/null || echo "-1")

    echo "  [飞书] StatusCode=$code"
    if [ "$code" != "0" ] && [ "$code" != "-1" ]; then
        echo "  [飞书] 响应: $response"
    fi
}

check_service() {
    local port=$1
    local name=$2
    local health_url=$3

    local port_info pid status icon mem cpu_all mem_use mem_cmd
    port_info=$(ss -tlnp 2>/dev/null | grep ":${port} ")

    if [ -z "$port_info" ]; then
        status="down"
        icon="❌"
        pid="-"
        mem_use="N/A"
        mem_cmd="N/A"
    else
        status="up"
        icon="✅"
        pid=$(echo "$port_info" | grep -oP 'pid=\K[0-9]+' | head -1)

        mem_use="N/A"
        mem_cmd="N/A"
        if [ -n "$pid" ] && [ -f "/proc/$pid/status" ]; then
            mem_use=$(grep VmRSS /proc/$pid/status 2>/dev/null | awk '{printf "%.1fMB", $2/1024}')
            if [ -z "$mem_use" ]; then mem_use="N/A"; fi
            if [ -f "/proc/$pid/cmdline" ]; then
                mem_cmd=$(tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null | sed 's/ $//')
                if [ ${#mem_cmd} -gt 80 ]; then
                    mem_cmd="${mem_cmd:0:80}..."
                fi
            fi
        fi
    fi

    local http_code http_time
    if [ "$status" = "up" ] && [ -n "$health_url" ]; then
        local result
        result=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" --max-time 5 "$health_url" 2>/dev/null)
        http_code=$(echo "$result" | cut -d'|' -f1)
        http_time=$(echo "$result" | cut -d'|' -f2)
        if [ -z "$http_code" ]; then http_code="000"; fi
        if [ -z "$http_time" ]; then http_time="N/A"; else http_time="${http_time}s"; fi
    else
        http_code="-"
        http_time="-"
    fi

    echo "$name|$status|$icon|$pid|$mem_use|$http_code|$http_time|$mem_cmd"
}

BACKEND=$(check_service 3000 "后端" "http://localhost:3000/")
FRONTEND=$(check_service 5174 "前端" "http://localhost:5174/")

parse_field() { echo "$1" | cut -d'|' -f$2; }

B_STATUS=$(parse_field "$BACKEND" 2);  B_ICON=$(parse_field "$BACKEND" 3)
B_PID=$(parse_field "$BACKEND" 4);     B_MEM=$(parse_field "$BACKEND" 5)
B_HTTP=$(parse_field "$BACKEND" 6);    B_TIME=$(parse_field "$BACKEND" 7)
B_CMD=$(parse_field "$BACKEND" 8)

F_STATUS=$(parse_field "$FRONTEND" 2); F_ICON=$(parse_field "$FRONTEND" 3)
F_PID=$(parse_field "$FRONTEND" 4);    F_MEM=$(parse_field "$FRONTEND" 5)
F_HTTP=$(parse_field "$FRONTEND" 6);   F_TIME=$(parse_field "$FRONTEND" 7)
F_CMD=$(parse_field "$FRONTEND" 8)

MEM_USED=$(free -m 2>/dev/null | awk '/Mem:/ {printf "%.0f%%", $3/$2*100}')
[ -z "$MEM_USED" ] && MEM_USED="N/A"

CPU_LOAD="N/A"
if command -v top >/dev/null 2>&1; then
    CPU_LOAD=$(top -b -n 1 2>/dev/null | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if [ -n "$CPU_LOAD" ]; then CPU_LOAD="${CPU_LOAD}%"; else CPU_LOAD="N/A"; fi
fi

DISK_USED=$(df -h / 2>/dev/null | awk 'NR==2 {print $5}')
[ -z "$DISK_USED" ] && DISK_USED="N/A"

HEALTHY=true
[ "$B_STATUS" = "down" ] && HEALTHY=false
[ "$F_STATUS" = "down" ] && HEALTHY=false

echo "=== AI算命大全 进程检查报告 ==="
echo "检查时间: $CHECK_TIME"
echo "主机: $HOSTNAME"
echo ""
echo "后端 (3000): $([ "$B_STATUS" = "up" ] && echo "UP" || echo "DOWN") PID=$B_PID 内存=$B_MEM HTTP=$B_HTTP"
echo "前端 (5174): $([ "$F_STATUS" = "up" ] && echo "UP" || echo "DOWN") PID=$F_PID 内存=$F_MEM HTTP=$F_HTTP"
echo "系统: 内存=$MEM_USED CPU=$CPU_LOAD 磁盘=$DISK_USED"

if [ "$HEALTHY" = true ]; then
    COLOR="green"
    TITLE="[正常] AI算命大全 进程检查报告"
    OVERALL_TEXT="整体状态：一切正常"
else
    COLOR="red"
    TITLE="[异常] AI算命大全 进程检查报告"
    OVERALL_TEXT="整体状态：存在异常，请检查！"
fi

MARKDOWN_CONTENT="${OVERALL_TEXT}  
**检查时间**：${CHECK_TIME}  
**主机**：${HOSTNAME}  

**后端服务** (端口 3000)  
- 状态：${B_ICON} $([ "$B_STATUS" = "up" ] && echo "运行中" || echo "已停止")  
- PID：${B_PID}  
- 内存：${B_MEM}  
- HTTP：${B_HTTP} (${B_TIME})  
- 进程：${B_CMD}  

**前端服务** (端口 5174)  
- 状态：${F_ICON} $([ "$F_STATUS" = "up" ] && echo "运行中" || echo "已停止")  
- PID：${F_PID}  
- 内存：${F_MEM}  
- HTTP：${F_HTTP} (${F_TIME})  
- 进程：${F_CMD}  

**系统资源**  
- 内存使用：${MEM_USED}  
- CPU 使用：${CPU_LOAD}  
- 磁盘使用：${DISK_USED}"

echo ""
echo "正在发送报告到飞书..."
send_feishu "$TITLE" "$MARKDOWN_CONTENT" "$COLOR"
echo ""
echo "=== 报告发送完成 ==="
