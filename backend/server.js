require('dotenv').config();

const { createApp } = require('./app');
const { createGraphStore } = require('./graphStore');

const PORT = process.env.PORT || 3001;
const store = createGraphStore(process.env);
const app = createApp({ store });

async function start() {
  try {
    await store.initialize();
    console.log('Neo4j driver initialized');
  } catch (error) {
    console.error(`Neo4j initialization failed: ${error.message}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  - GET /api/health');
    console.log('  - GET /api/funding');
    console.log('  - GET /api/stats');
    console.log('  - GET /api/years');
    console.log('  - GET /api/search?q=query');
    console.log('  - GET /api/node/:id');
    console.log('  - POST /api/companies');
    console.log('  - POST /api/seed');
  });

  const shutdown = async () => {
    server.close(async () => {
      await store.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error(`Server failed to start: ${error.message}`);
  process.exit(1);
});
