"""API client for backend funding graph API."""

import time
import logging
from typing import List, Dict, Any, Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger(__name__)


class FundingAPIClient:
    """Client for interacting with the funding graph backend API."""
    
    DEFAULT_BASE_URL = "http://localhost:3001/api"
    
    def __init__(self, base_url: str = None, timeout: int = 30):
        self.base_url = base_url or self.DEFAULT_BASE_URL
        self.timeout = timeout
        self.session = requests.Session()
        
        # Configure retries
        retries = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504]
        )
        self.session.mount('http://', HTTPAdapter(max_retries=retries))
        self.session.mount('https://', HTTPAdapter(max_retries=retries))
    
    def health_check(self) -> bool:
        """Check if the API is healthy."""
        try:
            response = self.session.get(
                f"{self.base_url}/health",
                timeout=5
            )
            if response.status_code != 200:
                return False
            payload = response.json()
            return payload.get("neo4j") == "connected"
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False
    
    def get_years(self) -> List[int]:
        """Get available years from API."""
        try:
            response = self.session.get(
                f"{self.base_url}/years",
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json().get("years", [])
        except Exception as e:
            logger.error(f"Failed to get years: {e}")
            return []
    
    def get_stats(self, year: Optional[int] = None) -> Dict[str, Any]:
        """Get funding statistics."""
        try:
            params = {"year": year} if year else {}
            response = self.session.get(
                f"{self.base_url}/stats",
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get stats: {e}")
            return {}
    
    def search_companies(self, query: str) -> List[Dict[str, Any]]:
        """Search for companies."""
        try:
            response = self.session.get(
                f"{self.base_url}/search",
                params={"q": query},
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json().get("results", [])
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []
    
    def get_company(self, company_id: str) -> Optional[Dict[str, Any]]:
        """Get company details by ID."""
        try:
            response = self.session.get(
                f"{self.base_url}/node/{company_id}",
                timeout=self.timeout
            )
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to get company {company_id}: {e}")
            return None
    
    def company_exists(self, company_id: str) -> bool:
        """Check if a company already exists."""
        return self.get_company(company_id) is not None
    
    def push_company(self, record: Dict[str, Any]) -> str:
        """Push a single company record to the backend."""
        try:
            response = self.session.post(
                f"{self.base_url}/companies",
                json=record,
                timeout=self.timeout
            )

            response.raise_for_status()
            payload = response.json()
            action = "created" if payload.get("created") else "updated"
            logger.info("%s company: %s ($%sM)", action.title(), record["name"], record["amount"])
            return "success"
        except Exception as e:
            logger.error(f"Failed to push company {record.get('id')}: {e}")
            return "failed"
    
    def push_companies(self, records: List[Dict[str, Any]], delay: float = 0.5) -> Dict[str, int]:
        """Push multiple company records with rate limiting.
        
        Args:
            records: List of company records to push
            delay: Delay between requests in seconds
            
        Returns:
            Dict with counts of successful, skipped, and failed pushes
        """
        results = {"success": 0, "skipped": 0, "failed": 0}
        
        for record in records:
            outcome = self.push_company(record)
            results[outcome] += 1
            
            time.sleep(delay)
        
        return results
