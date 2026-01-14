"""
Obesity Drug Dashboard - Automated Daily Update System
=====================================================

This script fetches latest market data and news to keep the dashboard current.
Schedule with cron (Linux/Mac) or Task Scheduler (Windows) to run daily.

Requirements:
    pip install requests pandas yfinance beautifulsoup4 feedparser --break-system-packages

Usage:
    python update_dashboard_data.py
"""

import json
import requests
from datetime import datetime, timedelta
import yfinance as yf
import feedparser
from pathlib import Path

# Configuration
TICKERS = ['LLY', 'NVO', 'VKTX', 'AMGN', 'RHHBY', 'PFE']
OUTPUT_FILE = 'dashboard_data.json'
NEWS_SOURCES = [
    'https://www.fiercebiotech.com/rss/xml',
    'https://www.biopharmadive.com/feeds/news/',
]

def fetch_market_data():
    """Fetch real-time stock data using yfinance"""
    print("📊 Fetching market data...")
    market_data = []
    
    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period='1d')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                previous_close = info.get('previousClose', current_price)
                change = current_price - previous_close
                change_percent = (change / previous_close) * 100
                
                market_data.append({
                    'ticker': ticker,
                    'company': info.get('longName', ticker),
                    'price': round(current_price, 2),
                    'change': round(change, 2),
                    'changePercent': round(change_percent, 2),
                    'marketCap': format_market_cap(info.get('marketCap', 0)),
                    'sentiment': calculate_sentiment(ticker, change_percent),
                    'lastUpdate': datetime.now().isoformat()
                })
                print(f"  ✓ {ticker}: ${current_price:.2f}")
        except Exception as e:
            print(f"  ✗ Error fetching {ticker}: {e}")
    
    return market_data

def format_market_cap(market_cap):
    """Format market cap to B/T notation"""
    if market_cap >= 1e12:
        return f"{market_cap / 1e12:.1f}T"
    elif market_cap >= 1e9:
        return f"{market_cap / 1e9:.1f}B"
    elif market_cap >= 1e6:
        return f"{market_cap / 1e6:.1f}M"
    else:
        return f"{market_cap:.0f}"

def calculate_sentiment(ticker, change_percent):
    """Calculate AI sentiment score based on price momentum and company"""
    # Base sentiment on recent performance
    if change_percent > 5:
        base = 0.85
    elif change_percent > 2:
        base = 0.75
    elif change_percent > -2:
        base = 0.65
    else:
        base = 0.55
    
    # Adjust by company pipeline strength (based on our analysis)
    adjustments = {
        'LLY': 0.10,   # Strong pipeline (Orforglipron, Retatrutide)
        'AMGN': 0.08,  # MariTide strong Phase 2
        'VKTX': 0.05,  # Viking Phase 3 ongoing
        'NVO': 0.03,   # Market leader but competition increasing
        'RHHBY': 0.05, # Ambitious strategy
        'PFE': 0.00,   # Just acquired Metsera
    }
    
    return min(0.95, base + adjustments.get(ticker, 0))

def fetch_news():
    """Fetch latest obesity drug news from RSS feeds"""
    print("\n📰 Fetching intelligence feed...")
    news_items = []
    
    keywords = ['obesity', 'GLP-1', 'weight loss', 'semaglutide', 'tirzepatide', 
                'Wegovy', 'Zepbound', 'orforglipron', 'retatrutide', 'MariTide']
    
    for feed_url in NEWS_SOURCES:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:10]:  # Get recent 10 articles
                title = entry.get('title', '')
                summary = entry.get('summary', entry.get('description', ''))
                
                # Check if article is relevant
                if any(keyword.lower() in (title + summary).lower() for keyword in keywords):
                    news_items.append({
                        'date': entry.get('published', datetime.now().strftime('%Y-%m-%d')),
                        'headline': title,
                        'summary': summary[:200] + '...' if len(summary) > 200 else summary,
                        'source': feed.feed.get('title', 'News'),
                        'link': entry.get('link', ''),
                        'priority': determine_priority(title + summary)
                    })
            print(f"  ✓ Fetched from {feed.feed.get('title', feed_url)}")
        except Exception as e:
            print(f"  ✗ Error fetching feed {feed_url}: {e}")
    
    # Sort by date and return top 10
    news_items.sort(key=lambda x: x['date'], reverse=True)
    return news_items[:10]

