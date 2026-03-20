"""RSS feed source for funding news — LLM-powered extraction."""

import html
import re
import feedparser
from typing import List, Dict, Any
from datetime import datetime

from .base import BaseSource
from ..llm_parser import LLMParser


class RSSSource(BaseSource):
    """Fetch funding data from RSS feeds, parsed with Claude structured outputs."""

    DEFAULT_FEEDS = [
        # TechCrunch
        "https://techcrunch.com/tag/funding/feed/",
        "https://techcrunch.com/category/startups/feed/",
        # VentureBeat
        "https://venturebeat.com/category/entrepreneur/feed/",
        # Crunchbase News
        "https://news.crunchbase.com/feed/",
        # Sifted (European startups)
        "https://sifted.eu/feed/",
        # The Information (startup news)
        "https://www.theinformation.com/feed",
        # Business Wire (press releases)
        "https://www.businesswire.com/rss/home/?rss=g6",
    ]

    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("rss", config)
        self.feeds = config.get("feeds", self.DEFAULT_FEEDS) if config else self.DEFAULT_FEEDS
        self._parser = LLMParser()

    def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """Fetch and parse RSS feeds for funding news using Claude."""
        records = []
        max_articles = kwargs.get("count", kwargs.get("max_articles", 20))

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
        """Parse a single RSS entry using Claude structured output."""
        title = entry.get("title", "")
        summary = self._clean_text(entry.get("summary", ""))

        try:
            extraction = self._parser.parse(title, summary)
        except Exception as e:
            self.logger.warning(f"LLM parse failed for '{title}': {e}")
            return None

        if not extraction:
            return None

        published = entry.get("published_parsed") or entry.get("updated_parsed")
        year = published.tm_year if published else datetime.now().year

        return {
            "id": self._slugify(extraction.company_name),
            "name": extraction.company_name,
            "category": extraction.category or "Technology",
            "amount": extraction.funding_amount_millions,
            "valuation": extraction.valuation_millions,
            "year": year,
            "quarter": self._get_quarter(published),
            "city": extraction.city,
            "country": extraction.country,
            "investors": extraction.investors if extraction.investors else ["Unknown"],
            "round": extraction.funding_round,
            "description": summary[:200] if summary else title,
            "source_url": entry.get("link", ""),
        }

    def _clean_text(self, text: str) -> str:
        text = html.unescape(text or "")
        text = re.sub(r"<[^>]+>", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def _get_quarter(self, published) -> str:
        if not published:
            return f"Q{(datetime.now().month - 1) // 3 + 1}"
        return f"Q{(published.tm_mon - 1) // 3 + 1}"

    def _slugify(self, value: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
        return slug or "unknown-company"
