"""RSS feed source for funding news."""

import re
import feedparser
from typing import List, Dict, Any
from datetime import datetime
from .base import BaseSource


class RSSSource(BaseSource):
    """Fetch funding data from RSS feeds (TechCrunch, VentureBeat, etc.)."""
    
    DEFAULT_FEEDS = [
        "https://techcrunch.com/category/startups/feed/",
        "https://venturebeat.com/category/entrepreneur/feed/",
    ]
    
    # Patterns to extract funding info from article titles
    FUNDING_PATTERNS = [
        r'\$([\d.]+)\s*(M|B|million|billion)',
        r'raises?\s*\$?([\d.]+)\s*(M|B|million|billion)',
        r'funding\s*\$?([\d.]+)\s*(M|B|million|billion)',
    ]
    
    COMPANY_PATTERNS = [
        r'^([^,]+)\s+raises',
        r'^([^,]+)\s+lands',
        r'^([^,]+)\s+secures',
        r'^([^,]+)\s+announces',
    ]
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("rss", config)
        self.feeds = config.get("feeds", self.DEFAULT_FEEDS) if config else self.DEFAULT_FEEDS
    
    def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """Fetch and parse RSS feeds for funding news."""
        records = []
        max_articles = kwargs.get("max_articles", 50)
        
        for feed_url in self.feeds:
            try:
                self.logger.info(f"Fetching RSS feed: {feed_url}")
                feed = feedparser.parse(feed_url)
                
                for entry in feed.entries[:max_articles]:
                    record = self._parse_entry(entry)
                    if record and self.validate_record(record):
                        records.append(record)
                        
            except Exception as e:
                self.logger.error(f"Error parsing feed {feed_url}: {e}")
                continue
        
        self.logger.info(f"Extracted {len(records)} funding records from RSS feeds")
        return records
    
    def _parse_entry(self, entry) -> Dict[str, Any] | None:
        """Parse a single RSS entry for funding information."""
        title = entry.get("title", "")
        summary = entry.get("summary", "")
        text = f"{title} {summary}"
        
        # Extract funding amount
        amount = self._extract_amount(text)
        if not amount:
            return None
        
        # Extract company name
        company_name = self._extract_company(title)
        if not company_name:
            return None
        
        # Parse date
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        year = published.tm_year if published else datetime.now().year
        
        # Try to extract investors from text
        investors = self._extract_investors(text)
        
        # Determine category from text
        category = self._categorize(text)
        
        return {
            "id": company_name.lower().replace(" ", "-"),
            "name": company_name,
            "category": category,
            "amount": amount,
            "valuation": None,  # Usually not in RSS
            "year": year,
            "quarter": self._get_quarter(published),
            "city": None,  # Usually not in RSS
            "country": None,
            "investors": investors,
            "round": self._extract_round(text),
            "description": summary[:200] if summary else title,
            "source_url": entry.get("link", ""),
        }
    
    def _extract_amount(self, text: str) -> float | None:
        """Extract funding amount from text."""
        for pattern in self.FUNDING_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount = float(match.group(1))
                unit = match.group(2).upper()
                if unit in ['B', 'BILLION']:
                    amount *= 1000  # Convert to millions
                return amount
        return None
    
    def _extract_company(self, title: str) -> str | None:
        """Extract company name from title."""
        for pattern in self.COMPANY_PATTERNS:
            match = re.search(pattern, title, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        # Fallback: first few words
        words = title.split()[:3]
        return " ".join(words) if words else None
    
    def _extract_investors(self, text: str) -> List[str]:
        """Try to extract investor names from text."""
        # Common VC patterns
        vc_patterns = [
            r'(Andreessen Horowitz|a16z)',
            r'(Sequoia Capital|Sequoia)',
            r'(Accel)',
            r'(Lightspeed Venture Partners|Lightspeed)',
            r'(Founders Fund)',
            r'(Khosla Ventures)',
            r'(Index Ventures)',
            r'(Benchmark)',
            r'(Greylock)',
            r'(Kleiner Perkins)',
        ]
        
        investors = []
        for pattern in vc_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            investors.extend(matches)
        
        return investors[:3]  # Limit to top 3
    
    def _extract_round(self, text: str) -> str | None:
        """Extract funding round from text."""
        rounds = ['Series D', 'Series C', 'Series B', 'Series A', 'Seed', 'Growth']
        for r in rounds:
            if r.lower() in text.lower():
                return r
        return None
    
    def _categorize(self, text: str) -> str:
        """Categorize company based on text content."""
        text_lower = text.lower()
        categories = {
            'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
            'Healthcare': ['health', 'medical', 'biotech', 'pharma'],
            'Fintech': ['fintech', 'finance', 'payment', 'banking'],
            'Crypto': ['crypto', 'blockchain', 'web3', 'bitcoin'],
            'Climate Tech': ['climate', 'green', 'sustainable', 'carbon'],
            'Robotics': ['robot', 'automation', 'drone'],
            'Enterprise': ['enterprise', 'saas', 'software'],
        }
        
        for cat, keywords in categories.items():
            if any(kw in text_lower for kw in keywords):
                return cat
        return "Technology"
    
    def _get_quarter(self, published) -> str:
        """Determine quarter from date."""
        if not published:
            return f"Q{(datetime.now().month - 1) // 3 + 1}"
        month = published.tm_mon
        return f"Q{(month - 1) // 3 + 1}"
