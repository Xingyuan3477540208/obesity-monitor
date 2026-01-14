import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle, Pill, Syringe, FileText, Activity, RefreshCw, Globe } from 'lucide-react';

// 翻译字典
const translations = {
  en: {
    // Header
    title: "Obesity Drug Market Intelligence",
    subtitle: "Real-time monitoring of GLP-1 therapeutics pipeline",
    lastUpdated: "Last Updated",
    refreshData: "Refresh Data",
    
    // Tabs
    tabMarket: "Market Overview",
    tabPipeline: "Pipeline",
    tabIntelligence: "Intelligence",
    tabCatalysts: "Catalysts",
    
    // Market Overview
    liveMarketTicker: "Live Market Ticker",
    autoUpdating: "AUTO-UPDATING",
    marketCap: "Market Cap",
    aiSentiment: "AI Sentiment",
    veryBullish: "Very Bullish",
    bullish: "Bullish",
    neutral: "Neutral",
    totalMarketCap: "Total Market Cap",
    combined6Companies: "Combined 6 companies",
    marketGrowth: "Market Growth",
    projectedBy2035: "Projected by 2035",
    activePrograms: "Active Programs",
    clinicalApproved: "Clinical & approved",
    
    // Pipeline
    pipelineComparison: "Pipeline Comparison",
    filterBy: "Filter by:",
    allTargets: "All Targets",
    singleGLP1: "Single (GLP-1)",
    dualGLP1GIP: "Dual (GLP-1/GIP)",
    triple: "Triple",
    allStages: "All Stages",
    reset: "Reset",
    company: "Company",
    drug: "Drug",
    type: "Type",
    targets: "Targets",
    weightLoss: "Weight Loss",
    stage: "Stage",
    keyAdvantages: "Key Advantages",
    oral: "Oral",
    injection: "Injection",
    
    // Intelligence
    intelligenceFeed: "Intelligence Feed",
    impact: "Impact",
    
    // Catalysts
    fdaDecision: "FDA Decision: Orforglipron",
    lillyOralGLP1: "Eli Lilly's oral GLP-1",
    days: "days",
    keyEvents2026: "Key Events 2026",
    
    // Status
    approved: "Approved",
    pending: "Pending",
    ongoing: "Ongoing",
    
    // Priority
    critical: "Critical",
    high: "High",
    medium: "Medium",
    
    // Loading
    loadingData: "Loading dashboard data...",
  },
  
  zh: {
    // 页头
    title: "肥胖药物市场情报",
    subtitle: "GLP-1治疗药物管线实时监控",
    lastUpdated: "最后更新",
    refreshData: "刷新数据",
    
    // 标签页
    tabMarket: "市场概览",
    tabPipeline: "药物管线",
    tabIntelligence: "情报动态",
    tabCatalysts: "关键事件",
    
    // 市场概览
    liveMarketTicker: "实时市场行情",
    autoUpdating: "自动更新",
    marketCap: "市值",
    aiSentiment: "AI情绪",
    veryBullish: "非常看涨",
    bullish: "看涨",
    neutral: "中性",
    totalMarketCap: "总市值",
    combined6Companies: "6家公司合计",
    marketGrowth: "市场增长",
    projectedBy2035: "2035年预测",
    activePrograms: "活跃项目",
    clinicalApproved: "临床及已批准",
    
    // 药物管线
    pipelineComparison: "药物管线对比",
    filterBy: "筛选：",
    allTargets: "所有靶点",
    singleGLP1: "单靶点 (GLP-1)",
    dualGLP1GIP: "双靶点 (GLP-1/GIP)",
    triple: "三靶点",
    allStages: "所有阶段",
    reset: "重置",
    company: "公司",
    drug: "药物",
    type: "类型",
    targets: "靶点",
    weightLoss: "减重效果",
    stage: "阶段",
    keyAdvantages: "核心优势",
    oral: "口服",
    injection: "注射",
    
    // 情报动态
    intelligenceFeed: "情报动态",
    impact: "影响",
    
    // 关键事件
    fdaDecision: "FDA决策：Orforglipron",
    lillyOralGLP1: "礼来口服GLP-1",
    days: "天",
    keyEvents2026: "2026年关键事件",
    
    // 状态
    approved: "已批准",
    pending: "待批准",
    ongoing: "进行中",
    
    // 优先级
    critical: "紧急",
    high: "高",
    medium: "中",
    
    // 加载中
    loadingData: "加载仪表盘数据中...",
  }
};

const ObesityDrugDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetFilter, setTargetFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('market');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [language, setLanguage] = useState('en'); // 语言状态
  
  // 获取当前语言的翻译
  const t = translations[language];
  
  // Load dashboard data from JSON file
  useEffect(() => {
    loadDashboardData();
    const refreshInterval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 切换语言
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/dashboard_data.json');
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setLastUpdate(new Date(data.lastUpdate));
        console.log('✅ Dashboard data loaded from JSON file');
      } else {
        console.log('⚠️ JSON file not found, using static data');
        setDashboardData(getDefaultData());
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(getDefaultData());
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultData = () => {
    return {
      marketData: [
        { ticker: 'LLY', company: 'Eli Lilly', price: 1063.91, change: 22.53, changePercent: 2.16, marketCap: '959.5B', sentiment: 0.85 },
        { ticker: 'NVO', company: 'Novo Nordisk', price: 59.45, change: 0.64, changePercent: 1.09, marketCap: '261.3B', sentiment: 0.68 },
        { ticker: 'VKTX', company: 'Viking Therapeutics', price: 32.03, change: 0.38, changePercent: 1.20, marketCap: '3.61B', sentiment: 0.72 },
        { ticker: 'AMGN', company: 'Amgen', price: 289.45, change: -2.10, changePercent: -0.72, marketCap: '154.8B', sentiment: 0.75 },
        { ticker: 'RHHBY', company: 'Roche', price: 38.20, change: 0.55, changePercent: 1.46, marketCap: '240.5B', sentiment: 0.70 },
        { ticker: 'PFE', company: 'Pfizer', price: 25.80, change: -0.15, changePercent: -0.58, marketCap: '145.2B', sentiment: 0.65 }
      ],
      intelligenceFeed: [
        { date: '2026-01-12', source: 'Obesity Journal', priority: 'high', headline: 'Viking: VENTURE Phase 2 Published', summary: 'VK2735 SC: 14.7% weight loss, no plateau. VANQUISH-1 over-enrolled with 4,650 patients.', company: 'VKTX', impact: 'Peer-reviewed validation' },
        { date: '2026-01-10', source: 'CNBC', priority: 'high', headline: '2026: Year of Obesity Pills', summary: 'Novo launched oral Wegovy Jan 6. Lilly orforglipron expected Q2.', company: 'Multiple', impact: 'Market expansion' },
        { date: '2026-01-09', source: 'Clarivate', priority: 'high', headline: 'Drugs to Watch: Orforglipron & Retatrutide', summary: 'Lilly assets named defining drugs of next decade.', company: 'LLY', impact: 'Analyst validation' },
        { date: '2025-12-16', source: 'Pfizer', priority: 'high', headline: 'Pfizer: 15 Obesity Trials in 2026', summary: 'Post-$10B Metsera acquisition, launching aggressive Phase 3 program.', company: 'PFE', impact: 'Pipeline acceleration' },
        { date: '2025-11-13', source: 'M&A', priority: 'critical', headline: 'Pfizer Completes $10B Metsera Buy', summary: 'Beat Novo in bidding war. Portfolio includes monthly GLP-1 and amylin.', company: 'PFE', impact: 'Major market entry' },
        { date: '2025-09-22', source: 'Roche', priority: 'high', headline: 'Roche: Top 3 Obesity Strategy', summary: 'CEO commits to top 3 by 2030. CT-388 Phase 3 H1 2026.', company: 'RHHBY', impact: '$700M investment' },
        { date: '2025-06-23', source: 'NEJM/ADA', priority: 'high', headline: 'Amgen MariTide: 20% Weight Loss', summary: '20% at 52 weeks, no plateau. Monthly dosing. MARITIME enrolling.', company: 'AMGN', impact: 'Phase 2 validation' }
      ]
    };
  };

  const pipelineData = [
    { company: 'Eli Lilly', drug: 'Orforglipron', type: 'Oral', molecule: 'GLP-1', targetCount: 1, frequency: 'Daily', weightLoss: '12.4%', duration: '52 weeks', stage: 'NDA Submitted', status: 'pending', notes: '💊 First oral GLP-1 from Lilly | No food/water restrictions | Medicare $50/month' },
    { company: 'Novo Nordisk', drug: 'Wegovy Pill', type: 'Oral', molecule: 'GLP-1', targetCount: 1, frequency: 'Daily', weightLoss: '16.6%', duration: '64 weeks', stage: 'Approved', status: 'approved', notes: '🏆 First-to-market oral obesity drug | CV risk reduction proven' },
    { company: 'Viking', drug: 'VK2735 Oral', type: 'Oral', molecule: 'GLP-1/GIP', targetCount: 2, frequency: 'Daily', weightLoss: '12.2%', duration: '13 weeks', stage: 'Phase 2', status: 'ongoing', notes: '💪 Dual agonist oral | 80% achieved ≥10% weight loss' },
    { company: 'Eli Lilly', drug: 'Zepbound', type: 'Injection', molecule: 'GLP-1/GIP', targetCount: 2, frequency: 'Weekly', weightLoss: '20.9%', duration: '72 weeks', stage: 'Approved', status: 'approved', notes: '👑 Market leader efficacy | Preserves lean body mass' },
    { company: 'Novo Nordisk', drug: 'Wegovy Injection', type: 'Injection', molecule: 'GLP-1', targetCount: 1, frequency: 'Weekly', weightLoss: '14.9%', duration: '68 weeks', stage: 'Approved', status: 'approved', notes: '🏥 Proven CV outcomes | 20% MACE reduction' },
    { company: 'Viking', drug: 'VK2735 SC', type: 'Injection', molecule: 'GLP-1/GIP', targetCount: 2, frequency: 'Weekly', weightLoss: '14.7%', duration: '13 weeks', stage: 'Phase 3', status: 'ongoing', notes: '🚀 No plateau at 13 weeks | Monthly dosing in development' },
    { company: 'Eli Lilly', drug: 'Retatrutide', type: 'Injection', molecule: 'GLP-1/GIP/Glucagon', targetCount: 3, frequency: 'Weekly', weightLoss: '24.2%', duration: '68 weeks', stage: 'Phase 3', status: 'ongoing', notes: '💎 Best-in-class (71 lbs) | Muscle preservation | Osteoarthritis pain relief' },
    { company: 'Amgen', drug: 'MariTide', type: 'Injection', molecule: 'GLP-1/GIP antagonist', targetCount: 2, frequency: 'Monthly', weightLoss: '20.0%', duration: '52 weeks', stage: 'Phase 3 Planned', status: 'ongoing', notes: '🗓️ Monthly dosing | Unique GIPR antagonist | MARITIME Phase 3 enrolling' },
    { company: 'Roche', drug: 'CT-388', type: 'Injection', molecule: 'GLP-1/GIP', targetCount: 2, frequency: 'Weekly', weightLoss: '18.8%', duration: '24 weeks', stage: 'Phase 3 Planned', status: 'ongoing', notes: '⚡ Biased signaling mechanism | Phase 3 H1 2026 | Combo with petrelintide planned' },
    { company: 'Pfizer', drug: 'MET-097i', type: 'Injection', molecule: 'GLP-1', targetCount: 1, frequency: 'Weekly/Monthly', weightLoss: 'TBD', duration: 'TBD', stage: 'Phase 2', status: 'ongoing', notes: '🎁 $10B Metsera acquisition | Monthly dosing | 15 trials starting 2026' },
    { company: 'Pfizer', drug: 'MET-233i', type: 'Injection', molecule: 'Amylin', targetCount: 1, frequency: 'Monthly', weightLoss: 'TBD', duration: 'TBD', stage: 'Phase 1', status: 'ongoing', notes: '🧬 Novel amylin analog | Combo with MET-097i in testing' }
  ];

  const marketData = dashboardData?.marketData || [];
  const intelligenceFeed = dashboardData?.intelligenceFeed || [];
  
  const fdaDate = new Date('2026-03-31');
  const today = new Date();
  const daysUntilFDA = Math.ceil((fdaDate - today) / (1000 * 60 * 60 * 24));

  const filteredPipeline = pipelineData.filter(drug => {
    const targetMatch = targetFilter === 'all' || drug.targetCount === parseInt(targetFilter);
    const stageMatch = stageFilter === 'all' || drug.stage === stageFilter;
    return targetMatch && stageMatch;
  });

  const uniqueStages = [...new Set(pipelineData.map(drug => drug.stage))];

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.8) return 'text-green-600';
    if (sentiment >= 0.65) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment >= 0.8) return t.veryBullish;
    if (sentiment >= 0.65) return t.bullish;
    return t.neutral;
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">{t.loadingData}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Tabs */}
        <div className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
          <div className="p-6 pb-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
                <p className="text-slate-600">{t.subtitle}</p>
              </div>
              <div className="flex items-start gap-4">
                {/* 语言切换按钮 */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
                  title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-slate-700">
                    {language === 'en' ? '中文' : 'English'}
                  </span>
                </button>
                
                <div className="text-right">
                  <div className="text-sm text-slate-500">{t.lastUpdated}</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {lastUpdate ? lastUpdate.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    }) : 'Loading...'}
                  </div>
                  <button 
                    onClick={loadDashboardData}
                    className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    {t.refreshData}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-0">
              {[
                { id: 'market', icon: '📊', label: t.tabMarket },
                { id: 'pipeline', icon: '💊', label: t.tabPipeline },
                { id: 'intelligence', icon: '📰', label: t.tabIntelligence },
                { id: 'catalysts', icon: '📅', label: t.tabCatalysts }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          
          {/* MARKET OVERVIEW TAB */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">{t.liveMarketTicker}</h2>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t.autoUpdating}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.map((stock) => (
                    <div key={stock.ticker} className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-2xl font-bold text-slate-900">{stock.ticker}</div>
                          <div className="text-sm text-slate-600">{stock.company}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(stock.sentiment)} bg-opacity-10`}>
                          {getSentimentLabel(stock.sentiment)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-slate-900">${stock.price.toFixed(2)}</span>
                          <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-semibold">
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t.marketCap}</span>
                          <span className="font-semibold text-slate-900">${stock.marketCap}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t.aiSentiment}</span>
                          <span className={`font-semibold ${getSentimentColor(stock.sentiment)}`}>
                            {(stock.sentiment * 100).toFixed(0)}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">{t.totalMarketCap}</h3>
                  <div className="text-4xl font-bold">$1.77T</div>
                  <div className="text-sm text-blue-100 mt-1">{t.combined6Companies}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">{t.marketGrowth}</h3>
                  <div className="text-4xl font-bold">$150B</div>
                  <div className="text-sm text-green-100 mt-1">{t.projectedBy2035}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">{t.activePrograms}</h3>
                  <div className="text-4xl font-bold">11</div>
                  <div className="text-sm text-purple-100 mt-1">{t.clinicalApproved}</div>
                </div>
              </div>
            </div>
          )}

          {/* PIPELINE TAB */}
          {activeTab === 'pipeline' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t.pipelineComparison}</h2>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-semibold text-slate-700">{t.filterBy}</span>
                  <select value={targetFilter} onChange={(e) => setTargetFilter(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white">
                    <option value="all">{t.allTargets}</option>
                    <option value="1">{t.singleGLP1}</option>
                    <option value="2">{t.dualGLP1GIP}</option>
                    <option value="3">{t.triple}</option>
                  </select>
                  <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white">
                    <option value="all">{t.allStages}</option>
                    {uniqueStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                  {(targetFilter !== 'all' || stageFilter !== 'all') && (
                    <button onClick={() => { setTargetFilter('all'); setStageFilter('all'); }} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium">
                      {t.reset}
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">{t.company}</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">{t.drug}</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">{t.type}</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">{t.targets}</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">{t.weightLoss}</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">{t.stage}</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">{t.keyAdvantages}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPipeline.map((drug, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{drug.company}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{drug.drug}</div>
                          <div className="text-xs text-slate-500">{drug.frequency}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {drug.type === 'Oral' ? <Pill className="w-4 h-4 text-blue-600 mx-auto" /> : <Syringe className="w-4 h-4 text-purple-600 mx-auto" />}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            drug.targetCount === 1 ? 'bg-blue-100 text-blue-700' :
                            drug.targetCount === 2 ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>{drug.targetCount}x</span>
                        </td>
                        <td className="py-3 px-4 text-center text-lg font-bold text-slate-900">{drug.weightLoss}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(drug.status)}`}>
                            {drug.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{drug.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">{t.intelligenceFeed}</h2>
              </div>
              <div className="space-y-3">
                {intelligenceFeed.map((item, idx) => (
                  <div key={idx} className={`rounded-lg p-4 ${getPriorityColor(item.priority)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded">{item.company}</span>
                      <span className="text-xs text-slate-500">{item.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.headline}</h3>
                    <p className="text-sm text-slate-700 mb-2">{item.summary}</p>
                    <span className="text-xs px-2 py-1 bg-white rounded font-medium text-slate-700">
                      {t.impact}: {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATALYSTS TAB */}
          {activeTab === 'catalysts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{t.fdaDecision}</h2>
                      <p className="text-orange-100">{t.lillyOralGLP1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold">{daysUntilFDA}</div>
                    <div className="text-lg text-orange-100">{t.days}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t.keyEvents2026}</h2>
                <div className="space-y-4">
                  {[
                    { date: 'Q1 2026', event: 'Pfizer: 15 New Trials Launch', desc: 'Phase 3 for MET-097i combinations' },
                    { date: 'Mar 2026', event: 'Lilly: Orforglipron FDA Decision', desc: 'Priority review voucher', critical: true },
                    { date: 'H1 2026', event: 'Roche: CT-388 Phase 3 Start', desc: 'Dual GLP-1/GIP' },
                    { date: 'Q2 2026', event: 'Lilly: Orforglipron Launch', desc: 'Commercial availability' },
                    { date: '2026', event: 'Lilly: 7 Retatrutide Readouts', desc: 'Triple agonist data' },
                    { date: 'Q4 2026', event: 'Novo: CagriSema Results', desc: 'GLP-1/Amylin combo' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                      <div className={`flex-shrink-0 w-24 text-right ${item.critical ? 'text-orange-600 font-bold' : 'text-slate-900 font-semibold'}`}>
                        {item.date}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{item.event}</div>
                        <div className="text-sm text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObesityDrugDashboard;
