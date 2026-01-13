# 🚀 GitHub Actions + Vercel 混合部署指南

## 📋 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    完整工作流程                          │
└─────────────────────────────────────────────────────────┘

    GitHub Repository
    ┌──────────────────────────────────────┐
    │                                      │
    │  📝 Source Code                      │
    │  └─ src/App.jsx (React Dashboard)   │
    │                                      │
    │  🤖 GitHub Actions (每天UTC 01:00)  │
    │  └─ .github/workflows/update-data.yml│
    │     └─ scripts/update_dashboard_data.py│
    │        ├─ 获取股价 (Yahoo Finance)   │
    │        ├─ 抓取新闻 (RSS Feeds)       │
    │        └─ 生成 public/dashboard_data.json│
    │                                      │
    │  📊 Data File (自动更新)             │
    │  └─ public/dashboard_data.json       │
    │                                      │
    └──────────┬───────────────────────────┘
               │
               │ Git Push (自动)
               │
               ▼
    ┌──────────────────────────────────────┐
    │  Vercel (自动检测并部署)             │
    │                                      │
    │  🔨 Build Process                    │
    │  └─ vite build                       │
    │     └─ 编译React → 静态HTML/JS       │
    │                                      │
    │  🌐 Production Deployment            │
    │  └─ https://your-app.vercel.app      │
    │     ├─ CDN加速全球访问               │
    │     ├─ 自动HTTPS                     │
    │     └─ 实时数据更新                  │
    │                                      │
    └──────────────────────────────────────┘

    用户访问 → Vercel CDN → 最新数据
```

---

## 🎯 第一步：准备 GitHub 仓库

### 1.1 创建仓库结构

```bash
obesity-drug-dashboard/
├── .github/
│   └── workflows/
│       └── update-data.yml          # GitHub Actions配置
├── public/
│   ├── dashboard_data.json          # 数据文件（自动生成）
│   └── favicon.svg                  # 网站图标（可选）
├── scripts/
│   ├── update_dashboard_data.py     # 数据更新脚本
│   └── generate_summary.py          # 摘要生成脚本
├── src/
│   ├── App.jsx                      # 主Dashboard组件
│   ├── main.jsx                     # React入口
│   └── index.css                    # Tailwind CSS
├── archive/                         # 历史数据备份（自动生成）
├── index.html                       # HTML模板
├── package.json                     # Node.js依赖
├── vite.config.js                   # Vite配置
├── tailwind.config.js               # Tailwind配置
├── vercel.json                      # Vercel配置
├── .gitignore
└── README.md
```

### 1.2 初始化Git仓库

```bash
# 在项目目录
git init
git add .
git commit -m "Initial commit: Obesity drug dashboard"

# 连接到GitHub（先在GitHub创建仓库）
git remote add origin https://github.com/你的用户名/obesity-drug-dashboard.git
git branch -M main
git push -u origin main
```

### 1.3 创建 .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
build/

# Environment
.env
.env.local
.env.production.local

# Logs
*.log
npm-debug.log*
update.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel
EOF
```

---

## 🤖 第二步：配置 GitHub Actions

### 2.1 启用 GitHub Actions

1. 进入你的GitHub仓库
2. 点击 **Settings** → **Actions** → **General**
3. 确保启用 "Allow all actions and reusable workflows"
4. Workflow permissions 设置为 "Read and write permissions"

### 2.2 验证工作流

```bash
# 手动触发一次测试
# 在GitHub仓库页面：
# Actions → Update Dashboard Data Daily → Run workflow
```

### 2.3 查看执行日志

```
Actions tab → 选择最近的workflow run → 查看详细日志

你应该看到：
✓ Checkout repository
✓ Set up Python
✓ Install dependencies
✓ Run data update script
  📊 Fetching market data...
  ✓ LLY: $1063.91
  ✓ NVO: $59.45
  ...
✓ Verify generated data
✓ Commit and push changes
```

---

## ☁️ 第三步：部署到 Vercel

### 3.1 注册/登录 Vercel

访问 https://vercel.com 并使用GitHub账号登录

### 3.2 导入项目

1. 点击 **Add New** → **Project**
2. 选择你的 `obesity-drug-dashboard` 仓库
3. 点击 **Import**

### 3.3 配置构建设置

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**环境变量**（可选）：
```
NODE_ENV=production
```

### 3.4 部署

点击 **Deploy**，等待1-2分钟完成构建

部署成功后，你会获得：
- 🌐 Production URL: `https://obesity-drug-dashboard.vercel.app`
- 🔗 预览URL: 每次commit都会生成

---

## 🔄 第四步：验证自动化流程

### 4.1 测试完整流程

```bash
# 1. 等待GitHub Actions运行（每天UTC 01:00）
#    或者手动触发：GitHub → Actions → Run workflow

# 2. 检查数据文件是否更新
#    GitHub仓库中查看 public/dashboard_data.json 的提交历史

# 3. Vercel自动检测到GitHub更新并重新部署
#    Vercel Dashboard → Deployments 查看状态

# 4. 访问网站验证新数据
#    打开 https://your-app.vercel.app
#    查看 "Last Updated" 时间戳
```

### 4.2 验证清单

- [ ] GitHub Actions 每日自动运行
- [ ] `dashboard_data.json` 每天更新
- [ ] Git commit 自动提交数据
- [ ] Vercel 检测到更新并自动部署
- [ ] 网站显示最新数据
- [ ] 备份文件夹有历史数据

---

## 📊 数据更新时间线

