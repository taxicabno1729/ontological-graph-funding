"""Validated scraper data models."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator


class FundingRecord(BaseModel):
    """Normalized funding record used by scraper sources and API writes."""

    model_config = ConfigDict(str_strip_whitespace=True)

    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    amount: float = Field(gt=0)
    valuation: float | None = None
    year: int = Field(ge=2000)
    quarter: str | None = None
    city: str | None = None
    country: str | None = None
    investors: list[str] = Field(min_length=1)
    round: str | None = None
    description: str | None = None
    source_url: str | None = None

    @field_validator(
        "id",
        "name",
        "category",
        "quarter",
        "city",
        "country",
        "round",
        "description",
        "source_url",
        mode="before",
    )
    @classmethod
    def normalize_optional_string(cls, value: Any) -> Any:
        if value is None:
            return None
        if not isinstance(value, str):
            return value

        normalized = " ".join(value.split()).strip()
        return normalized or None

    @field_validator("investors", mode="before")
    @classmethod
    def normalize_investors(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            value = [value]
        if not isinstance(value, list):
            raise TypeError("investors must be a list of strings")

        normalized: list[str] = []
        seen: set[str] = set()
        for item in value:
            if not isinstance(item, str):
                continue
            cleaned = " ".join(item.split()).strip(" ,;")
            if not cleaned:
                continue
            dedupe_key = cleaned.casefold()
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)
            normalized.append(cleaned)

        return normalized


def validate_funding_record(record: dict[str, Any]) -> FundingRecord:
    """Validate and normalize a raw funding record."""

    return FundingRecord.model_validate(record)


__all__ = ["FundingRecord", "ValidationError", "validate_funding_record"]