def determine_priority(text):
    """Determine news priority based on keywords"""
    critical_keywords = ['FDA approval', 'Phase 3 results', 'acquisition', 'breakthrough']
    high_keywords = ['Phase 2', 'clinical trial', 'partnership', 'data']
    
    text_lower = text.lower()
    
    if any(kw.lower() in text_lower for kw in critical_keywords):
        return 'critical'
    elif any(kw.lower() in text_lower for kw in high_keywords):
        return 'high'
    else:
        return 'medium'

def fetch_fda_calendar():
    """Check FDA calendar for upcoming obesity drug decisions"""
    print("\n📅 Checking FDA calendar...")
    
    # This would ideally scrape FDA.gov or use an API
    # For now, we'll return our known catalysts
    known_catalysts = [
        {
            'date': '2026-03-31',
            'event': 'Orforglipron FDA Decision',
            'company': 'LLY',
            'description': 'Priority review for oral GLP-1',
            'type': 'regulatory'
        },
        {
            'date': '2026-06-30',
            'event': 'CT-388 Phase 3 Initiation',
            'company': 'RHHBY',
            'description': 'Roche dual GLP-1/GIP',
            'type': 'clinical'
        }
    ]
    
    return known_catalysts

def update_dashboard_json():
    """Main function to update all dashboard data"""
    print("🚀 Starting dashboard data update...\n")
    
    # Fetch all data
    market_data = fetch_market_data()
    news = fetch_news()
    catalysts = fetch_fda_calendar()
    
    # Compile complete data structure
    dashboard_data = {
        'lastUpdate': datetime.now().isoformat(),
        'marketData': market_data,
        'intelligenceFeed': news,
        'upcomingCatalysts': catalysts,
        'metadata': {
            'version': '1.0',
            'dataQuality': {
                'marketData': len(market_data) == len(TICKERS),
                'newsItems': len(news) > 0,
                'catalysts': len(catalysts) > 0
            }
        }
    }
    
    # Save to JSON file
    output_path = Path(__file__).parent / OUTPUT_FILE
    with open(output_path, 'w') as f:
        json.dump(dashboard_data, f, indent=2)
    
    print(f"\n✅ Dashboard data updated successfully!")
    print(f"📁 Saved to: {output_path}")
    print(f"📊 Market data: {len(market_data)} tickers")
    print(f"📰 News items: {len(news)} articles")
    print(f"📅 Catalysts: {len(catalysts)} events")
    
    return dashboard_data

def generate_update_report():
    """Generate a summary report of updates"""
    data = json.load(open(OUTPUT_FILE))
    
    print("\n" + "="*60)
    print("DAILY UPDATE REPORT")
    print("="*60)
    print(f"Update Time: {data['lastUpdate']}")
    print("\nMarket Summary:")
    
    for stock in data['marketData']:
        emoji = "📈" if stock['change'] > 0 else "📉"
        print(f"  {emoji} {stock['ticker']}: ${stock['price']} ({stock['changePercent']:+.2f}%)")
    
    print(f"\nTop News ({len(data['intelligenceFeed'])} items):")
    for news in data['intelligenceFeed'][:3]:
        print(f"  • {news['headline'][:60]}...")
    
    print("="*60)

if __name__ == "__main__":
    try:
        update_dashboard_json()
        generate_update_report()
    except Exception as e:
        print(f"❌ Error during update: {e}")
        raise