```
Timeline (每日):

00:00 UTC       GitHub Actions 准备
01:00 UTC       🤖 Actions 开始运行
              ├─ 获取股价数据 (1-2分钟)
              ├─ 抓取RSS新闻 (30秒)
              ├─ 生成JSON文件
              └─ Git commit & push

01:05 UTC       📝 新数据提交到GitHub

01:06 UTC       🚀 Vercel检测到更新
              ├─ 触发自动构建
              ├─ npm install (1分钟)
              ├─ vite build (30秒)
              └─ 部署到全球CDN (30秒)

01:09 UTC       ✅ 网站更新完成
              └─ 用户看到最新数据

全程约 9-10 分钟
```

---

## 🛠️ 高级配置

### 5.1 自定义更新时间

编辑 `.github/workflows/update-data.yml`:

```yaml
on:
  schedule:
    # 多个时间点
    - cron: '0 1 * * *'   # UTC 01:00 (美东 20:00/21:00)
    - cron: '0 13 * * *'  # UTC 13:00 (美东 08:00/09:00)
    - cron: '0 21 * * *'  # UTC 21:00 (美东 16:00/17:00)
```

### 5.2 添加 Vercel 部署 Hook

1. Vercel Dashboard → 你的项目 → Settings → Git
2. 找到 **Deploy Hooks**
3. 创建新Hook，命名如 "Manual Trigger"
4. 复制 Hook URL

在GitHub添加Secret:
```
Settings → Secrets → New repository secret
Name: VERCEL_DEPLOY_HOOK
Value: https://api.vercel.com/v1/integrations/deploy/...
```

### 5.3 添加通知

**Slack通知**:
```yaml
# 在 .github/workflows/update-data.yml 末尾添加
- name: Notify Slack
  if: always()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "Dashboard updated: ${{ job.status }}",
        "blocks": [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Status*: ${{ job.status }}\n*Stocks*: ${{ steps.summary.outputs.stocks_count }}"
          }
        }]
      }'
```

### 5.4 自定义域名

1. Vercel Dashboard → 你的项目 → Settings → Domains
2. 添加你的域名 (如 `dashboard.yourdomain.com`)
3. 按照提示配置DNS记录:
   ```
   Type: CNAME
   Name: dashboard
   Value: cname.vercel-dns.com
   ```

---

## 🔍 监控和调试

### 6.1 GitHub Actions 日志

```bash
# 查看最近的运行
gh run list --workflow=update-data.yml

# 查看详细日志
gh run view <run-id> --log

# 重新运行失败的workflow
gh run rerun <run-id>
```

### 6.2 Vercel 部署日志

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 查看部署列表
vercel list

# 查看部署日志
vercel logs <deployment-url>
```

### 6.3 数据验证

```bash
# 克隆仓库到本地
git clone https://github.com/你的用户名/obesity-drug-dashboard.git
cd obesity-drug-dashboard

# 查看数据文件
cat public/dashboard_data.json | python3 -m json.tool

# 查看历史数据
ls -lh archive/

# 查看Git提交历史
git log --oneline --grep="Auto-update"
```

---

## ⚡ 性能优化

### 7.1 Vercel 缓存策略

已在 `vercel.json` 中配置:
```json
{
  "headers": [
    {
      "source": "/dashboard_data.json",
      "headers": [{
        "key": "Cache-Control",
        "value": "public, max-age=300, stale-while-revalidate=600"
      }]
    }
  ]
}
```

这意味着：
- 数据缓存5分钟 (300秒)
- 缓存过期后，仍可服务旧数据10分钟，同时后台刷新

### 7.2 GitHub Actions 缓存

```yaml
- name: Cache Python dependencies
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

---

## 🚨 故障排查

### 问题1: GitHub Actions 失败

```bash
# 检查错误信息
GitHub → Actions → 失败的run → 查看红色步骤

常见原因：
1. Python依赖缺失 → 检查 pip install 步骤
2. API限速 → 添加延迟或使用备用API
3. Git push权限 → 检查 Workflow permissions
```

### 问题2: Vercel 部署失败

```bash
# 查看构建日志
Vercel Dashboard → Deployments → 失败的部署 → Build Logs

常见原因：
1. npm install失败 → 检查package.json
2. vite build错误 → 本地测试 npm run build
3. 环境变量缺失 → 检查Vercel设置
```

### 问题3: 数据未更新

```bash
# 检查数据文件
curl https://your-app.vercel.app/dashboard_data.json

# 如果显示旧数据：
1. 清除浏览器缓存
2. 检查Vercel缓存设置
3. 强制重新部署：Vercel → Deployments → Redeploy
```

---

## 📈 监控指标

### 8.1 GitHub Actions 使用量

```
Settings → Billing → Usage
免费账户：
- 2000分钟/月 (约67次运行，每次30分钟)
- 本dashboard每次运行<5分钟，足够每天更新
```

### 8.2 Vercel 配额

```
免费 Hobby 计划：
- 100GB带宽/月
- 无限次部署
- 每日数据更新不消耗额外配额
```

---

## 🎉 成功标志

当一切正常运行时：

✅ **GitHub Actions**
- Badge显示绿色 ✓
- 每日01:00 UTC自动运行
- Commit历史显示每日更新

✅ **Vercel**
- Production部署状态：Ready
- 部署频率：每日1次
- 响应时间：<1秒

✅ **网站**
- "Last Updated"显示当天日期
- 股价数据实时更新
- 新闻feed显示最新文章

✅ **数据质量**
- 6只股票数据完整
- 新闻相关性高
- AI情绪分数合理

---

## 📞 获取帮助

- GitHub Actions文档: https://docs.github.com/actions
- Vercel文档: https://vercel.com/docs
- Vite文档: https://vitejs.dev

恭喜！你的仪表盘现已完全自动化！🚀
