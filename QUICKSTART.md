# ✅ GitHub + Vercel 部署清单

## 🚀 5分钟快速部署

### 前置要求
- [ ] GitHub账号
- [ ] Vercel账号（用GitHub登录）
- [ ] Git已安装

---

## 📦 第1步：上传到GitHub (2分钟)

```bash
# 1. 在GitHub创建新仓库
#    名称: obesity-drug-dashboard
#    类型: Public（推荐）或 Private

# 2. 在本地项目目录执行
cd obesity-drug-dashboard
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/obesity-drug-dashboard.git
git branch -M main
git push -u origin main
```

**验证**: 在GitHub查看文件是否已上传

---

## 🤖 第2步：配置GitHub Actions (1分钟)

```bash
# 1. 进入仓库 Settings
# 2. 点击 Actions → General
# 3. 滚动到 "Workflow permissions"
# 4. 选择 "Read and write permissions"
# 5. 点击 Save

# 6. 手动触发一次测试
#    Actions → Update Dashboard Data Daily → Run workflow
```

**验证**: Actions tab显示绿色✓，且生成了`public/dashboard_data.json`

---

## ☁️ 第3步：部署到Vercel (2分钟)

```bash
# 1. 访问 https://vercel.com
# 2. 用GitHub账号登录
# 3. 点击 "Add New" → "Project"
# 4. 选择 obesity-drug-dashboard 仓库
# 5. 点击 "Import"

# 6. 构建设置（通常自动检测正确）
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist

# 7. 点击 "Deploy"
# 8. 等待1-2分钟完成
```

**验证**: 访问 `https://your-project.vercel.app` 看到仪表盘

---

## ✅ 完成！检查清单

验证以下所有项都正常：

### GitHub
- [ ] 仓库文件已上传
- [ ] `.github/workflows/update-data.yml` 存在
- [ ] Actions权限已设置为 "Read and write"
- [ ] 手动运行Actions成功（绿色✓）
- [ ] `public/dashboard_data.json` 已生成

### Vercel
- [ ] 项目已部署
- [ ] Production URL可访问
- [ ] 网站显示仪表盘
- [ ] "Last Updated" 时间戳正确
- [ ] 6家公司股价数据显示

### 自动化
- [ ] GitHub Actions badge显示绿色
- [ ] Vercel连接到GitHub仓库
- [ ] 测试：修改README.md → commit → push → Vercel自动重新部署

---

## 📅 下一步（可选）

### 自定义域名
```bash
# Vercel Dashboard → Settings → Domains
# 添加: dashboard.yourdomain.com
# 配置DNS CNAME记录
```

### 添加通知
```bash
# Settings → Secrets → New secret
# SLACK_WEBHOOK=https://hooks.slack.com/...
```

### 调整更新时间
```yaml
# 编辑 .github/workflows/update-data.yml
schedule:
  - cron: '0 13 * * *'  # UTC 13:00 = 美东 09:00
```

---

## 🎯 每日自动流程

一旦设置完成，每天会自动：

```
01:00 UTC → GitHub Actions运行
         ↓
   获取股价+新闻
         ↓
   更新JSON文件
         ↓
   提交到GitHub
         ↓
01:05 UTC → Vercel检测更新
         ↓
   自动构建部署
         ↓
01:10 UTC → 网站显示新数据
```

**完全自动化，无需人工干预！** 🎉

---

## 🔧 本地开发（可选）

```bash
# 克隆仓库
git clone https://github.com/你的用户名/obesity-drug-dashboard.git
cd obesity-drug-dashboard

# 安装依赖
npm install

# 本地运行
npm run dev
# 访问 http://localhost:3000

# 构建测试
npm run build
npm run preview
```

---

## 📊 查看更新日志

### GitHub
```
Actions → 最新workflow → 查看详细日志
应该看到：
✓ Fetching market data...
✓ LLY: $1063.91
✓ Generated file size: 5432 bytes
```

### Vercel
```
Deployments → 最新部署 → Build Logs
应该看到：
✓ Installing dependencies
✓ Building production bundle
✓ Deployment complete
```

---

## ❓ 常见问题

**Q: Actions运行失败？**
```
A: 检查 Settings → Actions → Workflow permissions
   确保是 "Read and write permissions"
```

**Q: Vercel部署失败？**
```
A: 检查 package.json 和 vite.config.js 是否正确
   本地运行 npm run build 测试
```

**Q: 数据没更新？**
```
A: 
1. 检查GitHub Actions是否成功运行
2. 查看dashboard_data.json的最后修改时间
3. 清除浏览器缓存并刷新
```

---

## 🎊 成功！

如果你看到：
- ✅ GitHub Actions每日自动运行
- ✅ 数据文件每天更新
- ✅ Vercel自动部署
- ✅ 网站显示最新数据

恭喜！你的仪表盘已完全自动化！🚀

现在你可以：
- 分享链接给同事
- 添加自定义域名
- 根据需求调整更新频率
- 在本地修改并推送更新

享受你的自动化仪表盘！💯
