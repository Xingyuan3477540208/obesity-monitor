# 📊 Obesity Drug Market Intelligence Dashboard

> Real-time monitoring of GLP-1 therapeutics pipeline with automated daily updates

[![Auto Update](https://github.com/yourusername/obesity-drug-dashboard/actions/workflows/update-data.yml/badge.svg)](https://github.com/yourusername/obesity-drug-dashboard/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/obesity-drug-dashboard)

[🚀 Live Demo](https://obesity-drug-dashboard.vercel.app) | [📖 Full Documentation](./DEPLOYMENT_GUIDE.md)

---

## ✨ Features

### 📈 Real-Time Market Data
- **6 Major Players**: Eli Lilly (LLY), Novo Nordisk (NVO), Viking (VKTX), Amgen (AMGN), Roche (RHHBY), Pfizer (PFE)
- **Live Stock Prices**: Updated daily via Yahoo Finance API
- **AI Sentiment Scores**: Algorithm-based market sentiment (0-100)
- **Market Statistics**: Total market cap, daily gainers/losers

### 💊 Pipeline Intelligence
- **11 Drug Programs**: From approved to Phase 1
- **Advanced Filtering**: By target type (GLP-1, GLP-1/GIP, Triple agonist) and clinical stage
- **Competitive Analysis**: Weight loss efficacy, dosing frequency, unique advantages
- **Mechanism Insights**: Single, dual, and triple agonist comparisons

### 📰 News Intelligence Feed
- **Automated RSS Scraping**: FierceBiotech, BioPharma Dive
- **Keyword Filtering**: Obesity, GLP-1, clinical trials, FDA approvals
- **Priority Coding**: Critical (🔴), High (🟠), Medium (🔵)
- **Company Attribution**: Auto-tags relevant ticker symbols

### 📅 FDA Catalyst Tracker
- **Regulatory Countdown**: Days until Orforglipron decision (March 31, 2026)
- **Event Timeline**: Phase 3 starts, commercial launches, data readouts
- **2026 Roadmap**: Comprehensive Q1-Q4 event calendar

---

## 🏗️ Architecture

```
GitHub Actions (Data Layer)
     ↓
  每日01:00 UTC自动运行
     ↓
  Python脚本获取数据
     ├─ Yahoo Finance API → 股价
     ├─ RSS Feeds → 新闻
     └─ 算法计算 → AI情绪分数
     ↓
  生成 dashboard_data.json
     ↓
  Git commit & push
     ↓
Vercel (Presentation Layer)
     ↓
  自动检测更新并部署
     ↓
  React + Vite 构建
     ↓
  全球CDN分发
     ↓
  用户访问最新数据
```

---

## 🚀 Quick Start

### 方法1: 一键部署到Vercel（最快）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/obesity-drug-dashboard)

1. 点击按钮
2. 连接GitHub账号
3. 等待部署完成
4. 配置GitHub Actions（见下文）

### 方法2: 手动部署（完全控制）

```bash
# 1. Clone仓库
git clone https://github.com/yourusername/obesity-drug-dashboard.git
cd obesity-drug-dashboard

# 2. 推送到你的GitHub
git remote set-url origin https://github.com/你的用户名/obesity-drug-dashboard.git
git push

# 3. 配置GitHub Actions
# Settings → Actions → Workflow permissions → Read and write

# 4. 部署到Vercel
vercel --prod
```

📖 **详细步骤**: 查看 [QUICKSTART.md](./QUICKSTART.md)

---

## 📁 Project Structure

```
obesity-drug-dashboard/
├── .github/
│   └── workflows/
│       └── update-data.yml          # 每日自动更新workflow
├── public/
│   └── dashboard_data.json          # 数据文件（GitHub Actions生成）
├── scripts/
│   ├── update_dashboard_data.py     # 数据获取脚本
│   └── generate_summary.py          # 更新摘要生成
├── src/
│   ├── App.jsx                      # 主Dashboard组件
│   ├── main.jsx                     # React入口
│   └── index.css                    # Tailwind样式
├── archive/                         # 历史数据备份
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                      # Vercel配置
└── README.md
```

---

## 🔄 Automated Updates

### 默认时间表
- **每日 01:00 UTC** (美东 20:00/21:00, 北京 09:00)
- **自动运行时长**: ~5分钟
- **部署延迟**: +2分钟（Vercel构建）
- **总耗时**: ~7-10分钟

### 自定义更新频率

编辑 `.github/workflows/update-data.yml`:

```yaml
schedule:
  # 每12小时更新
  - cron: '0 */12 * * *'
  
  # 工作日每天3次
  - cron: '0 1,9,17 * * 1-5'
  
  # 仅周一到周五
  - cron: '0 1 * * 1-5'
```

---

## 📊 Data Sources

| Type | Source | Update Frequency | Cost |
|------|--------|------------------|------|
| **Stock Prices** | Yahoo Finance API | 实时 | 免费 |
| **News** | RSS (FierceBiotech, BioPharma Dive) | 每发布 | 免费 |
| **FDA Calendar** | ClinicalTrials.gov, FDA.gov | 手动更新 | 免费 |
| **Pipeline Data** | Company press releases, Journals | 手动更新 | 免费 |

---

## 🎨 Tech Stack

### Frontend
- **React 18** - UI框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式
- **Lucide React** - 图标库

### Backend (Serverless)
- **GitHub Actions** - 自动化
- **Python 3.11** - 数据处理
- **yfinance** - 股价数据
- **feedparser** - RSS解析

### Deployment
- **Vercel** - 托管和CDN
- **GitHub Pages** - 备用方案

---

## 📈 Performance

- **页面加载**: <1秒 (Vercel CDN)
- **数据更新**: 每日自动
- **正常运行时间**: 99.9% (Vercel SLA)
- **全球访问**: CDN加速
- **移动友好**: 完全响应式

---

## 🛠️ Development

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 数据更新测试

```bash
# 安装Python依赖
pip install -r requirements.txt

# 运行更新脚本
cd scripts
python update_dashboard_data.py

# 验证输出
cat ../public/dashboard_data.json | python -m json.tool
```

---

## 🔒 Environment Variables

### GitHub Secrets (可选)

```bash
# Slack通知
SLACK_WEBHOOK=https://hooks.slack.com/services/...

# Vercel强制部署
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...

# API Keys (如果使用付费服务)
ALPHA_VANTAGE_KEY=your_key_here
```

添加方式：
```
GitHub → Settings → Secrets and variables → Actions → New secret
```

---

## 📸 Screenshots

### Market Overview
![Market Overview](https://via.placeholder.com/800x400?text=Market+Overview+Tab)

### Pipeline Comparison
![Pipeline](https://via.placeholder.com/800x400?text=Pipeline+Comparison+Table)

### Intelligence Feed
![News Feed](https://via.placeholder.com/800x400?text=Intelligence+Feed)

---

## 🤝 Contributing

欢迎贡献！如果你想改进仪表盘：

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

### 改进建议
- [ ] 添加更多公司（Boehringer Ingelheim, Structure Therapeutics）
- [ ] 集成Twitter API获取实时讨论
- [ ] 添加价格历史图表
- [ ] 创建移动App版本
- [ ] 添加邮件订阅功能

---

## 📝 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 Acknowledgments

- **数据来源**: Yahoo Finance, FierceBiotech, BioPharma Dive
- **灵感**: Bloomberg Terminal, PitchBook
- **框架**: React, Tailwind CSS, Vite
- **基础设施**: GitHub, Vercel

---

## 📞 Support

- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)
- ✅ [快速启动清单](./QUICKSTART.md)
- 🐛 [报告问题](https://github.com/yourusername/obesity-drug-dashboard/issues)
- 💬 [讨论](https://github.com/yourusername/obesity-drug-dashboard/discussions)

---

## ⭐ Star History

如果这个项目对你有帮助，请给个star⭐！

[![Star History](https://api.star-history.com/svg?repos=yourusername/obesity-drug-dashboard&type=Date)](https://star-history.com/#yourusername/obesity-drug-dashboard)

---

Made with ❤️ for the biotech community | Last updated: 2026-01-12
