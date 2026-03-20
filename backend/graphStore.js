const neo4j = require('neo4j-driver');
const data = require('./data');
const { AppError } = require('./errors');

function normalizeValue(value) {
  if (neo4j.isInt(value)) {
    return value.inSafeRange() ? value.toNumber() : Number(value.toString());
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === 'object') {
    if ('properties' in value) {
      return normalizeValue(value.properties);
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeValue(nestedValue)])
    );
  }

  return value;
}

function toNode(properties, fallbackType) {
  const normalized = normalizeValue(properties);
  return {
    ...normalized,
    type: normalized.type || fallbackType,
  };
}

function buildFallbackFundingGraph(year = null) {
  const normalizedYear = year ?? 'all';
  const companies = data.getCompaniesByYear(normalizedYear);
  const companyIds = new Set(companies.map((company) => company.id));

  const fundingLinks = data.fundingLinks.filter((link) => companyIds.has(link.source));
  const sectorLinks = data.sectorLinks.filter((link) => companyIds.has(link.source));
  const locationLinks = data.locationLinks.filter((link) => companyIds.has(link.source));

  const investorIds = new Set(fundingLinks.map((link) => link.target));
  const sectorIds = new Set(sectorLinks.map((link) => link.target));
  const locationIds = new Set(locationLinks.map((link) => link.target));

  return {
    nodes: [
      ...companies,
      ...data.investors.filter((investor) => investorIds.has(investor.id)),
      ...data.sectors.filter((sector) => sectorIds.has(sector.id)),
      ...data.locations.filter((location) => locationIds.has(location.id)),
    ],
    links: [...fundingLinks, ...sectorLinks, ...locationLinks],
    meta: {
      year: normalizedYear,
      source: 'fallback',
    },
  };
}

function buildFallbackStats(year = null) {
  return {
    ...data.getStats(year ?? 'all'),
    source: 'fallback',
  };
}

