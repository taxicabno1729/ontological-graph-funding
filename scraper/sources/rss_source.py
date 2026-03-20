"""RSS feed source for funding news — Firecrawl-powered extraction."""

import html
import re
import feedparser
from typing import List, Dict, Any, Tuple
from datetime import datetime

from .base import BaseSource
from ..llm_parser import FirecrawlExtractor


class RSSSource(BaseSource):
    """Fetch article URLs from RSS feeds, extract structured data via Firecrawl."""

    DEFAULT_FEEDS = [
        "https://techcrunch.com/tag/funding/feed/",
        "https://techcrunch.com/category/startups/feed/",
        "https://venturebeat.com/category/entrepreneur/feed/",
        "https://news.crunchbase.com/feed/",
        "https://sifted.eu/feed/",
        "https://www.theinformation.com/feed",
    ]

    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("rss", config)
        self.feeds = config.get("feeds", self.DEFAULT_FEEDS) if config else self.DEFAULT_FEEDS
        self._extractor = FirecrawlExtractor()

    def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """Collect article URLs from RSS feeds then batch-extract via Firecrawl."""
        max_articles = kwargs.get("count", kwargs.get("max_articles", 5))

        # Step 1: collect (url, entry_metadata) from all feeds
        url_meta: List[Tuple[str, Any]] = []
        for feed_url in self.feeds:
            try:
                self.logger.info(f"Fetching RSS feed: {feed_url}")
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:max_articles]:
                    link = entry.get("link", "")
                    if link:
                        url_meta.append((link, entry))
            except Exception as e:
                self.logger.error(f"Error fetching feed {feed_url}: {e}")

        if not url_meta:
            return []

        urls = [u for u, _ in url_meta]
        meta_map = {u: m for u, m in url_meta}

        self.logger.info(f"Extracting funding data from {len(urls)} articles via Firecrawl...")

        # Step 2: batch-extract with Firecrawl
        extractions = self._extractor.extract_batch(urls)

        # Step 3: build records — match extractions back to metadata by order
        records = []
        for i, extraction in enumerate(extractions):
            # best-effort: use the i-th entry metadata if available
            entry = list(meta_map.values())[i] if i < len(meta_map) else {}
            published = entry.get("published_parsed") or entry.get("updated_parsed")
            year = published.tm_year if published else datetime.now().year
            summary = self._clean_text(entry.get("summary", ""))

            record = {
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
                "description": summary[:200] if summary else "",
                "source_url": entry.get("link", ""),
            }
            if self.validate_record(record):
                records.append(record)

        self.logger.info(f"Extracted {len(records)} funding records from RSS feeds")
        return records

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
