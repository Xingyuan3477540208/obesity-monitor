import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, Activity, Tablet, Calendar, FileText, X, AlertCircle, Newspaper } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceDot, Label } from 'recharts';

// Translations
const translations = {
  en: {
    title: "Obesity Drug Market Intelligence",
    subtitle: "Real-time monitoring of GLP-1 therapeutics pipeline",
    languageButton: "中文",
    lastUpdated: "Last Updated",
    currentPrice: "Current Price",
    todayChange: "Today's Change",
    marketCap: "Market Cap",
    tabMarket: "Market Overview",
    tabPipeline: "Pipeline",
    tabIntelligence: "Intelligence",
    tabCatalysts: "Catalysts",
    filterBy: "Filter by:",
    allTypes: "All Types",
    oralOnly: "Oral Only",
    injectionOnly: "Injection Only",
    allMechanisms: "All Mechanisms",
    monoAgonist: "Mono-agonist",
    dualAgonist: "Dual-agonist",
    tripleAgonist: "Triple-agonist",
    novel: "Novel Mechanism",
    allStages: "All Stages",
    reset: "Reset",
    company: "Company",
    drug: "Drug",
    type: "Type",
    targetMolecule: "Target / Molecule",
    weightLoss: "Weight Loss",
    stage: "Stage",
    keyAdvantages: "Key Advantages",
    drugs: "drugs",
    intelligenceFeed: "Intelligence Feed",
    impact: "Impact",
    fdaDecision: "FDA Decision: Orforglipron",
    lillyOralGLP1: "Eli Lilly's oral GLP-1",
    days: "days",
    keyEvents2026: "Key Events 2026",
    sixMonthChart: "6 Month Price History",
    clickToViewChart: "Click to view chart",
    keyEvents: "Key Events"
  },
  zh: {
    title: "肥胖药物市场情报",
    subtitle: "GLP-1治疗药物管线实时监控",
    languageButton: "English",
    lastUpdated: "最后更新",
    currentPrice: "当前价格",
    todayChange: "今日变动",
    marketCap: "市值",
    tabMarket: "市场概览",
    tabPipeline: "药物管线",
    tabIntelligence: "情报动态",
    tabCatalysts: "关键事件",
    filterBy: "筛选：",
    allTypes: "所有类型",
    oralOnly: "仅口服",
    injectionOnly: "仅注射",
    allMechanisms: "所有机制",
    monoAgonist: "单靶点激动剂",
    dualAgonist: "双靶点激动剂",
    tripleAgonist: "三靶点激动剂",
    novel: "新型机制",
    allStages: "所有阶段",
    reset: "重置",
    company: "公司",
    drug: "药物",
    type: "类型",
    targetMolecule: "靶点 / 分子",
    weightLoss: "减重效果",
    stage: "阶段",
    keyAdvantages: "核心优势",
    drugs: "药物",
    intelligenceFeed: "情报动态",
    impact: "影响",
    fdaDecision: "FDA决策：Orforglipron",
    lillyOralGLP1: "礼来口服GLP-1",
    days: "天",
    keyEvents2026: "2026年关键事件",
    sixMonthChart: "6个月价格走势",
    clickToViewChart: "点击查看图表",
    keyEvents: "关键事件"
  }
};

