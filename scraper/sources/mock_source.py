"""Mock data source for testing."""

import random
from typing import List, Dict, Any
from datetime import datetime
from .base import BaseSource


class MockSource(BaseSource):
    """Generate mock funding data for testing."""
    
    SAMPLE_COMPANIES = [
        ("NeuralForge", "AI", 150, 1200),
        ("CloudSync", "Enterprise", 80, 600),
        ("MediAI", "Healthcare", 200, 2500),
        ("CryptoVault", "Crypto", 45, 300),
        ("GreenEnergy", "Climate Tech", 300, 1800),
        ("RoboBuild", "Robotics", 120, 900),
        ("DataFlow", "Data Engineering", 75, 450),
        ("FinFlow", "Fintech", 250, 3200),
        ("CyberShield", "Security", 180, 1500),
        ("BioGen", "Biotech", 400, 5000),
    ]
    
    INVESTORS = [
        "Andreessen Horowitz", "Sequoia Capital", "Accel",
        "Lightspeed", "Founders Fund", "Khosla Ventures",
        "Bessemer", "Insight Partners", "Tiger Global",
        "General Catalyst", "GV", "Salesforce Ventures"
    ]
    
    CITIES = ["San Francisco", "New York", "Austin", "Boston", "Palo Alto", "Seattle", "Denver"]
    COUNTRIES = ["USA"]
    ROUNDS = ["Seed", "Series A", "Series B", "Series C", "Series D", "Growth"]
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("mock", config)
        self.count = config.get("count", 10) if config else 10
    
    def fetch(self, **kwargs) -> List[Dict[str, Any]]:
        """Generate mock funding records."""
        count = kwargs.get("count", self.count)
        records = []
        
        for i in range(count):
            company = random.choice(self.SAMPLE_COMPANIES)
            name = f"{company[0]}{i+1}" if i > 0 else company[0]
            
            record = {
                "id": name.lower().replace(" ", "-"),
                "name": name,
                "category": company[1],
                "amount": company[2] + random.randint(-20, 50),
                "valuation": company[3] + random.randint(-100, 500),
                "year": datetime.now().year,
                "quarter": f"Q{random.randint(1, 4)}",
                "city": random.choice(self.CITIES),
                "country": random.choice(self.COUNTRIES),
                "investors": random.sample(self.INVESTORS, random.randint(1, 3)),
                "round": random.choice(self.ROUNDS),
                "description": f"{name} - {company[1]} startup"
            }
            
            if self.validate_record(record):
                records.append(record)
        
        self.logger.info(f"Generated {len(records)} mock records")
        return records
