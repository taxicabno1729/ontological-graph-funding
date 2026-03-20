#!/usr/bin/env python3
"""Command-line interface for the funding scraper."""

import os
import sys
import json
import logging
from pathlib import Path
import click
from dotenv import load_dotenv

# Load .env from project root (two levels up from scraper/)
load_dotenv(Path(__file__).parent.parent / ".env")
from .scraper import FundingScraper
from .sources import MockSource, RSSSource
from .api_client import FundingAPIClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@click.group()
@click.option('--api-url', default=None, help='Backend API URL')
@click.pass_context
def cli(ctx, api_url):
    """Funding data scraper CLI."""
    ctx.ensure_object(dict)
    ctx.obj['api_url'] = api_url or os.getenv('API_URL') or 'http://localhost:3001/api'


@cli.command()
@click.option('--source', type=click.Choice(['mock', 'rss', 'all']), default='mock',
              help='Data source to use')
@click.option('--count', default=10, help='Number of records to fetch (mock only)')
@click.option('--dry-run', is_flag=True, help='Show what would be done without pushing')
@click.option('--output', '-o', type=click.File('w'), help='Output file (JSON)')
@click.pass_context
def scrape(ctx, source, count, dry_run, output):
    """Fetch and push funding data."""
    api_url = ctx.obj['api_url']
    
    # Create scraper
    scraper = FundingScraper(api_url)
    
    # Add requested sources
    if source in ('mock', 'all'):
        scraper.add_source(MockSource(config={"count": count}))
    
    if source in ('rss', 'all'):
        try:
            scraper.add_source(RSSSource())
        except Exception as e:
            logger.error(f"RSS source not available: {e}")
            if source == 'rss':
                sys.exit(1)
    
    # Run scraper
    summary = scraper.run(dry_run=dry_run, count=count, max_articles=count)
    
    # Output to file if requested
    if output:
        json.dump(summary, output, indent=2)
        logger.info(f"Summary written to {output.name}")
    
    # Exit with error if all failed
    if summary['failed'] > 0 and summary['pushed'] == 0:
        sys.exit(1)


@cli.command()
@click.pass_context
def health(ctx):
    """Check backend API health."""
    api_url = ctx.obj['api_url']
    client = FundingAPIClient(api_url)
    
    if client.health_check():
        click.echo("✅ API is healthy")
        sys.exit(0)
    else:
        click.echo("❌ API is not responding")
        sys.exit(1)


@cli.command()
@click.option('--year', type=int, help='Filter by year')
@click.pass_context
def stats(ctx, year):
    """Get funding statistics from API."""
    api_url = ctx.obj['api_url']
    client = FundingAPIClient(api_url)
    
    stats = client.get_stats(year)
    if stats:
        click.echo(json.dumps(stats, indent=2))
    else:
        click.echo("Failed to get stats")
        sys.exit(1)


@cli.command()
@click.argument('query')
@click.pass_context
def search(ctx, query):
    """Search for companies."""
    api_url = ctx.obj['api_url']
    client = FundingAPIClient(api_url)
    
    results = client.search_companies(query)
    if results:
        click.echo(f"Found {len(results)} results:")
        for r in results:
            click.echo(f"  - {r.get('name')} ({r.get('category')})")
    else:
        click.echo("No results found")


if __name__ == '__main__':
    cli()
