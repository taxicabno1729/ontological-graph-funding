"""Main scraper module for fetching and pushing funding data."""

import logging
from typing import List, Dict, Any, Optional
from .sources import BaseSource, MockSource, RSSSource
from .api_client import FundingAPIClient

logger = logging.getLogger(__name__)


class FundingScraper:
    """Main scraper orchestrator."""
    
    def __init__(self, api_base_url: str = None):
        self.api = FundingAPIClient(api_base_url)
        self.sources: List[BaseSource] = []
    
    def add_source(self, source: BaseSource) -> "FundingScraper":
        """Add a data source to the scraper."""
        self.sources.append(source)
        logger.info(f"Added source: {source.name}")
        return self
    
    def fetch_all(self, **kwargs) -> List[Dict[str, Any]]:
        """Fetch data from all configured sources."""
        all_records = []
        
        for source in self.sources:
            logger.info(f"Fetching from {source.name}...")
            try:
                records = source.fetch(**kwargs)
                logger.info(f"Fetched {len(records)} records from {source.name}")
                all_records.extend(records)
            except Exception as e:
                logger.error(f"Error fetching from {source.name}: {e}")
        
        # Deduplicate by company ID
        seen = set()
        unique_records = []
        for record in all_records:
            if record["id"] not in seen:
                seen.add(record["id"])
                unique_records.append(record)
        
        logger.info(f"Total unique records: {len(unique_records)}")
        return unique_records
    
    def push_to_api(self, records: List[Dict[str, Any]], dry_run: bool = False) -> Dict[str, int]:
        """Push records to the backend API."""
        if dry_run:
            logger.info(f"DRY RUN: Would push {len(records)} records")
            for r in records[:5]:
                logger.info(f"  - {r['name']}: ${r['amount']}M ({r['year']})")
            if len(records) > 5:
                logger.info(f"  ... and {len(records) - 5} more")
            return {"success": 0, "skipped": 0, "failed": 0, "dry_run": len(records)}
        
        # Check API health first
        if not self.api.health_check():
            logger.error("API health check failed")
            return {"success": 0, "skipped": 0, "failed": len(records)}
        
        return self.api.push_companies(records)
    
    def run(self, dry_run: bool = False, **fetch_kwargs) -> Dict[str, Any]:
        """Run the full scrape and push workflow.
        
        Args:
            dry_run: If True, only log what would be done
            **fetch_kwargs: Arguments passed to source.fetch()
            
        Returns:
            Summary of the run
        """
        logger.info("=" * 50)
        logger.info("Starting funding data scraper")
        logger.info("=" * 50)
        
        # Fetch data
        records = self.fetch_all(**fetch_kwargs)
        
        # Push to API
        results = self.push_to_api(records, dry_run=dry_run)
        
        # Summary
        summary = {
            "sources": len(self.sources),
            "fetched": len(records),
            "pushed": results.get("success", 0),
            "skipped": results.get("skipped", 0),
            "failed": results.get("failed", 0),
            "dry_run": dry_run
        }
        
        logger.info("=" * 50)
        logger.info("Scraper run complete")
        logger.info(f"Sources: {summary['sources']}")
        logger.info(f"Fetched: {summary['fetched']}")
        logger.info(f"Pushed: {summary['pushed']}")
        logger.info(f"Skipped: {summary['skipped']}")
        logger.info(f"Failed: {summary['failed']}")
        logger.info("=" * 50)
        
        return summary


def create_default_scraper(api_url: str = None) -> FundingScraper:
    """Create a scraper with default sources configured."""
    scraper = FundingScraper(api_url)
    
    # Add mock source for testing
    scraper.add_source(MockSource(config={"count": 10}))
    
    # Add RSS source (commented out by default - requires feedparser)
    # scraper.add_source(RSSSource(config={"feeds": RSSSource.DEFAULT_FEEDS}))
    
    return scraper
