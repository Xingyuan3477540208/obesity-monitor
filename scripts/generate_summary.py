"""
Generate update summary for GitHub Actions
"""

import json
from datetime import datetime
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / 'public' / 'dashboard_data.json'

def main():
    with open(DATA_FILE) as f:
        data = json.load(f)
    
    market = data.get('marketData', [])
    news = data.get('intelligenceFeed', [])
    stats = data.get('statistics', {})
    
    print("=" * 70)
    print("📊 OBESITY DRUG DASHBOARD - UPDATE SUMMARY")
    print("=" * 70)
    print(f"🕒 Update Time: {data.get('lastUpdate', 'N/A')}")
    print()
    
    print("📈 MARKET DATA")
    print("-" * 70)
    print(f"Total Stocks: {len(market)}")
    print(f"Average Change: {stats.get('avgChange', 0):+.2f}%")
    print(f"Gainers: {stats.get('gainers', 0)} | Losers: {stats.get('losers', 0)}")
    print()
    
    print("🏆 TOP MOVERS")
    print("-" * 70)
    sorted_stocks = sorted(market, key=lambda x: abs(x.get('changePercent', 0)), reverse=True)
    for i, stock in enumerate(sorted_stocks[:5], 1):
        emoji = "📈" if stock.get('changePercent', 0) > 0 else "📉"
        print(f"{i}. {emoji} {stock['ticker']:6} ${stock['price']:>8.2f}  {stock['changePercent']:>+7.2f}%  {stock['company']}")
    print()
    
    print("📰 LATEST NEWS")
    print("-" * 70)
    for i, item in enumerate(news[:5], 1):
        priority_emoji = {"critical": "🔴", "high": "🟠", "medium": "🔵"}.get(item.get('priority', 'medium'), "⚪")
        print(f"{i}. {priority_emoji} [{item.get('date', 'N/A')}] {item.get('headline', 'N/A')[:60]}...")
    print()
    
    print("=" * 70)
    print("✅ Update completed successfully!")
    print("=" * 70)

if __name__ == "__main__":
    main()
