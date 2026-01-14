# 每日自动更新配置指南
# ================================

## 📋 方案概览

我们提供了3种自动更新方案，按推荐度排序：

### 方案1: 本地定时任务 + Python脚本（最简单）⭐⭐⭐⭐⭐
### 方案2: GitHub Actions自动化（云端，免费）⭐⭐⭐⭐
### 方案3: 云函数定时触发（适合生产环境）⭐⭐⭐

---

## 🚀 方案1: 本地定时任务（推荐新手）

### 第1步：安装依赖
```bash
pip install requests pandas yfinance beautifulsoup4 feedparser --break-system-packages
```

### 第2步：设置每日自动运行

#### 对于 Mac/Linux 用户：
```bash
# 编辑 crontab
crontab -e

# 添加以下行（每天上午9点运行）
0 9 * * * cd /path/to/your/dashboard && python update_dashboard_data.py >> update.log 2>&1

# 保存并退出
# 确认任务已添加
crontab -l
```

#### 对于 Windows 用户：
1. 打开"任务计划程序" (Task Scheduler)
2. 创建基本任务
3. 设置触发器：每日上午9:00
4. 操作：启动程序
   - 程序：`python`
   - 参数：`C:\path\to\update_dashboard_data.py`
   - 起始于：`C:\path\to\dashboard\`
5. 完成

### 第3步：测试脚本
```bash
# 手动运行一次，确保正常工作
python update_dashboard_data.py

# 检查输出文件
ls dashboard_data.json
```

---

## ☁️ 方案2: GitHub Actions（云端自动化）

### 第1步：将代码上传到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/obesity-dashboard.git
git push -u origin main
```

### 第2步：创建 `.github/workflows/update-data.yml`
```yaml
name: Update Dashboard Data Daily

on:
  schedule:
    # 每天UTC 01:00运行（北京时间09:00）
    - cron: '0 1 * * *'
  workflow_dispatch:  # 允许手动触发

jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    
    - name: Install dependencies
      run: |
        pip install requests pandas yfinance beautifulsoup4 feedparser
    
    - name: Run update script
      run: |
        python update_dashboard_data.py
    
    - name: Commit and push if changed
      run: |
        git config --global user.name 'GitHub Action'
        git config --global user.email 'action@github.com'
        git add dashboard_data.json
        git diff --quiet && git diff --staged --quiet || (git commit -m "🤖 Auto-update dashboard data $(date)" && git push)
```

### 第3步：配置GitHub Pages（可选）
1. 进入仓库 Settings → Pages
2. Source: Deploy from branch
3. Branch: main / root
4. 访问 `https://yourusername.github.io/obesity-dashboard/`

---

## 🌐 方案3: Vercel + Serverless Functions

### 第1步：创建 `api/update-data.py`
```python
from http.server import BaseHTTPRequestHandler
import json
from update_dashboard_data import update_dashboard_json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 运行更新
            data = update_dashboard_json()
            
            # 返回JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())
```

### 第2步：创建 `vercel.json`
```json
{
  "crons": [{
    "path": "/api/update-data",
    "schedule": "0 9 * * *"
  }]
}
```

### 第3步：部署
```bash
# 安装Vercel CLI
npm install -g vercel

# 部署
vercel

# 生产环境部署
vercel --prod
```

---

## 📊 监控和通知

### 设置邮件通知（Python脚本）
在 `update_dashboard_data.py` 添加：

```python
import smtplib
from email.mime.text import MIMEText

def send_email_notification(status, details):
    """发送更新状态邮件"""
    msg = MIMEText(f"Dashboard update {status}\n\n{details}")
    msg['Subject'] = f'Dashboard Update: {status}'
    msg['From'] = 'your-email@gmail.com'
    msg['To'] = 'recipient@email.com'
    
    # 使用Gmail SMTP
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login('your-email@gmail.com', 'your-app-password')
        smtp.send_message(msg)

# 在主函数末尾添加
try:
    update_dashboard_json()
    send_email_notification('SUCCESS', 'All data updated successfully')
except Exception as e:
    send_email_notification('FAILED', str(e))
```

---

## 🔍 数据源说明

### 实时数据源：
1. **股价数据**: Yahoo Finance API (`yfinance`)
   - 实时价格、涨跌幅
   - 市值数据
   - 自动计算

2. **新闻数据**: RSS订阅
   - FierceBiotech RSS
   - BioPharma Dive RSS
   - 关键词过滤

3. **FDA日历**: 
   - FDA.gov官方日历
   - ClinicalTrials.gov
   - 公司公告

### 静态数据（手动更新）：
- 药物管线数据（临床试验结果）
- 公司战略变化
- 重大里程碑事件

---

## ✅ 验证清单

运行以下命令确保一切正常：

```bash
# 1. 测试Python脚本
python update_dashboard_data.py

# 2. 检查输出文件
cat dashboard_data.json | jq .

# 3. 验证数据完整性
python -c "import json; data=json.load(open('dashboard_data.json')); print(f'Stocks: {len(data[\"marketData\"])}, News: {len(data[\"intelligenceFeed\"])}')"

# 4. 测试React组件加载
# 在浏览器打开dashboard，查看控制台是否有错误
```

---

## 📱 移动端通知（可选）

### 使用Pushover或Telegram Bot
```python
import requests

def send_push_notification(title, message):
    """通过Pushover发送推送通知"""
    requests.post("https://api.pushover.net/1/messages.json", data={
        "token": "YOUR_APP_TOKEN",
        "user": "YOUR_USER_KEY",
        "title": title,
        "message": message
    })
```

---

## 🛠️ 故障排查

### 常见问题：

1. **Yahoo Finance限速**
   ```python
   # 添加延迟
   import time
   time.sleep(1)  # 每个请求间隔1秒
   ```

2. **RSS源失效**
   - 检查源URL是否变更
   - 添加更多备用RSS源

3. **JSON文件未更新**
   - 检查文件权限
   - 验证cron任务是否运行
   - 查看日志文件

4. **React组件不刷新**
   - 清除浏览器缓存
   - 检查fetch路径
   - 验证CORS设置

---

## 📈 高级功能

### 添加更多数据源：
```python
# Alpha Vantage API（免费，需注册）
def fetch_alpha_vantage_data(ticker):
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={ticker}&apikey=YOUR_KEY"
    response = requests.get(url)
    return response.json()

# SEC EDGAR（公司文件）
def fetch_sec_filings(company_cik):
    url = f"https://data.sec.gov/submissions/CIK{company_cik}.json"
    response = requests.get(url, headers={'User-Agent': 'Your Name your@email.com'})
    return response.json()
```

---

## 💡 提示

- **备份数据**: 每次更新前备份旧的JSON文件
- **版本控制**: 使用Git跟踪数据变化
- **错误重试**: 添加自动重试逻辑
- **性能监控**: 记录脚本运行时间

选择适合你的方案，开始自动化更新！🚀
