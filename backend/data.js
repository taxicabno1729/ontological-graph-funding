// Fallback data for when Neo4j is not available
const sectors = [
  { id: 'ai', name: 'Artificial Intelligence', type: 'sector', category: 'Technology', year: 2026, description: 'Artificial Intelligence sector' },
  { id: 'healthcare', name: 'Healthcare & Biotech', type: 'sector', category: 'Healthcare', year: 2026, description: 'Healthcare & Biotech sector' },
  { id: 'fintech', name: 'Financial Services', type: 'sector', category: 'Finance', year: 2026, description: 'Financial Services sector' },
  { id: 'robotics', name: 'Robotics & Automation', type: 'sector', category: 'Technology', year: 2026, description: 'Robotics & Automation sector' },
  { id: 'climate', name: 'Climate Tech', type: 'sector', category: 'Sustainability', year: 2026, description: 'Climate Tech sector' },
  { id: 'enterprise', name: 'Enterprise Software', type: 'sector', category: 'Software', year: 2026, description: 'Enterprise Software sector' },
  { id: 'ecommerce', name: 'E-Commerce', type: 'sector', category: 'Consumer', year: 2026, description: 'E-Commerce sector' },
  { id: 'defense', name: 'Defense Tech', type: 'sector', category: 'Government', year: 2026, description: 'Defense Tech sector' },
  { id: 'semiconductors', name: 'Semiconductors', type: 'sector', category: 'Hardware', year: 2026, description: 'Semiconductors sector' },
  { id: 'crypto', name: 'Crypto & Blockchain', type: 'sector', category: 'Finance', year: 2026, description: 'Crypto & Blockchain sector' },
  { id: 'space', name: 'Space Tech', type: 'sector', category: 'Technology', year: 2026, description: 'Space Tech sector' },
  { id: 'energy', name: 'Energy Storage', type: 'sector', category: 'Sustainability', year: 2026, description: 'Energy Storage sector' },
];

const locations = [
  { id: 'sf', name: 'San Francisco', type: 'location', country: 'USA', year: 2026, description: 'San Francisco, USA' },
  { id: 'nyc', name: 'New York', type: 'location', country: 'USA', year: 2026, description: 'New York, USA' },
  { id: 'la', name: 'Los Angeles', type: 'location', country: 'USA', year: 2026, description: 'Los Angeles, USA' },
  { id: 'boston', name: 'Boston', type: 'location', country: 'USA', year: 2026, description: 'Boston, USA' },
  { id: 'austin', name: 'Austin', type: 'location', country: 'USA', year: 2026, description: 'Austin, USA' },
  { id: 'berlin', name: 'Berlin', type: 'location', country: 'Germany', year: 2026, description: 'Berlin, Germany' },
  { id: 'paloalto', name: 'Palo Alto', type: 'location', country: 'USA', year: 2026, description: 'Palo Alto, USA' },
];

