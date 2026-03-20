"""LLM-powered structured output parser for funding articles.

Uses Groq's free tier (llama-3.3-70b) with the instructor library
for validated Pydantic structured outputs.

Requires: GROQ_API_KEY env var (free at console.groq.com)
"""

from __future__ import annotations

from typing import List, Optional

import instructor
from groq import Groq
from pydantic import BaseModel


class FundingExtraction(BaseModel):
    """Structured funding data extracted from an article."""

    is_funding_article: bool
    company_name: Optional[str] = None
    funding_amount_millions: Optional[float] = None  # converted to millions USD
    valuation_millions: Optional[float] = None
    investors: List[str] = []
    funding_round: Optional[str] = None  # Seed, Series A-F, Growth, etc.
    city: Optional[str] = None
    country: Optional[str] = None
    category: Optional[str] = None  # AI, Fintech, Healthcare, etc.


class LLMParser:
    """Uses Groq (llama-3.3-70b, free tier) with instructor for structured extraction."""

    MODEL = "llama-3.3-70b-versatile"

    def __init__(self):
        self._client = instructor.from_groq(Groq())

    def parse(self, title: str, summary: str) -> Optional[FundingExtraction]:
        """Parse an article and return structured funding data, or None if not a funding article."""
        result = self._client.chat.completions.create(
            model=self.MODEL,
            response_model=FundingExtraction,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Extract startup funding information from this news article.\n\n"
                        f"Title: {title}\n\n"
                        f"Summary: {summary}\n\n"
                        "Instructions:\n"
                        "- Set is_funding_article=false if this is NOT about a startup raising money\n"
                        "- Convert all amounts to millions USD (e.g. $1.5B → 1500, $50M → 50)\n"
                        "- For category use one of: AI, Fintech, Healthcare, Climate Tech, "
                        "Crypto, Robotics, Enterprise, Consumer, Biotech, or Technology\n"
                        "- Include all named investors\n"
                        "- funding_round should be one of: Seed, Series A, Series B, Series C, "
                        "Series D, Series E, Series F, Growth, or null if unknown"
                    ),
                }
            ],
        )

        if not result.is_funding_article or not result.company_name or not result.funding_amount_millions:
            return None
        return result
