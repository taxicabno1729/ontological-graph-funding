const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Data fallback
const data = require('./data');

// Neo4j driver setup
let driver;
try {
  driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    )
  );
  console.log('Neo4j driver initialized');
} catch (error) {
  console.log('Neo4j not available, using fallback data');
}

// Check Neo4j connection
async function isNeo4jAvailable() {
  if (!driver) return false;
  try {
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    return true;
  } catch {
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all funding data
app.get('/api/funding', async (req, res) => {
  const year = req.query.year;
  
  if (await isNeo4jAvailable()) {
    try {
      const session = driver.session();
      let query = `
        MATCH (c:Company)
        ${year && year !== 'all' ? 'WHERE c.year = $year' : ''}
        OPTIONAL MATCH (c)-[:FUNDED_BY]->(i:Investor)
        OPTIONAL MATCH (c)-[:BELONGS_TO]->(s:Sector)
        OPTIONAL MATCH (c)-[:LOCATED_IN]->(l:Location)
        RETURN c, collect(DISTINCT i) as investors, collect(DISTINCT s) as sectors, collect(DISTINCT l) as locations
      `;
      
      const result = await session.run(query, year && year !== 'all' ? { year: parseInt(year) } : {});
      await session.close();
      
      const companies = result.records.map(r => ({
        ...r.get('c').properties,
        investors: r.get('investors').map(i => i.properties),
        sectors: r.get('sectors').map(s => s.properties),
        locations: r.get('locations').map(l => l.properties)
      }));
      
      res.json({ companies, source: 'neo4j' });
    } catch (error) {
      console.error('Neo4j error:', error);
      // Fallback to static data
      const companies = data.getCompaniesByYear(year || 'all');
      res.json({ companies, source: 'fallback' });
    }
  } else {
    const companies = data.getCompaniesByYear(year || 'all');
    res.json({ companies, source: 'fallback' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  const year = req.query.year;
  
  if (await isNeo4jAvailable()) {
    try {
      const session = driver.session();
      let query = `
        MATCH (c:Company)
        ${year && year !== 'all' ? 'WHERE c.year = $year' : ''}
        RETURN 
          count(c) as companyCount,
          sum(c.amount) as totalFunding,
          sum(c.valuation) as totalValuation,
          avg(c.amount) as avgDealSize
      `;
      
      const result = await session.run(query, year && year !== 'all' ? { year: parseInt(year) } : {});
      await session.close();
      
      const record = result.records[0];
      res.json({
        companyCount: record.get('companyCount').toNumber(),
        totalFunding: record.get('totalFunding').toNumber(),
        totalValuation: record.get('totalValuation').toNumber(),
        avgDealSize: record.get('avgDealSize').toNumber(),
        source: 'neo4j'
      });
    } catch (error) {
      console.error('Neo4j error:', error);
      res.json({ ...data.getStats(year || 'all'), source: 'fallback' });
    }
  } else {
    res.json({ ...data.getStats(year || 'all'), source: 'fallback' });
  }
});

// Get available years
app.get('/api/years', (req, res) => {
  res.json({ years: data.getYears() });
});

// Search companies
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  if (!query) {
    return res.json({ results: [] });
  }
  
  const allNodes = data.getAllNodes();
  const results = allNodes.filter(n => 
    n.name?.toLowerCase().includes(query) || 
    n.category?.toLowerCase().includes(query)
  ).slice(0, 10);
  
  res.json({ results });
});

// Get node details with connections
app.get('/api/node/:id', (req, res) => {
  const nodeId = req.params.id;
  const allNodes = data.getAllNodes();
  const allLinks = data.getAllLinks();
  
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }
  
  const connections = allLinks
    .filter(l => l.source === nodeId || l.target === nodeId)
    .map(l => {
      const otherId = l.source === nodeId ? l.target : l.source;
      const otherNode = allNodes.find(n => n.id === otherId);
      return {
        ...l,
        node: otherNode
      };
    });
  
  res.json({ node, connections });
});

// Seed database endpoint
app.post('/api/seed', async (req, res) => {
  if (!await isNeo4jAvailable()) {
    return res.status(503).json({ error: 'Neo4j not available' });
  }
  
  try {
    const session = driver.session();
    
    // Clear existing data
    await session.run('MATCH (n) DETACH DELETE n');
    
    // Create sectors
    for (const sector of data.sectors) {
      await session.run(
        'CREATE (s:Sector {id: $id, name: $name, category: $category})',
        sector
      );
    }
    
    // Create locations
    for (const location of data.locations) {
      await session.run(
        'CREATE (l:Location {id: $id, name: $name, country: $country})',
        location
      );
    }
    
    // Create investors
    for (const investor of data.investors) {
      await session.run(
        'CREATE (i:Investor {id: $id, name: $name, category: $category})',
        investor
      );
    }
    
    // Create companies
    for (const company of data.companies) {
      await session.run(
        `CREATE (c:Company {
          id: $id, name: $name, category: $category, 
          amount: $amount, valuation: $valuation, 
          year: $year, city: $city, country: $country
        })`,
        company
      );
    }
    
    // Create relationships
    for (const link of data.fundingLinks) {
      await session.run(
        `MATCH (c:Company {id: $source}), (i:Investor {id: $target})
         CREATE (c)-[:FUNDED_BY {amount: $amount, round: $round}]->(i)`,
        link
      );
    }
    
    for (const link of data.sectorLinks) {
      await session.run(
        `MATCH (c:Company {id: $source}), (s:Sector {id: $target})
         CREATE (c)-[:BELONGS_TO]->(s)`,
        link
      );
    }
    
    for (const link of data.locationLinks) {
      await session.run(
        `MATCH (c:Company {id: $source}), (l:Location {id: $target})
         CREATE (c)-[:LOCATED_IN]->(l)`,
        link
      );
    }
    
    await session.close();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET /api/health`);
  console.log(`  - GET /api/funding`);
  console.log(`  - GET /api/stats`);
  console.log(`  - GET /api/years`);
  console.log(`  - GET /api/search?q=query`);
  console.log(`  - GET /api/node/:id`);
  console.log(`  - POST /api/seed`);
});
