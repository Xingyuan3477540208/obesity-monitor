#!/bin/bash

# Obesity Drug Dashboard - Daily Update Script
# ============================================
# 
# 用途：每天自动更新仪表盘数据
# 使用方法：
#   chmod +x daily_update.sh
#   ./daily_update.sh
#
# 添加到crontab：
#   0 9 * * * /path/to/daily_update.sh >> /path/to/update.log 2>&1

set -e  # 遇到错误立即退出

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/update.log"
DATA_FILE="$SCRIPT_DIR/dashboard_data.json"
BACKUP_DIR="$SCRIPT_DIR/backups"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 开始更新
log "🚀 Starting daily dashboard update..."

# 1. 备份现有数据
if [ -f "$DATA_FILE" ]; then
    BACKUP_FILE="$BACKUP_DIR/dashboard_data_$(date +'%Y%m%d_%H%M%S').json"
    cp "$DATA_FILE" "$BACKUP_FILE"
    log "📦 Backed up existing data to: $BACKUP_FILE"
    
    # 只保留最近7天的备份
    find "$BACKUP_DIR" -name "dashboard_data_*.json" -mtime +7 -delete
    log "🗑️  Cleaned old backups (>7 days)"
fi

# 2. 检查Python环境
if ! command -v python3 &> /dev/null; then
    error "Python3 not found! Please install Python 3.x"
    exit 1
fi

log "🐍 Python version: $(python3 --version)"

# 3. 检查依赖
log "📚 Checking Python dependencies..."
python3 -c "
import sys
required = ['requests', 'yfinance', 'feedparser', 'pandas']
missing = []
for pkg in required:
    try:
        __import__(pkg)
    except ImportError:
        missing.append(pkg)

if missing:
    print('Missing packages:', ', '.join(missing))
    sys.exit(1)
" || {
    warning "Missing dependencies. Installing..."
    pip3 install requests yfinance feedparser pandas --break-system-packages
}

# 4. 运行更新脚本
log "⚙️  Running update script..."
cd "$SCRIPT_DIR"

if python3 update_dashboard_data.py; then
    log "✅ Data update completed successfully!"
    
    # 验证输出文件
    if [ -f "$DATA_FILE" ]; then
        FILE_SIZE=$(wc -c < "$DATA_FILE")
        if [ "$FILE_SIZE" -gt 100 ]; then
            log "✓ Data file created: ${FILE_SIZE} bytes"
            
            # 显示数据摘要
            log "📊 Data summary:"
            python3 -c "
import json
with open('$DATA_FILE') as f:
    data = json.load(f)
    print(f\"  - Market data: {len(data.get('marketData', []))} stocks\")
    print(f\"  - News items: {len(data.get('intelligenceFeed', []))} articles\")
    print(f\"  - Last update: {data.get('lastUpdate', 'N/A')}\")
"
        else
            error "Data file too small (${FILE_SIZE} bytes). Update may have failed."
            exit 1
        fi
    else
        error "Data file not created!"
        exit 1
    fi
else
    error "Update script failed!"
    exit 1
fi

# 5. 可选：提交到Git
if [ -d ".git" ]; then
    log "📝 Committing changes to Git..."
    git add dashboard_data.json
    
    if git diff --staged --quiet; then
        log "ℹ️  No changes to commit"
    else
        git commit -m "🤖 Auto-update dashboard data - $(date +'%Y-%m-%d %H:%M')"
        
        # 如果有远程仓库，尝试推送
        if git remote | grep -q origin; then
            log "⬆️  Pushing to remote repository..."
            git push origin main || warning "Failed to push to remote"
        fi
    fi
fi

# 6. 生成更新报告
REPORT_FILE="$SCRIPT_DIR/latest_update_report.txt"
cat > "$REPORT_FILE" << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Obesity Drug Dashboard - Update Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update Time: $(date +'%Y-%m-%d %H:%M:%S')
Status: SUCCESS ✅

Data Statistics:
EOF

python3 -c "
import json
with open('$DATA_FILE') as f:
    data = json.load(f)
    print(f\"  • Market data points: {len(data.get('marketData', []))}\")
    print(f\"  • Intelligence items: {len(data.get('intelligenceFeed', []))}\")
    print(f\"  • Data quality: {data.get('metadata', {}).get('dataQuality', {})}\")
    print()
    print('Top Movers:')
    for stock in sorted(data.get('marketData', []), key=lambda x: abs(x.get('changePercent', 0)), reverse=True)[:3]:
        emoji = '📈' if stock.get('changePercent', 0) > 0 else '📉'
        print(f\"  {emoji} {stock['ticker']}: {stock.get('changePercent', 0):+.2f}%\")
" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

cat "$REPORT_FILE"
log "📄 Update report saved to: $REPORT_FILE"

# 7. 可选：发送通知（需要配置）
if [ -n "$NOTIFICATION_WEBHOOK" ]; then
    log "📬 Sending notification..."
    curl -X POST "$NOTIFICATION_WEBHOOK" \
         -H "Content-Type: application/json" \
         -d "{\"text\":\"Dashboard updated successfully at $(date)\"}" \
         || warning "Failed to send notification"
fi

log "🎉 Daily update completed successfully!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
