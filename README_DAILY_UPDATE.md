# 📊 Obesity Drug Dashboard - 每日自动更新指南

## 🎯 5分钟快速开始

### 选项A: 最简单方式（本地自动化）

```bash
# 1. 安装Python依赖
pip install requests pandas yfinance beautifulsoup4 feedparser --break-system-packages

# 2. 设置执行权限
chmod +x daily_update.sh

# 3. 测试运行
./daily_update.sh

# 4. 设置每日自动运行（每天上午9点）
crontab -e
# 添加这一行：
0 9 * * * /完整路径/daily_update.sh >> /完整路径/update.log 2>&1
```

完成！现在您的仪表盘每天会自动更新。

---

## 📂 文件说明

```
obesity-dashboard/
├── obesity-drug-dashboard.jsx          # 原始静态版本
├── obesity-drug-dashboard-auto-update.jsx  # 自动更新版本（推荐使用）
├── update_dashboard_data.py            # 数据获取脚本
├── daily_update.sh                     # 自动化Shell脚本
├── dashboard_data.json                 # 数据文件（自动生成）
├── AUTOMATION_GUIDE.md                 # 详细配置指南
└── README_DAILY_UPDATE.md             # 本文件
```

---

## 🔄 工作原理

```
┌─────────────────┐
│  定时任务触发    │  每天上午9点
│  (cron/Task)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ daily_update.sh │  执行更新脚本
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ update_dashboard_    │
│ data.py              │
├──────────────────────┤
│ • 获取实时股价        │  ← Yahoo Finance API
│ • 抓取最新新闻        │  ← RSS订阅源
│ • 更新FDA日历        │  ← 官方数据源
│ • 计算AI情绪分数     │  ← 算法计算
└────────┬─────────────┘
         │
         ▼
┌─────────────────┐
│ dashboard_data  │  生成JSON数据文件
│ .json           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React组件读取   │  网页自动刷新显示
│  最新数据        │
└─────────────────┘
```

---

## 📊 数据更新内容

### ✅ 每日自动更新：
- **股票价格** - 实时市场数据
- **涨跌幅** - 当日变化
- **市值** - 最新估值
- **AI情绪分数** - 基于价格动量和管线强度
- **行业新闻** - 最新7天新闻动态
- **FDA事件** - 即将到来的监管决策

### 📌 手动更新（当有重大变化时）：
- 新药临床试验结果
- 药物批准状态变化
- 公司并购交易
- 管线阶段变化

---

## 🛠️ 自定义配置

### 更改更新时间

编辑crontab中的时间：
```bash
# 格式：分 时 日 月 周
0 9 * * *    # 每天上午9:00
0 */6 * * *  # 每6小时一次
30 8,20 * * * # 每天8:30和20:30
```

### 添加通知

在 `daily_update.sh` 中设置webhook：
```bash
export NOTIFICATION_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

### 添加更多股票

编辑 `update_dashboard_data.py`:
```python
TICKERS = ['LLY', 'NVO', 'VKTX', 'AMGN', 'RHHBY', 'PFE', 'BMY']  # 添加BMY
```

---

## 📱 查看更新日志

```bash
# 查看最新更新报告
cat latest_update_report.txt

# 查看详细日志
tail -f update.log

# 查看最近10次更新
tail -n 100 update.log | grep "completed successfully"
```

---

## 🔍 验证数据

### 手动测试更新
```bash
python3 update_dashboard_data.py
```

### 检查数据文件
```bash
# 查看JSON内容（美化显示）
cat dashboard_data.json | python3 -m json.tool

# 快速统计
python3 -c "
import json
data = json.load(open('dashboard_data.json'))
print(f'✓ {len(data[\"marketData\"])} stocks')
print(f'✓ {len(data[\"intelligenceFeed\"])} news items')
print(f'✓ Last update: {data[\"lastUpdate\"]}')
"
```

### 测试React组件
1. 在浏览器打开dashboard
2. 按F12打开开发者工具
3. 查看Console，应该看到：
   ```
   ✅ Dashboard data loaded from JSON file
   ```

---

## 🚨 故障排查

### 问题1: Cron任务没有运行
```bash
# 检查cron服务是否运行
sudo systemctl status cron  # Linux
sudo launchctl list | grep cron  # Mac

# 查看cron日志
grep CRON /var/log/syslog  # Linux
log show --predicate 'process == "cron"' --last 1h  # Mac
```

### 问题2: Python依赖缺失
```bash
# 重新安装所有依赖
pip3 install -r requirements.txt --break-system-packages

# 或者逐个安装
pip3 install requests --break-system-packages
pip3 install yfinance --break-system-packages
pip3 install feedparser --break-system-packages
pip3 install pandas --break-system-packages
pip3 install beautifulsoup4 --break-system-packages
```

### 问题3: 股票数据获取失败
```bash
# 测试单个股票
python3 -c "
import yfinance as yf
stock = yf.Ticker('LLY')
print(stock.info.get('currentPrice'))
"

# 如果失败，可能需要设置代理或等待API限制解除
```

### 问题4: React组件不显示新数据
1. 清除浏览器缓存 (Ctrl+Shift+Delete)
2. 硬刷新页面 (Ctrl+Shift+R)
3. 检查浏览器Console是否有CORS错误
4. 确认JSON文件路径正确

---

## 📈 性能优化建议

### 1. 使用缓存减少API调用
```python
# 在 update_dashboard_data.py 中添加
import time
from functools import lru_cache

@lru_cache(maxsize=100)
def fetch_stock_data_cached(ticker):
    time.sleep(0.5)  # 避免API限速
    return fetch_stock_data(ticker)
```

### 2. 并行处理加速
```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(fetch_stock_data, TICKERS)
```

### 3. 减小JSON文件大小
```python
# 只保留必要字段
import json
with open('dashboard_data.json', 'w') as f:
    json.dump(data, f, separators=(',', ':'))  # 无空格
```

---

## 🎓 进阶配置

### 部署到云端（Vercel）
```bash
# 安装Vercel CLI
npm install -g vercel

# 部署
vercel --prod

# 设置环境变量
vercel env add ALPHA_VANTAGE_KEY
```

### 添加数据库存储历史数据
```python
import sqlite3

def save_to_database(data):
    conn = sqlite3.connect('dashboard_history.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_data (
            date TEXT,
            ticker TEXT,
            price REAL,
            change REAL
        )
    ''')
    
    for stock in data['marketData']:
        cursor.execute(
            'INSERT INTO market_data VALUES (?, ?, ?, ?)',
            (data['lastUpdate'], stock['ticker'], 
             stock['price'], stock['change'])
        )
    
    conn.commit()
    conn.close()
```

---

## 📞 需要帮助？

1. **查看详细指南**: `AUTOMATION_GUIDE.md`
2. **检查日志**: `update.log` 和 `latest_update_report.txt`
3. **测试组件**: 在浏览器开发者工具查看错误信息

---

## 🎉 成功标志

当一切正常时，你应该看到：

✅ Cron任务每天准时运行  
✅ `dashboard_data.json` 每天更新  
✅ `update.log` 显示成功消息  
✅ React网页显示最新数据  
✅ 备份文件夹有历史数据  

恭喜！您的仪表盘现在完全自动化了！🚀
