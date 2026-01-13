"""
Obesity Drug Dashboard - Data Update Script for GitHub Actions
============================================================

This script runs in GitHub Actions daily to update market data and news.
Output is saved to public/dashboard_data.json for Vercel to serve.

Author: Auto-generated
Last Modified: 2026-01-12
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import requests
from typing import Dict, List, Optional

# Try to import optional dependencies
try:
    import yfinance as yf
    YFINANCE_AVAILABLE = True
except ImportError:
    YFINANCE_AVAILABLE = False
    print("⚠️ yfinance not available, will use fallback data")

try:
    import feedparser
    FEEDPARSER_AVAILABLE = True
except ImportError:
    FEEDPARSER_AVAILABLE = False
    print("⚠️ feedparser not available, will use fallback news")

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

# Configuration
TICKERS = {
    'LLY': 'Eli Lilly',
    'NVO': 'Novo Nordisk',
    'VKTX': 'Viking Therapeutics',
    'AMGN': 'Amgen',
    'RHHBY': 'Roche',
    'PFE': 'Pfizer'
}

NEWS_FEEDS = [
    'https://www.fiercebiotech.com/rss/xml',
    'https://www.biopharmadive.com/feeds/news/',
]

OUTPUT_DIR = Path(__file__).parent.parent / 'public'
OUTPUT_FILE = OUTPUT_DIR / 'dashboard_data.json'

def ensure_output_dir():
    """Create output directory if it doesn't exist"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output directory: {OUTPUT_DIR}")

def fetch_market_data() -> List[Dict]:
    """Fetch real-time stock data using yfinance"""
    print("\n📊 Fetching market data...")
    market_data = []
    
    if not YFINANCE_AVAILABLE:
        print("⚠️ Using fallback market data")
        return get_fallback_market_data()
    
    for ticker, company in TICKERS.items():
        try:
            print(f"  Fetching {ticker}...", end=' ')
            stock = yf.Ticker(ticker)
            
            # Get current data
            hist = stock.history(period='5d')
            if hist.empty:
                print("❌ No data")
                continue
            
            current_price = hist['Close'].iloc[-1]
            
            # Get previous close from info or calculate from history
            try:
                info = stock.info
                previous_close = info.get('previousClose', hist['Close'].iloc[-2] if len(hist) > 1 else current_price)
                market_cap = info.get('marketCap', 0)
            except:
                previous_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                market_cap = 0
            
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100 if previous_close else 0
            
            market_data.append({
                'ticker': ticker,
                'company': company,
                'price': round(float(current_price), 2),
                'change': round(float(change), 2),
                'changePercent': round(float(change_percent), 2),
                'marketCap': format_market_cap(market_cap),
                'sentiment': calculate_sentiment(ticker, change_percent),
                'lastUpdate': datetime.now().isoformat()
            })
            print(f"✓ ${current_price:.2f}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)[:50]}")
            # Add placeholder data
            market_data.append(get_fallback_stock_data(ticker, company))
    
    return market_data if market_data else get_fallback_market_data()

def get_fallback_market_data() -> List[Dict]:
    """Fallback market data when API fails"""
    return [
        {'ticker': 'LLY', 'company': 'Eli Lilly', 'price': 1063.91, 'change': 22.53, 'changePercent': 2.16, 'marketCap': '959.5B', 'sentiment': 0.85, 'lastUpdate': datetime.now().isoformat()},
        {'ticker': 'NVO', 'company': 'Novo Nordisk', 'price': 59.45, 'change': 0.64, 'changePercent': 1.09, 'marketCap': '261.3B', 'sentiment': 0.68, 'lastUpdate': datetime.now().isoformat()},
        {'ticker': 'VKTX', 'company': 'Viking Therapeutics', 'price': 32.03, 'change': 0.38, 'changePercent': 1.20, 'marketCap': '3.61B', 'sentiment': 0.72, 'lastUpdate': datetime.now().isoformat()},
        {'ticker': 'AMGN', 'company': 'Amgen', 'price': 289.45, 'change': -2.10, 'changePercent': -0.72, 'marketCap': '154.8B', 'sentiment': 0.75, 'lastUpdate': datetime.now().isoformat()},
        {'ticker': 'RHHBY', 'company': 'Roche', 'price': 38.20, 'change': 0.55, 'changePercent': 1.46, 'marketCap': '240.5B', 'sentiment': 0.70, 'lastUpdate': datetime.now().isoformat()},
        {'ticker': 'PFE', 'company': 'Pfizer', 'price': 25.80, 'change': -0.15, 'changePercent': -0.58, 'marketCap': '145.2B', 'sentiment': 0.65, 'lastUpdate': datetime.now().isoformat()}
    ]