const investors = [
  { id: 'a16z', name: 'Andreessen Horowitz', type: 'investor', category: 'VC', year: 2026, description: 'Andreessen Horowitz - VC' },
  { id: 'sequoia', name: 'Sequoia Capital', type: 'investor', category: 'VC', year: 2026, description: 'Sequoia Capital - VC' },
  { id: 'lightspeed', name: 'Lightspeed Venture Partners', type: 'investor', category: 'VC', year: 2026, description: 'Lightspeed Venture Partners - VC' },
  { id: 'accel', name: 'Accel', type: 'investor', category: 'VC', year: 2026, description: 'Accel - VC' },
  { id: 'foundersfund', name: 'Founders Fund', type: 'investor', category: 'VC', year: 2026, description: 'Founders Fund - VC' },
  { id: 'khosla', name: 'Khosla Ventures', type: 'investor', category: 'VC', year: 2026, description: 'Khosla Ventures - VC' },
  { id: 'bessemer', name: 'Bessemer Venture Partners', type: 'investor', category: 'VC', year: 2026, description: 'Bessemer Venture Partners - VC' },
  { id: 'insight', name: 'Insight Partners', type: 'investor', category: 'Growth', year: 2026, description: 'Insight Partners - Growth' },
  { id: 'tiger', name: 'Tiger Global', type: 'investor', category: 'Hedge Fund', year: 2026, description: 'Tiger Global - Hedge Fund' },
  { id: 'iconiq', name: 'ICONIQ Capital', type: 'investor', category: 'Growth', year: 2026, description: 'ICONIQ Capital - Growth' },
  { id: 'general', name: 'General Catalyst', type: 'investor', category: 'VC', year: 2026, description: 'General Catalyst - VC' },
  { id: 'bcapital', name: 'B Capital Group', type: 'investor', category: 'Growth', year: 2026, description: 'B Capital Group - Growth' },
  { id: 'gv', name: 'GV (Google Ventures)', type: 'investor', category: 'CVC', year: 2026, description: 'GV (Google Ventures) - CVC' },
  { id: 'salesforce', name: 'Salesforce Ventures', type: 'investor', category: 'CVC', year: 2026, description: 'Salesforce Ventures - CVC' },
  { id: 'softbank', name: 'SoftBank', type: 'investor', category: 'Growth', year: 2026, description: 'SoftBank - Growth' },
  { id: 'lux', name: 'Lux Capital', type: 'investor', category: 'VC', year: 2026, description: 'Lux Capital - VC' },
  { id: '8vc', name: '8VC', type: 'investor', category: 'VC', year: 2026, description: '8VC - VC' },
  { id: 'valor', name: 'Valor Equity Partners', type: 'investor', category: 'Growth', year: 2026, description: 'Valor Equity Partners - Growth' },
  { id: 'battery', name: 'Battery Ventures', type: 'investor', category: 'VC', year: 2026, description: 'Battery Ventures - VC' },
  { id: 'felicis', name: 'Felicis Ventures', type: 'investor', category: 'VC', year: 2026, description: 'Felicis Ventures - VC' },
  { id: 'nvidia', name: 'Nvidia', type: 'investor', category: 'CVC', year: 2026, description: 'Nvidia - CVC' },
];

