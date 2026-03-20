const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('./app');

function createFakeStore() {
  return {
    async health() {
      return { connected: true };
    },
    async getFundingGraph(year) {
      return {
        nodes: [{ id: 'openai', name: 'OpenAI', type: 'company', year: year || 2025 }],
        links: [],
        meta: { year: year || 'all', source: 'neo4j' },
      };
    },
    async getStats(year) {
      return {
        companyCount: year ? 1 : 2,
        totalFunding: 100,
        totalValuation: 200,
        avgDealSize: 100,
        topSectors: [['AI', 100]],
        topLocations: [['San Francisco', 100]],
        source: 'neo4j',
      };
    },
    async getYears() {
      return [2026, 2025];
    },
    async searchCompanies(query) {
      return [{ id: query, name: query, type: 'company', year: 2026 }];
    },
    async getNodeDetails(id) {
      return {
        node: { id, name: 'OpenAI', type: 'company', year: 2025 },
        connections: [],
      };
    },
    async upsertCompany(record) {
      return {
        created: true,
        company: { id: record.id, name: record.name, type: 'company', year: record.year },
        connections: record.investors,
      };
    },
    async seedDatabase() {
      return { companies: 3 };
    },
  };
}

function findRouteHandler(app, method, path) {
  const router = app._router;
  const layer = router.stack.find(
    (entry) => entry.route && entry.route.path === path && entry.route.methods[method]
  );

  if (!layer) {
    throw new Error(`Could not find route ${method.toUpperCase()} ${path}`);
  }

  return layer.route.stack[0].handle;
}

async function invokeRoute(app, method, path, { query = {}, params = {}, body } = {}) {
  const handler = findRouteHandler(app, method, path);

  return await new Promise((resolve, reject) => {
    const response = {
      statusCode: 200,
      body: undefined,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        resolve({ statusCode: this.statusCode, body: payload });
        return this;
      },
    };

    const request = {
      method: method.toUpperCase(),
      path,
      query,
      params,
      body,
    };

    handler(request, response, (error) => {
      if (error) {
        reject(error);
      }
    });
  });
}

test('GET /api/funding returns graph-shaped data', async () => {
  const app = createApp({ store: createFakeStore() });
  const response = await invokeRoute(app, 'get', '/api/funding', {
    query: { year: '2025' },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body.meta, { year: 2025, source: 'neo4j' });
  assert.equal(response.body.nodes[0].id, 'openai');
});

test('GET /api/years returns wrapped years', async () => {
  const app = createApp({ store: createFakeStore() });
  const response = await invokeRoute(app, 'get', '/api/years');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { years: [2026, 2025] });
});

test('POST /api/companies validates payloads', async () => {
  const app = createApp({ store: createFakeStore() });

  await assert.rejects(
    invokeRoute(app, 'post', '/api/companies', {
      body: { name: 'Incomplete Company', year: 2026 },
    }),
    /Field "amount" must be a positive number/
  );
});

test('POST /api/companies normalizes and returns created records', async () => {
  const app = createApp({ store: createFakeStore() });
  const response = await invokeRoute(app, 'post', '/api/companies', {
    body: {
      name: 'NewCo',
      amount: 42,
      year: 2026,
      investors: ['Sequoia Capital'],
    },
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.company.id, 'newco');
});

test('GET /api/narrate/:id returns script in text mode', async () => {
  const saved = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = ''; // force fallback template
  try {
    const app = createApp({ store: createFakeStore() });
    const response = await invokeRoute(app, 'get', '/api/narrate/:id', {
      params: { id: 'openai' },
      query: { text: 'true' },
    });
    assert.equal(response.statusCode, 200);
    assert.ok(typeof response.body.script === 'string' && response.body.script.length > 0);
    assert.equal(response.body.nodeId, 'openai');
  } finally {
    process.env.ANTHROPIC_API_KEY = saved;
  }
});

test('POST /api/seed returns a seeding summary', async () => {
  const app = createApp({ store: createFakeStore() });
  const response = await invokeRoute(app, 'post', '/api/seed');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.summary.companies, 3);
});