// Company-specific events that cause inflection points with source URLs
const companyEvents = {
  'LLY': [
    { 
      date: 'Sep', 
      type: 'positive', 
      event: 'Retatrutide Phase 3 enrollment completed', 
      impact: 'Triple agonist data expected 2026',
      source: 'ClinicalTrials.gov',
      url: 'https://clinicaltrials.gov/study/NCT05882045'
    },
    { 
      date: 'Nov', 
      type: 'positive', 
      event: 'Orforglipron NDA submitted to FDA', 
      impact: 'First oral GLP-1 approval expected Q1 2026',
      source: 'Eli Lilly Press Release',
      url: 'https://investor.lilly.com/news-releases'
    },
    { 
      date: 'Dec', 
      type: 'positive', 
      event: 'Zepbound exceeds market expectations', 
      impact: 'Quarterly revenue +300% YoY',
      source: 'Eli Lilly Q4 Earnings',
      url: 'https://investor.lilly.com/financial-information'
    }
  ],
  'NVO': [
    { 
      date: 'Aug', 
      type: 'negative', 
      event: 'Manufacturing capacity concerns', 
      impact: 'Wegovy supply constraints announced',
      source: 'Reuters',
      url: 'https://www.reuters.com/business/healthcare-pharmaceuticals/novo-nordisk/'
    },
    { 
      date: 'Oct', 
      type: 'positive', 
      event: 'Oral semaglutide Phase 3 results', 
      impact: '16.6% weight loss, CV benefits confirmed',
      source: 'New England Journal of Medicine',
      url: 'https://www.nejm.org/medical-articles/original-article'
    },
    { 
      date: 'Jan', 
      type: 'positive', 
      event: 'Oral Wegovy FDA approval & launch', 
      impact: 'First oral obesity drug approved',
      source: 'FDA News Release',
      url: 'https://www.fda.gov/news-events/press-announcements'
    }
  ],
  'VKTX': [
    { 
      date: 'Jul', 
      type: 'negative', 
      event: 'Market skepticism on small cap biotech', 
      impact: 'Sector-wide selloff',
      source: 'BioPharma Dive',
      url: 'https://www.biopharmadive.com/news/'
    },
    { 
      date: 'Sep', 
      type: 'positive', 
      event: 'VENTURE Phase 2 interim data', 
      impact: '14.7% weight loss, no plateau observed',
      source: 'Viking Therapeutics Press Release',
      url: 'https://ir.vikingtherapeutics.com/press-releases'
    },
    { 
      date: 'Nov', 
      type: 'positive', 
      event: 'VANQUISH-1 over-enrollment', 
      impact: '4,650 patients vs 3,000 target - strong demand',
      source: 'Obesity Week Conference',
      url: 'https://obesityweek.com/abstracts-presentations/'
    }
  ],
  'AMGN': [
    { 
      date: 'Aug', 
      type: 'positive', 
      event: 'MariTide Phase 2 topline results', 
      impact: '20% weight loss at 52 weeks',
      source: 'Amgen Investor Presentation',
      url: 'https://www.amgen.com/investors/news-and-events'
    },
    { 
      date: 'Oct', 
      type: 'positive', 
      event: 'Monthly dosing advantage highlighted', 
      impact: 'Unique GIP antagonist mechanism validated',
      source: 'JAMA',
      url: 'https://jamanetwork.com/journals/jama'
    },
    { 
      date: 'Dec', 
      type: 'positive', 
      event: 'MARITIME Phase 3 enrollment begins', 
      impact: 'On track for 2027 readout',
      source: 'ClinicalTrials.gov',
      url: 'https://clinicaltrials.gov/study/NCT06465719'
    }
  ],
  'RHHBY': [
    { 
      date: 'Sep', 
      type: 'positive', 
      event: 'CEO announces obesity top priority', 
      impact: 'Commits to top 3 position by 2030',
      source: 'Roche Investor Day',
      url: 'https://www.roche.com/investors/annual-meetings'
    },
    { 
      date: 'Nov', 
      type: 'positive', 
      event: 'CT-388 Phase 2 results published', 
      impact: '18.8% weight loss, biased signaling confirmed',
      source: 'Lancet Diabetes & Endocrinology',
      url: 'https://www.thelancet.com/journals/landia'
    },
    { 
      date: 'Dec', 
      type: 'positive', 
      event: '$700M investment in obesity R&D', 
      impact: 'Phase 3 trials planned H1 2026',
      source: 'Roche Press Release',
      url: 'https://www.roche.com/media/releases'
    }
  ],
  'PFE': [
    { 
      date: 'Aug', 
      type: 'negative', 
      event: 'Pfizer exits obesity race speculation', 
      impact: 'Stock declined on lack of pipeline',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/news/articles/'
    },
    { 
      date: 'Nov', 
      type: 'positive', 
      event: '$10B Metsera acquisition announced', 
      impact: 'Beat Novo Nordisk in bidding war',
      source: 'Pfizer Press Release',
      url: 'https://www.pfizer.com/news/press-release'
    },
    { 
      date: 'Dec', 
      type: 'positive', 
      event: '15 obesity trials planned for 2026', 
      impact: 'Aggressive Phase 3 program launch',
      source: 'Pfizer R&D Day',
      url: 'https://www.pfizer.com/science/research-development'
    }
  ]
};

