"""Base class for funding data sources."""

from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseSource(ABC):
    """Base class for all funding data sources."""
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.{name}")
    
    @abstractmethod
    def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """Fetch funding data from the source.
        
        Returns:
            List of company funding records with keys:
            - id: unique identifier
            - name: company name
            - category: sector/category
            - amount: funding amount in millions
            - valuation: company valuation in millions
            - year: funding year
            - quarter: funding quarter (Q1, Q2, Q3, Q4)
            - city: company location city
            - country: company location country
            - investors: list of investor names
            - round: funding round (Series A, B, etc.)
        """
        pass
    
    def validate_record(self, record: Dict[str, Any]) -> bool:
        """Validate a funding record has required fields."""
        required = ['name', 'amount', 'year']
        missing = [f for f in required if f not in record or record[f] is None]
        if missing:
            self.logger.warning(f"Record missing required fields: {missing}")
            return False
        return True