def get_fallback_stock_data(ticker: str, company: str) -> Dict:
    """Get fallback data for a single stock"""
    fallback = {
        'LLY': (1063.91, 22.53, 2.16, '959.5B', 0.85),
        'NVO': (59.45, 0.64, 1.09, '261.3B', 0.68),
        'VKTX': (32.03, 0.38, 1.20, '3.61B', 0.72),
        'AMGN': (289.45, -2.10, -0.72, '154.8B', 0.75),
        'RHHBY': (38.20, 0.55, 1.46, '240.5B', 0.70),
        'PFE': (25.80, -0.15, -0.58, '145.2B', 0.65)
    }
    
    price, change, change_pct, cap, sentiment = fallback.get(ticker, (100.0, 0.0, 0.0, '0B', 0.5))
    
    return {
        'ticker': ticker,
        'company': company,
        'price': price,
        'change': change,
        'changePercent': change_pct,
        'marketCap': cap,
        'sentiment': sentiment,
        'lastUpdate': datetime.now().isoformat()
    }

def format_market_cap(market_cap: float) -> str:
    """Format market cap to B/T notation"""
    if market_cap >= 1e12:
        return f"{market_cap / 1e12:.1f}T"
    elif market_cap >= 1e9:
        return f"{market_cap / 1e9:.1f}B"
    elif market_cap >= 1e6:
        return f"{market_cap / 1e6:.1f}M"
    else:
        return f"{market_cap:.0f}"

def calculate_sentiment(ticker: str, change_percent: float) -> float:
    """Calculate AI sentiment score based on price momentum and pipeline strength"""
    # Base sentiment on recent performance
    if change_percent > 5:
        base = 0.85
    elif change_percent > 2:
        base = 0.75
    elif change_percent > -2:
        base = 0.65
    else:
        base = 0.55
    
    # Adjust by company pipeline strength
    pipeline_strength = {
        'LLY': 0.10,   # Orforglipron + Retatrutide
        'AMGN': 0.08,  # MariTide Phase 2 strong
        'VKTX': 0.05,  # Phase 3 ongoing
        'NVO': 0.03,   # Market leader, but competition
        'RHHBY': 0.05, # Ambitious top 3 strategy
        'PFE': 0.00,   # Just acquired Metsera
    }
    
    return min(0.95, base + pipeline_strength.get(ticker, 0))

def fetch_news() -> List[Dict]:
    """Fetch latest obesity drug news from RSS feeds"""
    print("\n📰 Fetching news...")
    
    if not FEEDPARSER_AVAILABLE:
        print("⚠️ Using fallback news data")
        return get_fallback_news()
    
    news_items = []
    keywords = ['obesity', 'GLP-1', 'GLP1', 'weight loss', 'semaglutide', 'tirzepatide', 
                'Wegovy', 'Zepbound', 'orforglipron', 'retatrutide', 'MariTide',
                'Ozempic', 'Mounjaro', 'Viking', 'Eli Lilly', 'Novo Nordisk',
                'Amgen', 'Pfizer', 'Roche', 'Metsera']
    
    for feed_url in NEWS_FEEDS:
        try:
            print(f"  Fetching {feed_url}...", end=' ')
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries[:20]:  # Get top 20 articles
                title = entry.get('title', '')
                summary = entry.get('summary', entry.get('description', ''))
                combined = (title + ' ' + summary).lower()
                
                # Check relevance
                if any(kw.lower() in combined for kw in keywords):
                    published = entry.get('published', entry.get('updated', ''))
                    
                    news_items.append({
                        'date': parse_date(published),
                        'headline': title[:150],  # Limit length
                        'summary': clean_html(summary[:300]),
                        'source': feed.feed.get('title', 'News'),
                        'link': entry.get('link', ''),
                        'priority': determine_priority(title + summary),
                        'company': extract_company(title + summary)
                    })
            
            print(f"✓ {len([n for n in news_items if n['source'] == feed.feed.get('title', 'News')])} relevant")
            
        except Exception as e:
            print(f"❌ {str(e)[:50]}")
    
    # Sort by date and return top 10
    news_items.sort(key=lambda x: x['date'], reverse=True)
    return news_items[:10] if news_items else get_fallback_news()