const companies2026 = [
  { id: 'replit', name: 'Replit', type: 'company', category: 'Developer Tools', amount: 400, valuation: 4000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Cloud-based development platform with AI-assisted coding' },
  { id: 'mindrobotics', name: 'Mind Robotics', type: 'company', category: 'Robotics', amount: 500, valuation: 2500, year: 2026, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'AI-driven robotics for industrial automation' },
  { id: 'carefam', name: 'Carefam', type: 'company', category: 'Healthcare AI', amount: 10.5, valuation: 100, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'AI chatbots for healthcare workforce coordination' },
  { id: 'ezra', name: 'Ezra', type: 'company', category: 'Fintech', amount: 8, valuation: 80, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Asset-backed finance infrastructure' },
  { id: 'tower', name: 'Tower', type: 'company', category: 'Data Engineering', amount: 6.4, valuation: 60, year: 2026, quarter: 'Q1', city: 'Berlin', country: 'Germany', description: 'AI-native data pipeline platform' },
  { id: 'apptronik', name: 'Apptronik', type: 'company', category: 'Robotics', amount: 935, valuation: 5300, year: 2026, quarter: 'Q1', city: 'Austin', country: 'USA', description: 'Humanoid robots for industrial labor' },
  { id: 'humans', name: 'humans&', type: 'company', category: 'AI Research', amount: 480, valuation: 4500, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI systems for human-AI collaboration' },
  { id: 'recursive', name: 'Recursive Intelligence', type: 'company', category: 'Semiconductors', amount: 300, valuation: 4000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI-powered chip design' },
  { id: 'erebor', name: 'Erebor Bank', type: 'company', category: 'Crypto', amount: 635, valuation: 4000, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Crypto-focused banking' },
  { id: 'bedrock', name: 'Bedrock Robotics', type: 'company', category: 'Robotics', amount: 270, valuation: 1800, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI-powered construction equipment autonomy' },
  { id: 'fundamental', name: 'Fundamental', type: 'company', category: 'AI', amount: 255, valuation: 1400, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI lab for foundational models' },
  { id: 'oxide', name: 'Oxide', type: 'company', category: 'Cloud Infrastructure', amount: 200, valuation: 1600, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Private cloud infrastructure' },
  { id: 'gecko', name: 'Gecko', type: 'company', category: 'Robotics', amount: 125, valuation: 1800, year: 2026, quarter: 'Q1', city: 'Boston', country: 'USA', description: 'AI robotics for industrial inspection' },
  { id: 'render', name: 'Render', type: 'company', category: 'Cloud', amount: 100, valuation: 1500, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Cloud hosting for AI workloads' },
  { id: 'arena', name: 'Arena', type: 'company', category: 'AI', amount: 150, valuation: 1700, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI tools for executive decision-making' },
  { id: 'pomelo', name: 'Pomelo Care', type: 'company', category: 'Healthcare', amount: 92, valuation: 1700, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Virtual maternity care platform' },
  { id: 'talkiatry', name: 'Talkiatry', type: 'company', category: 'Healthcare', amount: 210, valuation: 1400, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Psychiatric care platform' },
  { id: 'iterative', name: 'Iterative Health', type: 'company', category: 'Healthcare AI', amount: 75, valuation: 1400, year: 2026, quarter: 'Q1', city: 'Boston', country: 'USA', description: 'AI for gastroenterology' },
  { id: 'garner', name: 'Garner', type: 'company', category: 'Healthcare', amount: 118, valuation: 1400, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Data-driven doctor selection' },
  { id: 'solace', name: 'Solace', type: 'company', category: 'Healthcare', amount: 130, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Patient advocacy marketplace' },
  { id: 'midi', name: 'Midi Health', type: 'company', category: 'Healthcare', amount: 100, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Menopause telemedicine platform' },
  { id: 'lunar', name: 'Lunar Energy', type: 'company', category: 'Energy Storage', amount: 102, valuation: 1000, year: 2026, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'Home battery systems' },
  { id: 'codemetal', name: 'Code Metal', type: 'company', category: 'AI', amount: 125, valuation: 1300, year: 2026, quarter: 'Q1', city: 'Boston', country: 'USA', description: 'AI coding assistant for enterprises' },
  { id: 'aalyria', name: 'Aalyria', type: 'company', category: 'AI', amount: 100, valuation: 1300, year: 2026, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'AI network orchestration (Google spinout)' },
  { id: 'goodfire', name: 'Goodfire', type: 'company', category: 'AI', amount: 150, valuation: 1300, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI model interpretability tools' },
  { id: 'flapping', name: 'Flapping Airplanes', type: 'company', category: 'AI Research', amount: 180, valuation: 1500, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI research lab' },
  { id: 'profound', name: 'Profound', type: 'company', category: 'AI', amount: 96, valuation: 1000, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'AI search optimization (GEO)' },
  { id: 'upscale', name: 'Upscale AI', type: 'company', category: 'AI Infrastructure', amount: 200, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'GPU compute management' },
  { id: 'basis', name: 'Basis', type: 'company', category: 'AI', amount: 100, valuation: 1100, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'AI accounting automation' },
  { id: 'rain', name: 'Rain', type: 'company', category: 'Crypto', amount: 250, valuation: 1900, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Crypto wallet infrastructure' },
  { id: 'trm', name: 'TRM Labs', type: 'company', category: 'Crypto', amount: 70, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Crypto fraud detection' },
  { id: 'deepgram', name: 'Deepgram', type: 'company', category: 'AI', amount: 143, valuation: 1300, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Voice AI infrastructure' },
  { id: 'alpaca', name: 'Alpaca', type: 'company', category: 'Fintech', amount: 150, valuation: 1100, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'API and crypto brokerage' },
  { id: 'tulip', name: 'Tulip', type: 'company', category: 'Enterprise', amount: 120, valuation: 1300, year: 2026, quarter: 'Q1', city: 'Boston', country: 'USA', description: 'Factory operations platform' },
  { id: 'preply', name: 'Preply', type: 'company', category: 'Education', amount: 150, valuation: 1200, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Language learning marketplace' },
  { id: 'glossgenius', name: 'GlossGenius', type: 'company', category: 'Enterprise', amount: 44, valuation: 1100, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Salon management software' },
  { id: 'varda', name: 'Varda', type: 'company', category: 'Space', amount: 250, valuation: 1600, year: 2026, quarter: 'Q1', city: 'Los Angeles', country: 'USA', description: 'Space manufacturing' },
  { id: 'zainar', name: 'ZaiNar', type: 'company', category: 'IoT', amount: 100, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Wireless asset tracking' },
  { id: 'higgsfield', name: 'Higgsfield', type: 'company', category: 'AI', amount: 180, valuation: 1300, year: 2026, quarter: 'Q1', city: 'Los Angeles', country: 'USA', description: 'Video-generative AI' },
  { id: 'tandem', name: 'Tandem', type: 'company', category: 'Healthcare', amount: 100, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Doctor prescription efficiency' },
  { id: 'webai', name: 'WebAI', type: 'company', category: 'AI', amount: 200, valuation: 2500, year: 2026, quarter: 'Q1', city: 'Austin', country: 'USA', description: 'Private enterprise AI models' },
  { id: 'positron', name: 'Positron', type: 'company', category: 'Semiconductors', amount: 230, valuation: 1000, year: 2026, quarter: 'Q1', city: 'Austin', country: 'USA', description: 'AI semiconductor startup' },
  { id: 'skyryse', name: 'Skyryse', type: 'company', category: 'Aviation', amount: 300, valuation: 1100, year: 2026, quarter: 'Q1', city: 'Los Angeles', country: 'USA', description: 'Semi-automated flight systems' },
  { id: 'palebluedot', name: 'PaleBlueDot AI', type: 'company', category: 'AI Infrastructure', amount: 150, valuation: 1000, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'GPU computing management with AI' },
  { id: 'whop', name: 'Whop', type: 'company', category: 'E-Commerce', amount: 200, valuation: 1600, year: 2026, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Creator marketplace for digital products' },
  { id: 'stark', name: 'Stark', type: 'company', category: 'Defense', amount: 100, valuation: 1200, year: 2026, quarter: 'Q1', city: 'Berlin', country: 'Germany', description: 'Autonomous defense drones' },
  { id: 'tomorrow', name: 'Tomorrow.io', type: 'company', category: 'AI', amount: 175, valuation: 1000, year: 2026, quarter: 'Q1', city: 'Boston', country: 'USA', description: 'AI weather satellite constellation' },
];

const historicalCompanies = [
  { id: 'openai', name: 'OpenAI', type: 'company', category: 'AI', amount: 40000, valuation: 300000, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI research and ChatGPT' },
  { id: 'anthropic', name: 'Anthropic', type: 'company', category: 'AI', amount: 3500, valuation: 61500, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI safety and Claude' },
  { id: 'xai', name: 'xAI', type: 'company', category: 'AI', amount: 6000, valuation: 50000, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Elon Musk AI company' },
  { id: 'databricks', name: 'Databricks', type: 'company', category: 'Enterprise AI', amount: 10000, valuation: 43000, year: 2024, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Data and AI platform' },
  { id: 'stripe', name: 'Stripe', type: 'company', category: 'Fintech', amount: 650, valuation: 65000, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'Payment processing' },
  { id: 'scaleai', name: 'Scale AI', type: 'company', category: 'AI', amount: 1000, valuation: 13800, year: 2025, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'AI data infrastructure' },
  { id: 'cursor', name: 'Cursor', type: 'company', category: 'AI', amount: 3200, valuation: 29300, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'AI coding assistant' },
  { id: 'cerebras', name: 'Cerebras', type: 'company', category: 'AI Infrastructure', amount: 1100, valuation: 8100, year: 2025, quarter: 'Q3', city: 'Sunnyvale', country: 'USA', description: 'AI hardware and chips' },
  { id: 'harvey', name: 'Harvey', type: 'company', category: 'AI', amount: 600, valuation: 5000, year: 2025, quarter: 'Q2', city: 'New York', country: 'USA', description: 'AI for legal industry' },
  { id: 'abridge', name: 'Abridge', type: 'company', category: 'Healthcare AI', amount: 550, valuation: 5300, year: 2025, quarter: 'Q2', city: 'Pittsburgh', country: 'USA', description: 'AI medical transcription' },
  { id: 'glean', name: 'Glean', type: 'company', category: 'Enterprise AI', amount: 150, valuation: 7250, year: 2025, quarter: 'Q2', city: 'Palo Alto', country: 'USA', description: 'Enterprise AI search' },
  { id: 'together', name: 'Together AI', type: 'company', category: 'AI', amount: 305, valuation: 3300, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Open source generative AI' },
  { id: 'groq', name: 'Groq', type: 'company', category: 'AI Infrastructure', amount: 750, valuation: 6900, year: 2025, quarter: 'Q3', city: 'Mountain View', country: 'USA', description: 'AI inference chips' },
  { id: 'runway', name: 'Runway', type: 'company', category: 'AI', amount: 308, valuation: 3000, year: 2025, quarter: 'Q2', city: 'New York', country: 'USA', description: 'AI media production' },
  { id: 'shield', name: 'Shield AI', type: 'company', category: 'Defense Tech', amount: 240, valuation: 5300, year: 2025, quarter: 'Q1', city: 'San Diego', country: 'USA', description: 'AI defense technology' },
  { id: 'spacex', name: 'SpaceX', type: 'company', category: 'Space', amount: 1000, valuation: 800000, year: 2024, quarter: 'Q4', city: 'Hawthorne', country: 'USA', description: 'Space exploration and Starlink' },
  { id: 'fanatics', name: 'Fanatics', type: 'company', category: 'E-Commerce', amount: 700, valuation: 31000, year: 2024, quarter: 'Q2', city: 'Jacksonville', country: 'USA', description: 'Sports merchandise' },
  { id: 'plaid', name: 'Plaid', type: 'company', category: 'Fintech', amount: 425, valuation: 13400, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'Financial data connectivity' },
  { id: 'devoted', name: 'Devoted Health', type: 'company', category: 'Healthcare', amount: 175, valuation: 12600, year: 2024, quarter: 'Q2', city: 'Waltham', country: 'USA', description: 'Medicare Advantage' },
  { id: 'gong', name: 'Gong', type: 'company', category: 'Enterprise AI', amount: 250, valuation: 7200, year: 2024, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'Revenue intelligence' },
  { id: 'rippling', name: 'Rippling', type: 'company', category: 'HR Tech', amount: 200, valuation: 13500, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'HR and IT platform' },
  { id: 'applied', name: 'Applied Intuition', type: 'company', category: 'Autonomous', amount: 250, valuation: 6000, year: 2024, quarter: 'Q1', city: 'Mountain View', country: 'USA', description: 'ADAS/AD software' },
  { id: 'xenergy', name: 'X-Energy', type: 'company', category: 'Climate Tech', amount: 500, valuation: 2000, year: 2024, quarter: 'Q4', city: 'Rockville', country: 'USA', description: 'Nuclear energy' },
  { id: 'ascend', name: 'Ascend Elements', type: 'company', category: 'Climate Tech', amount: 460, valuation: 1500, year: 2024, quarter: 'Q1', city: 'Westborough', country: 'USA', description: 'Battery recycling' },
  { id: 'form', name: 'Form Energy', type: 'company', category: 'Climate Tech', amount: 405, valuation: 2000, year: 2024, quarter: 'Q4', city: 'Somerville', country: 'USA', description: 'Energy storage' },
];

const allCompanies = [...companies2026, ...historicalCompanies];

const fundingLinks = [
  { source: 'replit', target: 'accel', type: 'funded_by', amount: 400, round: 'Series D' },
  { source: 'mindrobotics', target: 'accel', type: 'funded_by', amount: 500, round: 'Series A' },
  { source: 'mindrobotics', target: 'a16z', type: 'funded_by', amount: 500, round: 'Series A' },
  { source: 'apptronik', target: 'bcapital', type: 'funded_by', amount: 935, round: 'Series A' },
  { source: 'humans', target: 'a16z', type: 'funded_by', amount: 480, round: 'Seed' },
  { source: 'recursive', target: 'lightspeed', type: 'funded_by', amount: 300, round: 'Series A' },
  { source: 'recursive', target: 'sequoia', type: 'funded_by', amount: 300, round: 'Series A' },
  { source: 'bedrock', target: '8vc', type: 'funded_by', amount: 270, round: 'Series B' },
  { source: 'bedrock', target: 'valor', type: 'funded_by', amount: 270, round: 'Series B' },
  { source: 'oxide', target: 'lux', type: 'funded_by', amount: 200, round: 'Series C' },
  { source: 'gecko', target: 'foundersfund', type: 'funded_by', amount: 125, round: 'Series D' },
  { source: 'render', target: 'general', type: 'funded_by', amount: 100, round: 'Series C' },
  { source: 'render', target: 'bessemer', type: 'funded_by', amount: 100, round: 'Series C' },
  { source: 'arena', target: 'a16z', type: 'funded_by', amount: 150, round: 'Series A' },
  { source: 'arena', target: 'felicis', type: 'funded_by', amount: 150, round: 'Series A' },
  { source: 'pomelo', target: 'a16z', type: 'funded_by', amount: 92, round: 'Series C' },
  { source: 'talkiatry', target: 'a16z', type: 'funded_by', amount: 210, round: 'Series D' },
  { source: 'iterative', target: 'insight', type: 'funded_by', amount: 75, round: 'Series C' },
  { source: 'garner', target: 'foundersfund', type: 'funded_by', amount: 118, round: 'Series D' },
  { source: 'solace', target: 'insight', type: 'funded_by', amount: 130, round: 'Series C' },
  { source: 'midi', target: 'gv', type: 'funded_by', amount: 100, round: 'Series D' },
  { source: 'codemetal', target: 'salesforce', type: 'funded_by', amount: 125, round: 'Series B' },
  { source: 'aalyria', target: 'battery', type: 'funded_by', amount: 100, round: 'Series B' },
  { source: 'upscale', target: 'tiger', type: 'funded_by', amount: 200, round: 'Series A' },
  { source: 'basis', target: 'khosla', type: 'funded_by', amount: 100, round: 'Series B' },
  { source: 'basis', target: 'accel', type: 'funded_by', amount: 100, round: 'Series B' },
  { source: 'rain', target: 'lightspeed', type: 'funded_by', amount: 250, round: 'Series C' },
  { source: 'rain', target: 'iconiq', type: 'funded_by', amount: 250, round: 'Series C' },
  { source: 'trm', target: 'bessemer', type: 'funded_by', amount: 70, round: 'Series C' },
  { source: 'deepgram', target: 'tiger', type: 'funded_by', amount: 143, round: 'Series C' },
  { source: 'alpaca', target: 'lightspeed', type: 'funded_by', amount: 150, round: 'Series D' },
  { source: 'tulip', target: 'insight', type: 'funded_by', amount: 120, round: 'Series D' },
  { source: 'varda', target: 'foundersfund', type: 'funded_by', amount: 250, round: 'Series D' },
  { source: 'varda', target: 'khosla', type: 'funded_by', amount: 250, round: 'Series D' },
  { source: 'varda', target: 'lux', type: 'funded_by', amount: 250, round: 'Series D' },
  { source: 'zainar', target: 'softbank', type: 'funded_by', amount: 100, round: 'Series A' },
  { source: 'positron', target: 'valor', type: 'funded_by', amount: 230, round: 'Series B' },
  { source: 'skyryse', target: 'foundersfund', type: 'funded_by', amount: 300, round: 'Series C' },
  { source: 'palebluedot', target: 'bcapital', type: 'funded_by', amount: 150, round: 'Series B' },
  { source: 'whop', target: 'a16z', type: 'funded_by', amount: 200, round: 'Growth' },
  { source: 'stark', target: 'foundersfund', type: 'funded_by', amount: 100, round: 'Series A' },
  { source: 'tomorrow', target: 'foundersfund', type: 'funded_by', amount: 175, round: 'Series F' },
  { source: 'openai', target: 'softbank', type: 'funded_by', amount: 40000, round: 'Series D' },
  { source: 'anthropic', target: 'lightspeed', type: 'funded_by', amount: 3500, round: 'Series E' },
  { source: 'xai', target: 'a16z', type: 'funded_by', amount: 6000, round: 'Series C' },
  { source: 'databricks', target: 'tiger', type: 'funded_by', amount: 10000, round: 'Series J' },
  { source: 'stripe', target: 'foundersfund', type: 'funded_by', amount: 650, round: 'Series I' },
  { source: 'cursor', target: 'a16z', type: 'funded_by', amount: 3200, round: 'Series D' },
  { source: 'cerebras', target: 'foundersfund', type: 'funded_by', amount: 1100, round: 'Series G' },
  { source: 'harvey', target: 'sequoia', type: 'funded_by', amount: 600, round: 'Series E' },
  { source: 'abridge', target: 'a16z', type: 'funded_by', amount: 550, round: 'Series E' },
  { source: 'glean', target: 'khosla', type: 'funded_by', amount: 150, round: 'Series F' },
  { source: 'together', target: 'nvidia', type: 'funded_by', amount: 305, round: 'Series B' },
  { source: 'groq', target: 'foundersfund', type: 'funded_by', amount: 750, round: 'Series D' },
  { source: 'runway', target: 'general', type: 'funded_by', amount: 308, round: 'Series D' },
  { source: 'shield', target: 'a16z', type: 'funded_by', amount: 240, round: 'Series F' },
  { source: 'spacex', target: 'foundersfund', type: 'funded_by', amount: 1000, round: 'Series F' },
  { source: 'fanatics', target: 'softbank', type: 'funded_by', amount: 700, round: 'Series F' },
  { source: 'plaid', target: 'a16z', type: 'funded_by', amount: 425, round: 'Series F' },
  { source: 'devoted', target: 'a16z', type: 'funded_by', amount: 175, round: 'Series E' },
  { source: 'gong', target: 'sequoia', type: 'funded_by', amount: 250, round: 'Series F' },
  { source: 'rippling', target: 'khosla', type: 'funded_by', amount: 200, round: 'Series F' },
  { source: 'applied', target: 'a16z', type: 'funded_by', amount: 250, round: 'Series E' },
  { source: 'xenergy', target: 'foundersfund', type: 'funded_by', amount: 500, round: 'Series C' },
  { source: 'ascend', target: 'foundersfund', type: 'funded_by', amount: 460, round: 'Growth' },
  { source: 'form', target: 'foundersfund', type: 'funded_by', amount: 405, round: 'Series F' },
];

const categoryToSector = {
  'AI': 'ai', 'Enterprise AI': 'ai', 'Healthcare AI': 'healthcare',
  'Fintech': 'fintech', 'Data Engineering': 'enterprise',
  'AI Research': 'ai', 'Semiconductors': 'semiconductors', 'Crypto': 'crypto',
  'Cloud Infrastructure': 'enterprise', 'Cloud': 'enterprise',
  'Energy Storage': 'energy', 'Enterprise': 'enterprise', 'Education': 'enterprise',
  'Space': 'space', 'IoT': 'enterprise', 'Aviation': 'enterprise', 'Defense': 'defense',
  'AI Infrastructure': 'ai', 'Robotics': 'robotics', 'Healthcare': 'healthcare',
  'Climate Tech': 'climate', 'Autonomous': 'robotics', 'HR Tech': 'enterprise',
  'E-Commerce': 'ecommerce'
};

const cityToLocation = {
  'San Francisco': 'sf', 'New York': 'nyc', 'Los Angeles': 'la',
  'Boston': 'boston', 'Austin': 'austin', 'Berlin': 'berlin',
  'Palo Alto': 'paloalto', 'Mountain View': 'paloalto',
  'San Diego': 'la', 'Hawthorne': 'la', 'Jacksonville': 'austin',
  'Waltham': 'boston', 'Pittsburgh': 'sf', 'Sunnyvale': 'paloalto',
  'Rockville': 'nyc', 'Westborough': 'boston', 'Somerville': 'boston'
};

// Generate sector and location links
const sectorLinks = allCompanies
  .filter(c => categoryToSector[c.category])
  .map(c => ({ source: c.id, target: categoryToSector[c.category], type: 'belongs_to' }));

const locationLinks = allCompanies
  .filter(c => cityToLocation[c.city])
  .map(c => ({ source: c.id, target: cityToLocation[c.city], type: 'located_in' }));

module.exports = {
  sectors,
  locations,
  investors,
  companies: allCompanies,
  fundingLinks,
  sectorLinks,
  locationLinks,
  getAllNodes: () => [...sectors, ...locations, ...investors, ...allCompanies],
  getAllLinks: () => [...fundingLinks, ...sectorLinks, ...locationLinks],
  getCompaniesByYear: (year) => year === 'all' ? allCompanies : allCompanies.filter(c => c.year === year),
  getYears: () => [...new Set(allCompanies.map(c => c.year))].sort((a, b) => b - a),
  getStats: (year) => {
    const companies = year === 'all' ? allCompanies : allCompanies.filter(c => c.year === year);
    const totalFunding = companies.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalValuation = companies.reduce((sum, c) => sum + (c.valuation || 0), 0);
    const avgDealSize = companies.length > 0 ? totalFunding / companies.length : 0;
    
    // Top sectors
    const sectorAmounts = {};
    companies.forEach(c => {
      if (c.category) {
        sectorAmounts[c.category] = (sectorAmounts[c.category] || 0) + (c.amount || 0);
      }
    });
    const topSectors = Object.entries(sectorAmounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Top locations
    const locationAmounts = {};
    companies.forEach(c => {
      if (c.city) {
        locationAmounts[c.city] = (locationAmounts[c.city] || 0) + (c.amount || 0);
      }
    });
    const topLocations = Object.entries(locationAmounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      totalFunding,
      totalValuation,
      avgDealSize,
      companyCount: companies.length,
      topSectors,
      topLocations
    };
  }
};