function buildFallbackSearchResults(query) {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  return data.companies
    .filter((company) => {
      return (
        company.name?.toLowerCase().includes(normalizedQuery) ||
        company.category?.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((left, right) => {
      const amountDelta = (right.amount || 0) - (left.amount || 0);
      if (amountDelta !== 0) return amountDelta;
      return left.name.localeCompare(right.name);
    })
    .slice(0, 10);
}

function buildFallbackNodeDetails(id) {
  const allNodes = data.getAllNodes();
  const allLinks = data.getAllLinks();
  const node = allNodes.find((candidate) => candidate.id === id);

  if (!node) {
    throw new AppError(404, `Node "${id}" was not found.`, 'NOT_FOUND');
  }

  const connectedNodeIds = new Set();
  for (const link of allLinks) {
    if (link.source === id) {
      connectedNodeIds.add(link.target);
    } else if (link.target === id) {
      connectedNodeIds.add(link.source);
    }
  }

  return {
    node,
    connections: allNodes.filter((candidate) => connectedNodeIds.has(candidate.id)),
    source: 'fallback',
  };
}

function createGraphStore(config = process.env) {
  const uri = config.NEO4J_URI || 'bolt://localhost:7687';
  const user = config.NEO4J_USER || 'neo4j';
  const password = config.NEO4J_PASSWORD || 'password';

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  let lastConnectionError = null;

  async function run(query, params = {}, options = {}) {
    const session = driver.session(options);
    try {
      const result = await session.run(query, params);
      lastConnectionError = null;
      return result;
    } catch (error) {
      lastConnectionError = `Neo4j request failed: ${error.message}`;
      throw new AppError(503, lastConnectionError, 'NEO4J_UNAVAILABLE');
    } finally {
      await session.close();
    }
  }

  async function isNeo4jAvailable() {
    try {
      await run('RETURN 1 AS ok');
      return true;
    } catch (_error) {
      return false;
    }
  }

  async function requireNeo4j() {
    if (await isNeo4jAvailable()) {
      return;
    }

    throw new AppError(
      503,
      lastConnectionError || 'Neo4j is unavailable.',
      'NEO4J_UNAVAILABLE'
    );
  }

  async function initialize() {
    await run('RETURN 1 AS ok');
    await run('CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE');
    await run('CREATE CONSTRAINT investor_id IF NOT EXISTS FOR (i:Investor) REQUIRE i.id IS UNIQUE');
    await run('CREATE CONSTRAINT sector_id IF NOT EXISTS FOR (s:Sector) REQUIRE s.id IS UNIQUE');
    await run('CREATE CONSTRAINT location_id IF NOT EXISTS FOR (l:Location) REQUIRE l.id IS UNIQUE');
  }

  async function health() {
    const connected = await isNeo4jAvailable();
    return {
      connected,
      mode: connected ? 'neo4j' : 'fallback',
      message: connected ? null : lastConnectionError,
    };
  }

  async function getFundingGraph(year = null) {
    if (!await isNeo4jAvailable()) {
      return buildFallbackFundingGraph(year);
    }

    const companiesResult = await run(
      `
        MATCH (c:Company)
        WHERE $year IS NULL OR c.year = $year
        RETURN c
        ORDER BY c.year DESC, c.amount DESC, c.name ASC
      `,
      { year }
    );
    const investorsResult = await run(
      `
        MATCH (c:Company)-[:FUNDED_BY]->(i:Investor)
        WHERE $year IS NULL OR c.year = $year
        RETURN DISTINCT i
        ORDER BY i.name ASC
      `,
      { year }
    );
    const sectorsResult = await run(
      `
        MATCH (c:Company)-[:BELONGS_TO]->(s:Sector)
        WHERE $year IS NULL OR c.year = $year
        RETURN DISTINCT s
        ORDER BY s.name ASC
      `,
      { year }
    );
    const locationsResult = await run(
      `
        MATCH (c:Company)-[:LOCATED_IN]->(l:Location)
        WHERE $year IS NULL OR c.year = $year
        RETURN DISTINCT l
        ORDER BY l.name ASC
      `,
      { year }
    );
    const fundingLinksResult = await run(
      `
        MATCH (c:Company)-[r:FUNDED_BY]->(i:Investor)
        WHERE $year IS NULL OR c.year = $year
        RETURN c.id AS source, i.id AS target, r.amount AS amount, r.round AS round
      `,
      { year }
    );
    const sectorLinksResult = await run(
      `
        MATCH (c:Company)-[:BELONGS_TO]->(s:Sector)
        WHERE $year IS NULL OR c.year = $year
        RETURN c.id AS source, s.id AS target
      `,
      { year }
    );
    const locationLinksResult = await run(
      `
        MATCH (c:Company)-[:LOCATED_IN]->(l:Location)
        WHERE $year IS NULL OR c.year = $year
        RETURN c.id AS source, l.id AS target
      `,
      { year }
    );

    return {
      nodes: [
        ...companiesResult.records.map((record) => toNode(record.get('c'), 'company')),
        ...investorsResult.records.map((record) => toNode(record.get('i'), 'investor')),
        ...sectorsResult.records.map((record) => toNode(record.get('s'), 'sector')),
        ...locationsResult.records.map((record) => toNode(record.get('l'), 'location')),
      ],
      links: [
        ...fundingLinksResult.records.map((record) => ({
          source: record.get('source'),
          target: record.get('target'),
          type: 'funded_by',
          amount: normalizeValue(record.get('amount')),
          round: record.get('round'),
        })),
        ...sectorLinksResult.records.map((record) => ({
          source: record.get('source'),
          target: record.get('target'),
          type: 'belongs_to',
        })),
        ...locationLinksResult.records.map((record) => ({
          source: record.get('source'),
          target: record.get('target'),
          type: 'located_in',
        })),
      ],
      meta: {
        year: year || 'all',
        source: 'neo4j',
      },
    };
  }

  async function getStats(year = null) {
    if (!await isNeo4jAvailable()) {
      return buildFallbackStats(year);
    }

    const totalsResult = await run(
      `
        MATCH (c:Company)
        WHERE $year IS NULL OR c.year = $year
        RETURN
          count(c) AS companyCount,
          coalesce(sum(c.amount), 0) AS totalFunding,
          coalesce(sum(c.valuation), 0) AS totalValuation,
          coalesce(avg(c.amount), 0) AS avgDealSize
      `,
      { year }
    );
    const sectorsResult = await run(
      `
        MATCH (c:Company)-[:BELONGS_TO]->(s:Sector)
        WHERE $year IS NULL OR c.year = $year
        RETURN s.name AS name, coalesce(sum(c.amount), 0) AS amount
        ORDER BY amount DESC, name ASC
        LIMIT 5
      `,
      { year }
    );
    const locationsResult = await run(
      `
        MATCH (c:Company)-[:LOCATED_IN]->(l:Location)
        WHERE $year IS NULL OR c.year = $year
        RETURN l.name AS name, coalesce(sum(c.amount), 0) AS amount
        ORDER BY amount DESC, name ASC
        LIMIT 5
      `,
      { year }
    );

    const totals = totalsResult.records[0];

    return {
      companyCount: normalizeValue(totals.get('companyCount')),
      totalFunding: normalizeValue(totals.get('totalFunding')),
      totalValuation: normalizeValue(totals.get('totalValuation')),
      avgDealSize: normalizeValue(totals.get('avgDealSize')),
      topSectors: sectorsResult.records.map((record) => [
        record.get('name'),
        normalizeValue(record.get('amount')),
      ]),
      topLocations: locationsResult.records.map((record) => [
        record.get('name'),
        normalizeValue(record.get('amount')),
      ]),
      source: 'neo4j',
    };
  }

  async function getYears() {
    if (!await isNeo4jAvailable()) {
      return data.getYears();
    }

    const result = await run(
      `
        MATCH (c:Company)
        RETURN DISTINCT c.year AS year
        ORDER BY year DESC
      `
    );

    return result.records.map((record) => normalizeValue(record.get('year')));
  }

  async function searchCompanies(query) {
    if (!await isNeo4jAvailable()) {
      return buildFallbackSearchResults(query);
    }

    const result = await run(
      `
        MATCH (c:Company)
        WHERE toLower(c.name) CONTAINS toLower($query)
          OR toLower(coalesce(c.category, '')) CONTAINS toLower($query)
        RETURN c
        ORDER BY c.amount DESC, c.name ASC
        LIMIT 10
      `,
      { query }
    );

    return result.records.map((record) => toNode(record.get('c'), 'company'));
  }

  async function getNodeDetails(id) {
    if (!await isNeo4jAvailable()) {
      return buildFallbackNodeDetails(id);
    }

    const nodeResult = await run(
      `
        MATCH (n {id: $id})
        RETURN n
        LIMIT 1
      `,
      { id }
    );

    if (nodeResult.records.length === 0) {
      throw new AppError(404, `Node "${id}" was not found.`, 'NOT_FOUND');
    }

    const nodeRecord = nodeResult.records[0].get('n');
    const labels = nodeRecord.labels || [];
    const nodeType = labels[0] ? labels[0].toLowerCase() : 'company';

    const connectionsResult = await run(
      `
        MATCH (n {id: $id})-[r]-(m)
        RETURN DISTINCT m
      `,
      { id }
    );

    return {
      node: toNode(nodeRecord, nodeType),
      connections: connectionsResult.records.map((record) => {
        const connectedNode = record.get('m');
        const connectionLabels = connectedNode.labels || [];
        const connectionType = connectionLabels[0] ? connectionLabels[0].toLowerCase() : 'company';
        return toNode(connectedNode, connectionType);
      }),
    };
  }

  async function upsertCompany(record) {
    await requireNeo4j();

    const existingResult = await run(
      `
        MATCH (c:Company {id: $id})
        RETURN c.id AS id
        LIMIT 1
      `,
      { id: record.id }
    );
    const created = existingResult.records.length === 0;

    await run(
      `
        MERGE (c:Company {id: $id})
        ON CREATE SET c.type = 'company', c.createdAt = datetime()
        SET
          c.name = $name,
          c.category = $category,
          c.amount = $amount,
          c.valuation = coalesce($valuation, c.valuation),
          c.year = $year,
          c.quarter = coalesce($quarter, c.quarter),
          c.city = coalesce($city, c.city),
          c.country = coalesce($country, c.country),
          c.description = coalesce($description, c.description),
          c.sourceUrl = coalesce($sourceUrl, c.sourceUrl),
          c.updatedAt = datetime()
      `,
      record
    );

    if (record.sector) {
      await run(
        `
          MATCH (c:Company {id: $companyId})
          MERGE (s:Sector {id: $id})
          ON CREATE SET s.type = 'sector', s.createdAt = datetime()
          SET
            s.name = $name,
            s.category = coalesce($category, s.category),
            s.updatedAt = datetime()
          MERGE (c)-[:BELONGS_TO]->(s)
        `,
        {
          companyId: record.id,
          ...record.sector,
        }
      );
    }

    if (record.location) {
      await run(
        `
          MATCH (c:Company {id: $companyId})
          MERGE (l:Location {id: $id})
          ON CREATE SET l.type = 'location', l.createdAt = datetime()
          SET
            l.name = $name,
            l.country = coalesce($country, l.country),
            l.updatedAt = datetime()
          MERGE (c)-[:LOCATED_IN]->(l)
        `,
        {
          companyId: record.id,
          ...record.location,
        }
      );
    }

    for (const investor of record.investors) {
      await run(
        `
          MATCH (c:Company {id: $companyId})
          MERGE (i:Investor {id: $id})
          ON CREATE SET i.type = 'investor', i.createdAt = datetime()
          SET
            i.name = $name,
            i.category = coalesce($category, i.category),
            i.updatedAt = datetime()
          MERGE (c)-[r:FUNDED_BY]->(i)
          SET
            r.amount = $amount,
            r.round = coalesce($round, r.round),
            r.updatedAt = datetime()
        `,
        {
          companyId: record.id,
          ...investor,
          amount: record.amount,
          round: record.round,
        }
      );
    }

    const details = await getNodeDetails(record.id);

    return {
      created,
      company: details.node,
      connections: details.connections,
    };
  }

  async function seedDatabase(seedData) {
    await requireNeo4j();

    await run('MATCH (n) DETACH DELETE n');
    await initialize();

    await run(
      `
        UNWIND $sectors AS sector
        CREATE (:Sector {
          id: sector.id,
          name: sector.name,
          type: coalesce(sector.type, 'sector'),
          category: sector.category,
          year: sector.year,
          description: sector.description
        })
      `,
      { sectors: seedData.sectors }
    );
    await run(
      `
        UNWIND $locations AS location
        CREATE (:Location {
          id: location.id,
          name: location.name,
          type: coalesce(location.type, 'location'),
          country: location.country,
          year: location.year,
          description: location.description
        })
      `,
      { locations: seedData.locations }
    );
    await run(
      `
        UNWIND $investors AS investor
        CREATE (:Investor {
          id: investor.id,
          name: investor.name,
          type: coalesce(investor.type, 'investor'),
          category: investor.category,
          year: investor.year,
          description: investor.description
        })
      `,
      { investors: seedData.investors }
    );
    await run(
      `
        UNWIND $companies AS company
        CREATE (:Company {
          id: company.id,
          name: company.name,
          type: coalesce(company.type, 'company'),
          category: company.category,
          amount: company.amount,
          valuation: company.valuation,
          year: company.year,
          quarter: company.quarter,
          city: company.city,
          country: company.country,
          description: company.description
        })
      `,
      { companies: seedData.companies }
    );
    await run(
      `
        UNWIND $links AS link
        MATCH (c:Company {id: link.source}), (i:Investor {id: link.target})
        CREATE (c)-[:FUNDED_BY { amount: link.amount, round: link.round }]->(i)
      `,
      { links: seedData.fundingLinks }
    );
    await run(
      `
        UNWIND $links AS link
        MATCH (c:Company {id: link.source}), (s:Sector {id: link.target})
        CREATE (c)-[:BELONGS_TO]->(s)
      `,
      { links: seedData.sectorLinks }
    );
    await run(
      `
        UNWIND $links AS link
        MATCH (c:Company {id: link.source}), (l:Location {id: link.target})
        CREATE (c)-[:LOCATED_IN]->(l)
      `,
      { links: seedData.locationLinks }
    );

    return {
      sectors: seedData.sectors.length,
      locations: seedData.locations.length,
      investors: seedData.investors.length,
      companies: seedData.companies.length,
      fundingLinks: seedData.fundingLinks.length,
      sectorLinks: seedData.sectorLinks.length,
      locationLinks: seedData.locationLinks.length,
    };
  }

  async function close() {
    await driver.close();
  }

  return {
    close,
    getFundingGraph,
    getNodeDetails,
    getStats,
    getYears,
    health,
    initialize,
    searchCompanies,
    seedDatabase,
    upsertCompany,
  };
}

module.exports = {
  createGraphStore,
};