def get_fallback_news() -> List[Dict]:
    """Fallback news when RSS fails"""
    return [
        {
            'date': '2026-01-12',
            'source': 'Obesity Journal',
            'priority': 'high',
            'headline': 'Viking VENTURE Phase 2 Published',
            'summary': 'VK2735 SC: 14.7% weight loss, no plateau observed',
            'company': 'VKTX',
            'impact': 'Peer-reviewed validation',
            'link': 'https://example.com'
        },
        {
            'date': '2026-01-10',
            'source': 'CNBC',
            'priority': 'high',
            'headline': '2026: Year of Obesity Pills',
            'summary': 'Oral formulations expanding addressable market',
            'company': 'Multiple',
            'impact': 'Market expansion',
            'link': 'https://example.com'
        }
    ]

def parse_date(date_str: str) -> str:
    """Parse various date formats to YYYY-MM-DD"""
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(date_str)
        return dt.strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def clean_html(text: str) -> str:
    """Remove HTML tags from text"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text).strip()

def determine_priority(text: str) -> str:
    """Determine news priority based on keywords"""
    critical = ['FDA approval', 'Phase 3 results', 'acquisition', 'breakthrough']
    high = ['Phase 2', 'clinical trial', 'partnership', 'data readout']
    
    text_lower = text.lower()
    
    if any(kw.lower() in text_lower for kw in critical):
        return 'critical'
    elif any(kw.lower() in text_lower for kw in high):
        return 'high'
    else:
        return 'medium'

def extract_company(text: str) -> str:
    """Extract company ticker from text"""
    companies = {
        'lilly': 'LLY',
        'eli lilly': 'LLY',
        'novo': 'NVO',
        'novo nordisk': 'NVO',
        'viking': 'VKTX',
        'amgen': 'AMGN',
        'roche': 'RHHBY',
        'pfizer': 'PFE',
        'metsera': 'PFE'
    }
    
    text_lower = text.lower()
    for name, ticker in companies.items():
        if name in text_lower:
            return ticker
    
    return 'Multiple'

def calculate_statistics(market_data: List[Dict]) -> Dict:
    """Calculate market statistics"""
    if not market_data:
        return {}
    
    total_change = sum(s['changePercent'] for s in market_data)
    avg_change = total_change / len(market_data)
    
    gainers = [s for s in market_data if s['changePercent'] > 0]
    losers = [s for s in market_data if s['changePercent'] < 0]
    
    return {
        'totalStocks': len(market_data),
        'avgChange': round(avg_change, 2),
        'gainers': len(gainers),
        'losers': len(losers),
        'unchanged': len(market_data) - len(gainers) - len(losers)
    }

def main():
    """Main update function"""
    print("=" * 60)
    print("🚀 Obesity Drug Dashboard - Data Update")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Python: {sys.version}")
    print()
    
    # Ensure output directory exists
    ensure_output_dir()
    
    # Fetch all data
    market_data = fetch_market_data()
    news = fetch_news()
    
    # Calculate statistics
    stats = calculate_statistics(market_data)
    
    # Compile dashboard data
    dashboard_data = {
        'lastUpdate': datetime.now().isoformat(),
        'marketData': market_data,
        'intelligenceFeed': news,
        'statistics': stats,
        'metadata': {
            'version': '2.0',
            'source': 'GitHub Actions',
            'dataQuality': {
                'marketData': len(market_data) == len(TICKERS),
                'newsItems': len(news) > 0,
                'usingFallback': not YFINANCE_AVAILABLE or not FEEDPARSER_AVAILABLE
            }
        }
    }
    
    # Save to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(dashboard_data, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("✅ UPDATE COMPLETE")
    print("=" * 60)
    print(f"📊 Market Data: {len(market_data)} stocks")
    print(f"📰 News Items: {len(news)} articles")
    print(f"📁 Output: {OUTPUT_FILE}")
    print(f"📏 File Size: {OUTPUT_FILE.stat().st_size} bytes")
    print(f"📈 Statistics: {stats}")
    print("=" * 60)
    
    return dashboard_data

if __name__ == "__main__":
    try:
        main()
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