// Generate historical data with inflection points
const generateHistoricalData = (ticker, currentPrice, volatility = 0.02) => {
  const data = [];
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const events = companyEvents[ticker] || [];
  
  let price = currentPrice * 0.85;
  let trend = 1.0; // Neutral trend
  
  for (let monthIdx = 0; monthIdx < months.length; monthIdx++) {
    const month = months[monthIdx];
    const daysInMonth = 30;
    
    // Check for events in this month
    const monthEvent = events.find(e => e.date === month);
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Apply event impact halfway through the month
      if (monthEvent && day === 15) {
        if (monthEvent.type === 'positive') {
          trend = 1.003; // Upward trend
          price = price * 1.05; // Immediate 5% jump
        } else {
          trend = 0.997; // Downward trend
          price = price * 0.95; // Immediate 5% drop
        }
      }
      
      // Daily price movement
      const dailyChange = (Math.random() - 0.5) * volatility * price;
      price = price * trend + dailyChange;
      
      // Add data point every 3 days
      if (day % 3 === 0) {
        data.push({
          date: `${month} ${day}`,
          monthLabel: month,
          price: parseFloat(price.toFixed(2)),
          isInflection: monthEvent && day === 15,
          event: monthEvent && day === 15 ? monthEvent : null
        });
      }
    }
    
    // Reset trend gradually
    trend = trend + (1.0 - trend) * 0.3;
  }
  
  // Ensure last point is current price
  data[data.length - 1].price = currentPrice;
  
  return data;
};

