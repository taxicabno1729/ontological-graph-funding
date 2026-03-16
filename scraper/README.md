# Funding Data Scraper

Python scraper for fetching startup funding data and pushing to the backend API.

## Installation

```bash
cd scraper
pip install -r requirements.txt
```

## Usage

### Check API Health
```bash
python -m scraper.cli health
```

### Run Scraper (Dry Run)
```bash
python -m scraper.cli scrape --dry-run
```

### Run Scraper (Push to API)
```bash
python -m scraper.cli scrape
```

### Use RSS Source
```bash
python -m scraper.cli scrape --source rss
```

### Search Companies
```bash
python -m scraper.cli search "openai"
```

### Get Stats
```bash
python -m scraper.cli stats
python -m scraper.cli stats --year 2026
```

## Data Sources

### MockSource
Generates mock data for testing. Configurable count.

### RSSSource
Parses RSS feeds from tech news sites (TechCrunch, VentureBeat) for funding announcements.

## API Client

The `FundingAPIClient` class provides:
- Health checks
- Search functionality
- Stats retrieval
- Data pushing (when backend endpoint is available)

## Configuration

Set API URL via environment variable or CLI:
```bash
export API_URL=http://localhost:3001/api
python -m scraper.cli scrape
```

Or use CLI flag:
```bash
python -m scraper.cli --api-url http://localhost:3001/api scrape
```
