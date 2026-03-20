"""Firecrawl-powered structured extractor for funding articles.

Scrapes article URLs and extracts structured funding data in one call.

Requires: FIRECRAWL_API_KEY env var (free tier at firecrawl.dev)
"""

from __future__ import annotations

from typing import Any, List, Optional

from firecrawl.v1 import V1FirecrawlApp
from pydantic import BaseModel, field_validator


class FundingExtraction(BaseModel):
    """Structured funding data for a single article."""

    is_funding_article: bool
    company_name: Optional[str] = None
    funding_amount_millions: Optional[float] = None
    valuation_millions: Optional[float] = None
    investors: List[str] = []
    funding_round: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    category: Optional[str] = None

    @field_validator("funding_amount_millions", "valuation_millions", mode="before")
    @classmethod
    def coerce_numeric(cls, v: Any) -> Optional[float]:
        if isinstance(v, str) and v.strip().lower() in ("null", "none", ""):
            return None
        return v

    @field_validator("company_name", "funding_round", "city", "country", "category", mode="before")
    @classmethod
    def coerce_string(cls, v: Any) -> Optional[str]:
        if isinstance(v, str) and v.strip().lower() in ("null", "none", ""):
            return None
        return v

    @field_validator("investors", mode="before")
    @classmethod
    def coerce_investors(cls, v: Any) -> List[str]:
        if not isinstance(v, list):
            return []
        return [i for i in v if isinstance(i, str) and i.strip().lower() not in ("null", "none", "")]


class FundingBatch(BaseModel):
    """Batch of funding extractions from multiple articles."""
    articles: List[FundingExtraction] = []


class FirecrawlExtractor:
    """Batch-extracts funding data from article URLs using Firecrawl."""

    CHUNK_SIZE = 10  # Firecrawl beta limit

    def extract_batch(self, urls: List[str]) -> List[FundingExtraction]:
        """Extract funding data from article URLs, chunked to respect API limits."""
        if not urls:
            return []

        app = V1FirecrawlApp()
        prompt = (
            "For each URL, extract startup funding information. "
            "Set is_funding_article=false if the article is NOT about a startup raising money. "
            "Convert all amounts to millions USD (e.g. $1.5B → 1500, $50M → 50). "
            "For category use one of: AI, Fintech, Healthcare, Climate Tech, Crypto, "
            "Robotics, Enterprise, Consumer, Biotech, or Technology. "
            "funding_round should be one of: Seed, Series A-F, Growth, or null."
        )

        all_articles = []
        for i in range(0, len(urls), self.CHUNK_SIZE):
            chunk = urls[i : i + self.CHUNK_SIZE]
            result = app.extract(urls=chunk, prompt=prompt, schema=FundingBatch)
            articles = result.data.get("articles", []) if result.success and result.data else []
            all_articles.extend(articles)

        articles = all_articles
        extracted = []
        for item in articles:
            try:
                record = FundingExtraction.model_validate(item)
                if not record.is_funding_article or not record.company_name or not record.funding_amount_millions:
                    continue
                if any(p in record.company_name.lower() for p in ("not specified", "unknown", "startup_name", "n/a")):
                    continue
                extracted.append(record)
            except Exception:
                continue
        return extracted