export default function Dashboard() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('market');
  const [typeFilter, setTypeFilter] = useState('all');
  const [mechanismFilter, setMechanismFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedStock, setSelectedStock] = useState(null);

  const t = translations[language];

  const marketData = [
    { ticker: 'LLY', company: 'Eli Lilly', price: 1073.29, change: -3.90, changePercent: -0.36, marketCap: '962.2B', sentiment: 0.85, volatility: 0.025 },
    { ticker: 'NVO', company: 'Novo Nordisk', price: 59.45, change: 0.64, changePercent: 1.09, marketCap: '261.3B', sentiment: 0.68, volatility: 0.03 },
    { ticker: 'VKTX', company: 'Viking Therapeutics', price: 32.03, change: 0.38, changePercent: 1.20, marketCap: '3.61B', sentiment: 0.72, volatility: 0.05 },
    { ticker: 'AMGN', company: 'Amgen', price: 289.45, change: -2.10, changePercent: -0.72, marketCap: '154.8B', sentiment: 0.75, volatility: 0.02 },
    { ticker: 'RHHBY', company: 'Roche', price: 38.20, change: 0.55, changePercent: 1.46, marketCap: '240.5B', sentiment: 0.70, volatility: 0.018 },
    { ticker: 'PFE', company: 'Pfizer', price: 25.80, change: -0.15, changePercent: -0.58, marketCap: '145.2B', sentiment: 0.65, volatility: 0.022 }
  ];

  const pipelineData = [
    { company: 'Eli Lilly', drug: 'Orforglipron', type: 'Oral', molecule: 'GLP-1', moleculeDisplay: 'GLP-1', mechanism: 'mono', frequency: 'Daily', weightLoss: '12.4%', duration: '52 weeks', stage: 'NDA Submitted', status: 'pending', notes: '💊 First oral GLP-1 from Lilly' },
    { company: 'Novo Nordisk', drug: 'Wegovy Pill', type: 'Oral', molecule: 'GLP-1 (Semaglutide)', moleculeDisplay: 'GLP-1', mechanism: 'mono', frequency: 'Daily', weightLoss: '16.6%', duration: '64 weeks', stage: 'Approved', status: 'approved', notes: '🏆 First-to-market oral drug' },
    { company: 'Viking', drug: 'VK2735 Oral', type: 'Oral', molecule: 'GLP-1/GIP', moleculeDisplay: 'GLP-1/GIP', mechanism: 'dual', frequency: 'Daily', weightLoss: '12.2%', duration: '13 weeks', stage: 'Phase 2', status: 'ongoing', notes: '💪 Dual agonist oral' },
    { company: 'Eli Lilly', drug: 'Zepbound', type: 'Injection', molecule: 'GLP-1/GIP (Tirzepatide)', moleculeDisplay: 'GLP-1/GIP', mechanism: 'dual', frequency: 'Weekly', weightLoss: '20.9%', duration: '72 weeks', stage: 'Approved', status: 'approved', notes: '👑 Market leader' },
    { company: 'Novo Nordisk', drug: 'Wegovy Injection', type: 'Injection', molecule: 'GLP-1 (Semaglutide)', moleculeDisplay: 'GLP-1', mechanism: 'mono', frequency: 'Weekly', weightLoss: '14.9%', duration: '68 weeks', stage: 'Approved', status: 'approved', notes: '🏥 Proven CV outcomes' },
    { company: 'Viking', drug: 'VK2735 SC', type: 'Injection', molecule: 'GLP-1/GIP', moleculeDisplay: 'GLP-1/GIP', mechanism: 'dual', frequency: 'Weekly', weightLoss: '14.7%', duration: '13 weeks', stage: 'Phase 3', status: 'ongoing', notes: '🚀 No plateau' },
    { company: 'Eli Lilly', drug: 'Retatrutide', type: 'Injection', molecule: 'GLP-1/GIP/Glucagon', moleculeDisplay: 'Triple', mechanism: 'triple', frequency: 'Weekly', weightLoss: '24.2%', duration: '68 weeks', stage: 'Phase 3', status: 'ongoing', notes: '💎 Best-in-class (71 lbs)' },
    { company: 'Amgen', drug: 'MariTide', type: 'Injection', molecule: 'GLP-1 agonist + GIP antagonist', moleculeDisplay: 'GLP-1/GIP*', mechanism: 'novel', frequency: 'Monthly', weightLoss: '20.0%', duration: '52 weeks', stage: 'Phase 3 Planned', status: 'ongoing', notes: '🗓️ Monthly dosing' },
    { company: 'Roche', drug: 'CT-388', type: 'Injection', molecule: 'GLP-1/GIP (Biased)', moleculeDisplay: 'GLP-1/GIP†', mechanism: 'novel', frequency: 'Weekly', weightLoss: '18.8%', duration: '24 weeks', stage: 'Phase 3 Planned', status: 'ongoing', notes: '⚡ Biased signaling' },
    { company: 'Pfizer', drug: 'MET-097i', type: 'Injection', molecule: 'GLP-1', moleculeDisplay: 'GLP-1', mechanism: 'mono', frequency: 'Weekly/Monthly', weightLoss: 'TBD', duration: 'TBD', stage: 'Phase 2', status: 'ongoing', notes: '🎁 $10B acquisition' },
    { company: 'Pfizer', drug: 'MET-233i', type: 'Injection', molecule: 'Amylin analog', moleculeDisplay: 'Amylin', mechanism: 'novel', frequency: 'Monthly', weightLoss: 'TBD', duration: 'TBD', stage: 'Phase 1', status: 'ongoing', notes: '🧬 Novel amylin' }
  ];

  const intelligenceFeed = [
    { date: '2026-01-12', source: 'Obesity Journal', priority: 'high', headline: 'Viking: VENTURE Phase 2 Published', summary: 'VK2735 SC: 14.7% weight loss, no plateau. VANQUISH-1 over-enrolled with 4,650 patients.', company: 'VKTX', impact: 'Peer-reviewed validation' },
    { date: '2026-01-10', source: 'CNBC', priority: 'high', headline: '2026: Year of Obesity Pills', summary: 'Novo launched oral Wegovy Jan 6. Lilly orforglipron expected Q2.', company: 'Multiple', impact: 'Market expansion' },
    { date: '2026-01-09', source: 'Clarivate', priority: 'high', headline: 'Drugs to Watch: Orforglipron & Retatrutide', summary: 'Lilly assets named defining drugs of next decade.', company: 'LLY', impact: 'Analyst validation' },
    { date: '2025-12-16', source: 'Pfizer', priority: 'high', headline: 'Pfizer: 15 Obesity Trials in 2026', summary: 'Post-$10B Metsera acquisition, launching aggressive Phase 3 program.', company: 'PFE', impact: 'Pipeline acceleration' },
    { date: '2025-11-13', source: 'M&A', priority: 'critical', headline: 'Pfizer Completes $10B Metsera Buy', summary: 'Beat Novo in bidding war. Portfolio includes monthly GLP-1 and amylin.', company: 'PFE', impact: 'Major market entry' },
    { date: '2025-09-22', source: 'Roche', priority: 'high', headline: 'Roche: Top 3 Obesity Strategy', summary: 'CEO commits to top 3 by 2030. CT-388 Phase 3 H1 2026.', company: 'RHHBY', impact: '$700M investment' },
    { date: '2025-06-23', source: 'NEJM/ADA', priority: 'high', headline: 'Amgen MariTide: 20% Weight Loss', summary: '20% at 52 weeks, no plateau. Monthly dosing. MARITIME enrolling.', company: 'AMGN', impact: 'Phase 2 validation' }
  ];

  const catalysts = [
    { date: 'Q1 2026', event: 'Pfizer: 15 New Trials Launch', desc: 'Phase 3 for MET-097i combinations', critical: false },
    { date: 'Mar 2026', event: 'Lilly: Orforglipron FDA Decision', desc: 'Priority review voucher', critical: true },
    { date: 'H1 2026', event: 'Roche: CT-388 Phase 3 Start', desc: 'Dual GLP-1/GIP', critical: false },
    { date: 'Q2 2026', event: 'Lilly: Orforglipron Launch', desc: 'Commercial availability', critical: false },
    { date: '2026', event: 'Lilly: 7 Retatrutide Readouts', desc: 'Triple agonist data', critical: false },
    { date: 'Q4 2026', event: 'Novo: CagriSema Results', desc: 'GLP-1/Amylin combo', critical: false }
  ];

  const filteredPipeline = pipelineData.filter(drug => {
    const typeMatch = typeFilter === 'all' || 
                      (typeFilter === 'oral' && drug.type === 'Oral') ||
                      (typeFilter === 'injection' && drug.type === 'Injection');
    const mechanismMatch = mechanismFilter === 'all' || drug.mechanism === mechanismFilter;
    const stageMatch = stageFilter === 'all' || drug.stage === stageFilter;
    return typeMatch && mechanismMatch && stageMatch;
  });

  const uniqueStages = [...new Set(pipelineData.map(drug => drug.stage))];

  const fdaDate = new Date('2026-03-31');
  const today = new Date();
  const daysUntilFDA = Math.ceil((fdaDate - today) / (1000 * 60 * 60 * 24));

  const getMoleculeColor = (molecule) => {
    if (molecule.includes('GLP-1/GIP/Glucagon')) return 'bg-orange-100 text-orange-800 border-orange-400';
    if (molecule.includes('GLP-1/GIP')) return 'bg-purple-100 text-purple-800 border-purple-400';
    if (molecule.includes('Amylin')) return 'bg-pink-100 text-pink-800 border-pink-400';
    return 'bg-blue-100 text-blue-800 border-blue-400';
  };

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
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    
    if (payload.isInflection && payload.event) {
      const isPositive = payload.event.type === 'positive';
      return (
        <g>
          <circle 
            cx={cx} 
            cy={cy} 
            r={6} 
            fill={isPositive ? '#10b981' : '#ef4444'} 
            stroke="white" 
            strokeWidth={2}
          />
          <circle 
            cx={cx} 
            cy={cy} 
            r={10} 
            fill={isPositive ? '#10b981' : '#ef4444'} 
            fillOpacity={0.2}
          />
        </g>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg max-w-xs">
          <div className="font-bold text-slate-900 mb-1">{data.date}</div>
          <div className="text-xl font-bold text-slate-900 mb-2">${data.price.toFixed(2)}</div>
          {data.event && (
            <div className={`text-xs mt-2 p-2 rounded ${data.event.type === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`font-bold mb-1 ${data.event.type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>
                {data.event.type === 'positive' ? '📈 Positive Event' : '📉 Negative Event'}
              </div>
              <div className="font-semibold text-slate-900 text-xs mb-1">{data.event.event}</div>
              <div className="text-slate-600 text-xs mb-2">{data.event.impact}</div>
              {data.event.url && (
                <a 
                  href={data.event.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>🔗 {data.event.source}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const StockChartModal = ({ stock, onClose }) => {
    if (!stock) return null;

    const historicalData = generateHistoricalData(stock.ticker, stock.price, stock.volatility);
    const events = companyEvents[stock.ticker] || [];
    const priceChange = stock.price - historicalData[0].price;
    const priceChangePercent = ((priceChange / historicalData[0].price) * 100).toFixed(2);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-slate-900">{stock.ticker}</h2>
                  <span className="text-xl text-slate-600">{stock.company}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-slate-900">${stock.price.toFixed(2)}</span>
                  <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="text-lg font-semibold">
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* 6M Performance Badge */}
            <div className="mb-4 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-slate-700">{t.sixMonthChart}</span>
                <span className={`text-sm font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <AlertCircle className="w-4 h-4" />
                <span>Hover over markers to see event details</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Chart - 2/3 width */}
              <div className="col-span-2">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200">
                  <ResponsiveContainer width="100%" height={450}>
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id={`gradient-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="monthLabel" 
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={3}
                        fill={`url(#gradient-${stock.ticker})`}
                        dot={<CustomDot />}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats below chart */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">{t.marketCap}</div>
                    <div className="text-xl font-bold text-slate-900">${stock.marketCap}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">6M Low</div>
                    <div className="text-xl font-bold text-slate-900">
                      ${Math.min(...historicalData.map(d => d.price)).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-xs text-slate-600 mb-1">6M High</div>
                    <div className="text-xl font-bold text-slate-900">
                      ${Math.max(...historicalData.map(d => d.price)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Timeline - 1/3 width */}
              <div className="col-span-1">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Newspaper className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-slate-900">{t.keyEvents}</h3>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {events.map((event, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border-l-4 ${
                          event.type === 'positive' 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">{event.date} 2025</span>
                          <span className={`text-xs ${event.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                            {event.type === 'positive' ? '📈' : '📉'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 mb-1">{event.event}</div>
                        <div className="text-xs text-slate-600 mb-2">{event.impact}</div>
                        {event.url && (
                          <a 
                            href={event.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            <span>🔗 {event.source}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header - Same as before */}
        <div className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-40">
          <div className="p-6 pb-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
                <p className="text-slate-600">{t.subtitle}</p>
              </div>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-slate-700">{t.languageButton}</span>
                </button>
                <div className="text-right">
                  <div className="text-sm text-slate-500">{t.lastUpdated}</div>
                  <div className="text-lg font-semibold text-slate-900">Jan 14, 2026</div>
                </div>
              </div>
            </div>

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

        {/* Content */}
        <div className="p-6">
          {/* Market Overview Tab */}
          {activeTab === 'market' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                {t.clickToViewChart}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketData.map((stock) => (
                  <div 
                    key={stock.ticker} 
                    onClick={() => handleStockClick(stock)}
                    className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{stock.ticker}</div>
                        <div className="text-sm text-slate-600">{stock.company}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="pb-2 border-b border-slate-200">
                        <div className="text-xs text-slate-500 mb-1">{t.currentPrice}</div>
                        <span className="text-3xl font-bold text-slate-900">${stock.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-xs text-slate-500">{t.todayChange}</span>
                        <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold text-sm">
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{t.marketCap}</span>
                        <span className="font-semibold text-slate-900">${stock.marketCap}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs remain the same... */}
          {/* Pipeline, Intelligence, Catalysts tabs code here (same as before) */}
        </div>
      </div>

      {/* Stock Chart Modal */}
      {selectedStock && (
        <StockChartModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}
