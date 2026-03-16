#!/usr/bin/env python3
"""Simple entry point to run the scraper."""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper.cli import cli

if __name__ == '__main__':
    cli()
