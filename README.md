# Startup Funding Graph - Neo4j Powered

A full-stack application that visualizes startup funding relationships using a Neo4j graph database.

## Architecture

```
┌─────────────┐     HTTP/REST      ┌─────────────┐     Cypher       ┌─────────────┐
│   React     │ ◄────────────────► │   Express   │ ◄──────────────► │    Neo4j    │
│  Frontend   │                    │    API      │                  │   Database  │
└─────────────┘                    └─────────────┘                  └─────────────┘
```

## Prerequisites

- Node.js 18+
- Neo4j Database (local or cloud)

## Neo4j Setup Options

### Option 1: Neo4j Desktop (Local)
1. Download [Neo4j Desktop](https://neo4j.com/download/)
2. Create a new database
3. Set password and start the database

### Option 2: Neo4j Aura (Cloud - Free)
1. Sign up at [Neo4j Aura](https://neo4j.com/cloud/aura/)
2. Create a free instance
3. Get the connection URI and credentials

### Option 3: Docker
```bash
docker run -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

## Quick Start

### 1. Start Neo4j Database
Make sure Neo4j is running on `bolt://localhost:7687` with credentials `neo4j/password`

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment (edit .env with your Neo4j credentials)
cp .env.example .env

# Seed the database with funding data
npm run seed

# Start the API server
npm start
```

The API will be available at `http://localhost:3001`

### 3. Setup Frontend

```bash
cd app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/funding` | Get all funding data (optional: `?year=2026`) |
| `GET /api/stats` | Get funding statistics |
| `GET /api/years` | Get available years |
| `GET /api/search?q=query` | Search companies |
| `GET /api/node/:id` | Get node details with connections |
| `POST /api/seed` | Seed database with initial data |

## Neo4j Data Model

```cypher
// Nodes
(:Company {id, name, category, amount, valuation, year, city, country})
(:Investor {id, name, category})
(:Sector {id, name, category})
(:Location {id, name, country})

// Relationships
(:Company)-[:FUNDED_BY {amount, round}]->(:Investor)
(:Company)-[:BELONGS_TO]->(:Sector)
(:Company)-[:LOCATED_IN]->(:Location)
```

## Environment Variables

### Backend (.env)
```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Features

- **Dynamic Data**: All data comes from Neo4j - no hardcoded values
- **Year Filtering**: Filter funding rounds by year
- **Type Filtering**: Show only companies, investors, sectors, or locations
- **Search**: Real-time search with suggestions
- **Interactive Graph**: D3.js force-directed graph with zoom, pan, drag
- **Statistics Panel**: Live stats from Neo4j queries
- **Node Details**: Click any node to see connections

## Sample Neo4j Queries

```cypher
// Get total funding by year
MATCH (c:Company)
RETURN c.year, sum(c.amount) as total
ORDER BY c.year DESC

// Get top investors by number of deals
MATCH (c:Company)-[:FUNDED_BY]->(i:Investor)
RETURN i.name, count(c) as deals
ORDER BY deals DESC

// Get companies in AI sector
MATCH (c:Company)-[:BELONGS_TO]->(s:Sector {id: 'ai'})
RETURN c.name, c.amount, c.valuation
ORDER BY c.amount DESC
```

## Deployment

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd app
npm install
npm run build
# Serve dist/ folder with any static file server
```

## License

MIT
