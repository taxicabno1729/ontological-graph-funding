const express = require('express');
const cors = require('cors');
const data = require('./data');
const { AppError, asyncRoute } = require('./errors');
const { parseYearParam, validateCompanyPayload } = require('./validation');

function createApp({ store }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get(
    '/api/health',
    asyncRoute(async (_req, res) => {
      const health = await store.health();
      res.json({
        status: health.connected ? 'ok' : 'error',
        neo4j: health.connected ? 'connected' : 'disconnected',
        mode: health.mode,
        timestamp: new Date().toISOString(),
        message: health.message || null,
      });
    })
  );

  app.get(
    '/api/funding',
    asyncRoute(async (req, res) => {
      const year = parseYearParam(req.query.year);
      res.json(await store.getFundingGraph(year));
    })
  );

  app.get(
    '/api/stats',
    asyncRoute(async (req, res) => {
      const year = parseYearParam(req.query.year);
      res.json(await store.getStats(year));
    })
  );

  app.get(
    '/api/years',
    asyncRoute(async (_req, res) => {
      res.json({ years: await store.getYears() });
    })
  );

  app.get(
    '/api/search',
    asyncRoute(async (req, res) => {
      const query = String(req.query.q || '').trim();
      if (!query) {
        res.json({ results: [] });
        return;
      }

      res.json({ results: await store.searchCompanies(query) });
    })
  );

  app.get(
    '/api/node/:id',
    asyncRoute(async (req, res) => {
      res.json(await store.getNodeDetails(req.params.id));
    })
  );

  app.post(
    '/api/companies',
    asyncRoute(async (req, res) => {
      const payload = validateCompanyPayload(req.body);
      const result = await store.upsertCompany(payload);
      res.status(result.created ? 201 : 200).json(result);
    })
  );

  app.post(
    '/api/seed',
    asyncRoute(async (_req, res) => {
      const summary = await store.seedDatabase(data);
      res.json({
        success: true,
        source: 'neo4j',
        summary,
      });
    })
  );

  app.use((req, _res, next) => {
    next(new AppError(404, `Route ${req.method} ${req.path} was not found.`, 'NOT_FOUND'));
  });

  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    const code = error.code || 'INTERNAL_ERROR';

    if (status >= 500) {
      console.error(error);
    }

    res.status(status).json({
      error: {
        code,
        message: error.message || 'Unexpected server error.',
        details: error.details || null,
      },
    });
  });

  return app;
}

module.exports = {
  createApp,
};
