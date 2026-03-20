require('dotenv').config();

const data = require('./data');
const { createGraphStore } = require('./graphStore');

async function main() {
  const store = createGraphStore(process.env);

  try {
    await store.initialize();
    const summary = await store.seedDatabase(data);
    console.log('Seed complete:');
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await store.close();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
