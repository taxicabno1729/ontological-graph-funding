#!/bin/bash
# Script to push local repository to GitHub
# Run this when SSH connectivity is working

set -e

echo "=== Pushing to GitHub ==="
echo "Remote: git@github.com:taxicabno1729/ontological-graph-funding.git"
echo ""

# Test SSH connection first
echo "Testing SSH connection to GitHub..."
if ssh -o ConnectTimeout=10 -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH connection successful"
else
    echo "⚠️  SSH connection test inconclusive, continuing anyway..."
fi

echo ""
echo "Pushing main branch..."
git push -u origin main

echo ""
echo "Pushing feature/funding-scraper branch..."
git push -u origin feature/funding-scraper

echo ""
echo "=== Branches pushed successfully! ==="
echo ""
echo "View repository: https://github.com/taxicabno1729/ontological-graph-funding"
echo "Create PR: https://github.com/taxicabno1729/ontological-graph-funding/compare/main...feature/funding-scraper"
