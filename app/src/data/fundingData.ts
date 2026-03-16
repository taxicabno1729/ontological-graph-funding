// Comprehensive startup funding data with relationships
// Sources: Crunchbase, TechCrunch, KPMG, BuiltWorlds, 2024-2026

export interface FundingNode {
  id: string;
  name: string;
  type: 'company' | 'investor' | 'sector' | 'location';
  category?: string;
  amount?: number;
  valuation?: number;
  year: number;
  quarter?: string;
  description?: string;
  country?: string;
  city?: string;
  logo?: string;
}

export interface FundingLink {
  source: string;
  target: string;
  type: 'funded_by' | 'operates_in' | 'belongs_to' | 'located_in';
  amount?: number;
  round?: string;
}

export interface FundingData {
  nodes: FundingNode[];
  links: FundingLink[];
}

// Generate comprehensive funding data
export const generateFundingData = (): FundingData => {
  const nodes: FundingNode[] = [];
  const links: FundingLink[] = [];

  // Sectors/Ideas
  const sectors = [
    { id: 'ai', name: 'Artificial Intelligence', category: 'Technology' },
    { id: 'healthcare', name: 'Healthcare & Biotech', category: 'Healthcare' },
    { id: 'fintech', name: 'Financial Services', category: 'Finance' },
    { id: 'robotics', name: 'Robotics & Automation', category: 'Technology' },
    { id: 'climate', name: 'Climate Tech', category: 'Sustainability' },
    { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology' },
    { id: 'enterprise', name: 'Enterprise Software', category: 'Software' },
    { id: 'ecommerce', name: 'E-Commerce', category: 'Consumer' },
    { id: 'defense', name: 'Defense Tech', category: 'Government' },
    { id: 'semiconductors', name: 'Semiconductors', category: 'Hardware' },
  ];

  sectors.forEach(s => {
    nodes.push({
      id: s.id,
      name: s.name,
      type: 'sector',
      category: s.category,
      year: 2024,
      description: `${s.name} sector`
    });
  });

  // Locations
  const locations = [
    { id: 'sf', name: 'San Francisco', country: 'USA' },
    { id: 'nyc', name: 'New York', country: 'USA' },
    { id: 'la', name: 'Los Angeles', country: 'USA' },
    { id: 'boston', name: 'Boston', country: 'USA' },
    { id: 'seattle', name: 'Seattle', country: 'USA' },
    { id: 'austin', name: 'Austin', country: 'USA' },
    { id: 'london', name: 'London', country: 'UK' },
    { id: 'paris', name: 'Paris', country: 'France' },
    { id: 'berlin', name: 'Berlin', country: 'Germany' },
    { id: 'telaviv', name: 'Tel Aviv', country: 'Israel' },
    { id: 'toronto', name: 'Toronto', country: 'Canada' },
    { id: 'singapore', name: 'Singapore', country: 'Singapore' },
    { id: 'paloalto', name: 'Palo Alto', country: 'USA' },
    { id: 'mountainview', name: 'Mountain View', country: 'USA' },
    { id: 'santaclara', name: 'Santa Clara', country: 'USA' },
  ];

  locations.forEach(l => {
    nodes.push({
      id: l.id,
      name: l.name,
      type: 'location',
      country: l.country,
      year: 2024,
      description: `${l.name}, ${l.country}`
    });
  });

  // Major Investors/VCs
  const investors = [
    { id: 'a16z', name: 'Andreessen Horowitz', type: 'investor', category: 'VC' },
    { id: 'sequoia', name: 'Sequoia Capital', type: 'investor', category: 'VC' },
    { id: 'lightspeed', name: 'Lightspeed Venture Partners', type: 'investor', category: 'VC' },
    { id: 'thrive', name: 'Thrive Capital', type: 'investor', category: 'VC' },
    { id: 'accel', name: 'Accel', type: 'investor', category: 'VC' },
    { id: 'kleiner', name: 'Kleiner Perkins', type: 'investor', category: 'VC' },
    { id: 'index', name: 'Index Ventures', type: 'investor', category: 'VC' },
    { id: 'gc', name: 'General Catalyst', type: 'investor', category: 'VC' },
    { id: 'iconiq', name: 'Iconiq Capital', type: 'investor', category: 'Growth' },
    { id: 'softbank', name: 'SoftBank', type: 'investor', category: 'Growth' },
    { id: 'nvidia', name: 'Nvidia', type: 'investor', category: 'CVC' },
    { id: 'microsoft', name: 'Microsoft', type: 'investor', category: 'CVC' },
    { id: 'google', name: 'Google Ventures', type: 'investor', category: 'CVC' },
    { id: 'coatue', name: 'Coatue Management', type: 'investor', category: 'Hedge Fund' },
    { id: 'tiger', name: 'Tiger Global', type: 'investor', category: 'Hedge Fund' },
    { id: 'foundersfund', name: 'Founders Fund', type: 'investor', category: 'VC' },
    { id: 'bond', name: 'Bond Capital', type: 'investor', category: 'VC' },
    { id: 'insight', name: 'Insight Partners', type: 'investor', category: 'Growth' },
    { id: 'greylock', name: 'Greylock Partners', type: 'investor', category: 'VC' },
    { id: 'crv', name: 'CRV', type: 'investor', category: 'VC' },
  ];

  investors.forEach(i => {
    nodes.push({
      id: i.id,
      name: i.name,
      type: 'investor',
      category: i.category,
      year: 2024,
      description: `${i.name} - ${i.category}`
    });
  });

  // Companies with funding rounds 2024-2026
  const companies2026: FundingNode[] = [
    { id: 'nscale', name: 'Nscale', type: 'company', category: 'AI Infrastructure', amount: 2000, valuation: 10000, year: 2026, quarter: 'Q1', city: 'London', country: 'UK', description: 'AI infrastructure and cloud computing' },
    { id: 'ami', name: 'Advanced Machine Intelligence', type: 'company', category: 'AI', amount: 1030, valuation: 5000, year: 2026, quarter: 'Q1', city: 'Paris', country: 'France', description: 'AI and machine learning platform' },
    { id: 'quince', name: 'Quince', type: 'company', category: 'E-Commerce', amount: 500, valuation: 10100, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Affordable luxury e-commerce platform' },
    { id: 'nexthop', name: 'Nexthop AI', type: 'company', category: 'AI Infrastructure', amount: 500, valuation: 2500, year: 2026, quarter: 'Q1', city: 'Santa Clara', country: 'USA', description: 'AI networking and switching technology' },
    { id: 'mind', name: 'Mind Robotics', type: 'company', category: 'Robotics', amount: 500, valuation: 2000, year: 2026, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'AI-enabled industrial robotics' },
    { id: 'rhoda', name: 'Rhoda AI', type: 'company', category: 'Robotics', amount: 450, valuation: 1800, year: 2026, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'Robotics training with video data' },
    { id: 'lmarena', name: 'LMArena', type: 'company', category: 'AI', amount: 100, valuation: 600, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'LLM benchmarking platform' },
    { id: 'skild', name: 'Skild AI', type: 'company', category: 'Robotics', amount: 300, valuation: 1500, year: 2026, quarter: 'Q1', city: 'Pittsburgh', country: 'USA', description: 'General-purpose AI brain for robots' },
    { id: 'recursive', name: 'Recursive Intelligence', type: 'company', category: 'AI', amount: 300, valuation: 1200, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI self-improvement technology' },
    { id: 'upscale', name: 'Upscale AI', type: 'company', category: 'AI Infrastructure', amount: 200, valuation: 800, year: 2026, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI networking platform and silicon' },
  ];

  const companies2025: FundingNode[] = [
    // AI Giants
    { id: 'openai', name: 'OpenAI', type: 'company', category: 'AI', amount: 40000, valuation: 300000, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI research and ChatGPT' },
    { id: 'anthropic', name: 'Anthropic', type: 'company', category: 'AI', amount: 3500, valuation: 61500, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI safety and Claude' },
    { id: 'xai', name: 'xAI', type: 'company', category: 'AI', amount: 6000, valuation: 50000, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Elon Musk\'s AI company' },
    { id: 'scale', name: 'Scale AI', type: 'company', category: 'AI', amount: 1000, valuation: 13800, year: 2025, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'AI data labeling and infrastructure' },
    { id: 'cerebras', name: 'Cerebras', type: 'company', category: 'AI Infrastructure', amount: 1100, valuation: 8100, year: 2025, quarter: 'Q3', city: 'Sunnyvale', country: 'USA', description: 'AI hardware and chips' },
    { id: 'cursor', name: 'Cursor', type: 'company', category: 'AI', amount: 3200, valuation: 29300, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'AI coding assistant' },
    { id: 'cognition', name: 'Cognition AI', type: 'company', category: 'AI', amount: 400, valuation: 10200, year: 2025, quarter: 'Q3', city: 'New York', country: 'USA', description: 'AI coding agent Devin' },
    { id: 'sierra', name: 'Sierra', type: 'company', category: 'AI', amount: 350, valuation: 10000, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'Customer service AI agents' },
    { id: 'reflection', name: 'Reflection AI', type: 'company', category: 'AI', amount: 2000, valuation: 8000, year: 2025, quarter: 'Q4', city: 'Brooklyn', country: 'USA', description: 'Superintelligent autonomous systems' },
    { id: 'glean', name: 'Glean', type: 'company', category: 'Enterprise AI', amount: 150, valuation: 7250, year: 2025, quarter: 'Q2', city: 'Palo Alto', country: 'USA', description: 'Enterprise AI search' },
    { id: 'harvey', name: 'Harvey', type: 'company', category: 'AI', amount: 600, valuation: 5000, year: 2025, quarter: 'Q2', city: 'New York', country: 'USA', description: 'AI for legal industry' },
    { id: 'abridge', name: 'Abridge', type: 'company', category: 'Healthcare AI', amount: 550, valuation: 5300, year: 2025, quarter: 'Q2', city: 'Pittsburgh', country: 'USA', description: 'AI medical transcription' },
    { id: 'elevenlabs', name: 'ElevenLabs', type: 'company', category: 'AI', amount: 180, valuation: 3300, year: 2025, quarter: 'Q1', city: 'London', country: 'UK', description: 'Synthetic voice AI' },
    { id: 'luma', name: 'Luma AI', type: 'company', category: 'AI', amount: 900, valuation: 4000, year: 2025, quarter: 'Q4', city: 'Palo Alto', country: 'USA', description: 'AI photo and video creation' },
    { id: 'sesame', name: 'Sesame', type: 'company', category: 'AI', amount: 250, valuation: 1200, year: 2025, quarter: 'Q4', city: 'New York', country: 'USA', description: 'Voice AI company' },
    { id: 'fireworks', name: 'Fireworks AI', type: 'company', category: 'AI', amount: 250, valuation: 4000, year: 2025, quarter: 'Q4', city: 'Redwood City', country: 'USA', description: 'Open source AI platform' },
    { id: 'together', name: 'Together AI', type: 'company', category: 'AI', amount: 305, valuation: 3300, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Open source generative AI' },
    { id: 'lambda', name: 'Lambda', type: 'company', category: 'AI Infrastructure', amount: 480, valuation: 2500, year: 2025, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'AI cloud computing' },
    { id: 'groq', name: 'Groq', type: 'company', category: 'AI Infrastructure', amount: 750, valuation: 6900, year: 2025, quarter: 'Q3', city: 'Mountain View', country: 'USA', description: 'AI inference chips' },
    { id: 'baseten', name: 'Baseten', type: 'company', category: 'AI Infrastructure', amount: 150, valuation: 2100, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'AI model deployment' },
    { id: 'chai', name: 'Chai Discovery', type: 'company', category: 'AI Biotech', amount: 130, valuation: 1200, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'AI for drug discovery' },
    { id: 'lila', name: 'Lila Sciences', type: 'company', category: 'AI', amount: 550, valuation: 2000, year: 2025, quarter: 'Q4', city: 'Cambridge', country: 'USA', description: 'Science superintelligence platform' },
    { id: 'periodic', name: 'Periodic Labs', type: 'company', category: 'AI', amount: 300, valuation: 900, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'AI scientist platform' },
    { id: 'thinking', name: 'Thinking Machines Lab', type: 'company', category: 'AI', amount: 2000, valuation: 12000, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'AI research lab' },
    { id: 'decart', name: 'Decart', type: 'company', category: 'AI', amount: 100, valuation: 3100, year: 2025, quarter: 'Q3', city: 'Tel Aviv', country: 'Israel', description: 'AI research lab' },
    { id: 'fal', name: 'Fal', type: 'company', category: 'AI', amount: 265, valuation: 4500, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Generative media platform' },
    { id: 'genspark', name: 'Genspark', type: 'company', category: 'AI', amount: 275, valuation: 1250, year: 2025, quarter: 'Q4', city: 'Palo Alto', country: 'USA', description: 'AI workspace platform' },
    { id: 'hippocratic', name: 'Hippocratic AI', type: 'company', category: 'Healthcare AI', amount: 267, valuation: 3500, year: 2025, quarter: 'Q4', city: 'Palo Alto', country: 'USA', description: 'Healthcare AI agents' },
    { id: 'elise', name: 'EliseAI', type: 'company', category: 'Healthcare AI', amount: 250, valuation: 2200, year: 2025, quarter: 'Q3', city: 'New York', country: 'USA', description: 'Healthcare automation' },
    { id: 'ambience', name: 'Ambience Healthcare', type: 'company', category: 'Healthcare AI', amount: 243, valuation: 1200, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'AI healthcare OS' },
    { id: 'reka', name: 'Reka AI', type: 'company', category: 'AI', amount: 110, valuation: 1000, year: 2025, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'AI research lab' },
    { id: 'openevidence', name: 'OpenEvidence', type: 'company', category: 'Healthcare AI', amount: 410, valuation: 6000, year: 2025, quarter: 'Q3', city: 'Cambridge', country: 'USA', description: 'AI medical search' },
    { id: 'harmonic', name: 'Harmonic', type: 'company', category: 'AI', amount: 100, valuation: 875, year: 2025, quarter: 'Q3', city: 'New York', country: 'USA', description: 'Mathematical reasoning engine' },
    { id: 'tennr', name: 'Tennr', type: 'company', category: 'Healthcare AI', amount: 101, valuation: 605, year: 2025, quarter: 'Q2', city: 'New York', country: 'USA', description: 'Healthcare AI platform' },
    { id: 'snorkel', name: 'Snorkel AI', type: 'company', category: 'AI', amount: 100, valuation: 1300, year: 2025, quarter: 'Q2', city: 'Redwood City', country: 'USA', description: 'AI data labeling' },
    { id: 'sandbox', name: 'SandboxAQ', type: 'company', category: 'AI', amount: 450, valuation: 5700, year: 2025, quarter: 'Q2', city: 'Palo Alto', country: 'USA', description: 'AI and quantum computing' },
    { id: 'runway', name: 'Runway', type: 'company', category: 'AI', amount: 308, valuation: 3000, year: 2025, quarter: 'Q2', city: 'New York', country: 'USA', description: 'AI media production' },
    { id: 'shield', name: 'Shield AI', type: 'company', category: 'Defense Tech', amount: 240, valuation: 5300, year: 2025, quarter: 'Q1', city: 'San Diego', country: 'USA', description: 'AI defense technology' },
    { id: 'turing', name: 'Turing', type: 'company', category: 'AI', amount: 111, valuation: 2200, year: 2025, quarter: 'Q1', city: 'Palo Alto', country: 'USA', description: 'AI coding platform' },
    { id: 'insilico', name: 'Insilico Medicine', type: 'company', category: 'AI Biotech', amount: 110, valuation: 1000, year: 2025, quarter: 'Q1', city: 'Cambridge', country: 'USA', description: 'AI drug discovery' },
    { id: 'celestial', name: 'Celestial AI', type: 'company', category: 'AI Infrastructure', amount: 250, valuation: 2500, year: 2025, quarter: 'Q1', city: 'Santa Clara', country: 'USA', description: 'Optical interconnect technology' },
    { id: 'uniphore', name: 'Uniphore', type: 'company', category: 'Enterprise AI', amount: 260, valuation: 2500, year: 2025, quarter: 'Q4', city: 'Palo Alto', country: 'USA', description: 'Enterprise AI platform' },
    { id: 'evenup', name: 'EvenUp', type: 'company', category: 'AI', amount: 150, valuation: 2000, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'AI for legal field' },
    { id: 'distyl', name: 'Distyl AI', type: 'company', category: 'AI', amount: 175, valuation: 1800, year: 2025, quarter: 'Q3', city: 'Palo Alto', country: 'USA', description: 'AI enterprise software' },
    { id: 'invisible', name: 'Invisible Technologies', type: 'company', category: 'AI', amount: 100, valuation: 2000, year: 2025, quarter: 'Q3', city: 'New York', country: 'USA', description: 'AI training platform' },
    { id: 'modular', name: 'Modular', type: 'company', category: 'AI', amount: 250, valuation: 1200, year: 2025, quarter: 'Q3', city: 'Palo Alto', country: 'USA', description: 'AI development platform' },
    { id: 'eudia', name: 'Eudia', type: 'company', category: 'AI', amount: 105, valuation: 400, year: 2025, quarter: 'Q1', city: 'New York', country: 'USA', description: 'AI legal tech' },
    { id: 'encharge', name: 'EnCharge AI', type: 'company', category: 'AI Hardware', amount: 100, valuation: 350, year: 2025, quarter: 'Q1', city: 'Santa Clara', country: 'USA', description: 'AI hardware startup' },
    { id: 'tensorwave', name: 'TensorWave', type: 'company', category: 'AI Infrastructure', amount: 100, valuation: 400, year: 2025, quarter: 'Q2', city: 'Las Vegas', country: 'USA', description: 'AI infrastructure' },
    { id: 'parallel', name: 'Parallel', type: 'company', category: 'AI', amount: 100, valuation: 500, year: 2025, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Web infrastructure for AI agents' },
    { id: 'unconventional', name: 'Unconventional AI', type: 'company', category: 'AI', amount: 475, valuation: 4500, year: 2025, quarter: 'Q4', city: 'Palo Alto', country: 'USA', description: 'AI-native computing' },
    { id: '7ai', name: '7AI', type: 'company', category: 'Cybersecurity', amount: 130, valuation: 600, year: 2025, quarter: 'Q4', city: 'Boston', country: 'USA', description: 'Cybersecurity AI agents' },
    { id: 'mythic', name: 'Mythic', type: 'company', category: 'AI Hardware', amount: 125, valuation: 450, year: 2025, quarter: 'Q4', city: 'Austin', country: 'USA', description: 'Power-efficient AI compute' },
  ];

  const companies2024: FundingNode[] = [
    { id: 'spacex', name: 'SpaceX', type: 'company', category: 'Aerospace', amount: 1000, valuation: 800000, year: 2024, quarter: 'Q4', city: 'Hawthorne', country: 'USA', description: 'Space exploration and Starlink' },
    { id: 'bytedance', name: 'ByteDance', type: 'company', category: 'Social Media', amount: 5000, valuation: 480000, year: 2024, quarter: 'Q3', city: 'Beijing', country: 'China', description: 'TikTok parent company' },
    { id: 'stripe', name: 'Stripe', type: 'company', category: 'Fintech', amount: 650, valuation: 65000, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'Payment processing' },
    { id: 'databricks', name: 'Databricks', type: 'company', category: 'Enterprise AI', amount: 10000, valuation: 43000, year: 2024, quarter: 'Q4', city: 'San Francisco', country: 'USA', description: 'Data and AI platform' },
    { id: 'plaid', name: 'Plaid', type: 'company', category: 'Fintech', amount: 425, valuation: 13400, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'Financial data connectivity' },
    { id: 'figma', name: 'Figma', type: 'company', category: 'Design', amount: 0, valuation: 12500, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Collaborative design tool' },
    { id: 'canva', name: 'Canva', type: 'company', category: 'Design', amount: 0, valuation: 26000, year: 2024, quarter: 'Q1', city: 'Sydney', country: 'Australia', description: 'Design platform' },
    { id: 'reddit', name: 'Reddit', type: 'company', category: 'Social Media', amount: 0, valuation: 10000, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Social media platform' },
    { id: 'klarna', name: 'Klarna', type: 'company', category: 'Fintech', amount: 0, valuation: 14600, year: 2024, quarter: 'Q1', city: 'Stockholm', country: 'Sweden', description: 'Buy now pay later' },
    { id: 'shein', name: 'Shein', type: 'company', category: 'E-Commerce', amount: 0, valuation: 66000, year: 2024, quarter: 'Q1', city: 'Singapore', country: 'Singapore', description: 'Fast fashion e-commerce' },
    { id: 'fanatics', name: 'Fanatics', type: 'company', category: 'E-Commerce', amount: 700, valuation: 31000, year: 2024, quarter: 'Q2', city: 'Jacksonville', country: 'USA', description: 'Sports merchandise' },
    { id: 'chime', name: 'Chime', type: 'company', category: 'Fintech', amount: 0, valuation: 25000, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Digital banking' },
    { id: 'devoted', name: 'Devoted Health', type: 'company', category: 'Healthcare', amount: 175, valuation: 12600, year: 2024, quarter: 'Q2', city: 'Waltham', country: 'USA', description: 'Medicare Advantage' },
    { id: 'notion', name: 'Notion', type: 'company', category: 'Productivity', amount: 0, valuation: 10000, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Workspace productivity' },
    { id: 'gong', name: 'Gong', type: 'company', category: 'Enterprise AI', amount: 250, valuation: 7200, year: 2024, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'Revenue intelligence' },
    { id: 'verkada', name: 'Verkada', type: 'company', category: 'Security', amount: 0, valuation: 3450, year: 2024, quarter: 'Q1', city: 'San Mateo', country: 'USA', description: 'Enterprise security' },
    { id: 'brex', name: 'Brex', type: 'company', category: 'Fintech', amount: 0, valuation: 12300, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Corporate cards' },
    { id: 'rippling', name: 'Rippling', type: 'company', category: 'HR Tech', amount: 200, valuation: 13500, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'HR and IT platform' },
    { id: 'checkr', name: 'Checkr', type: 'company', category: 'HR Tech', amount: 0, valuation: 4600, year: 2024, quarter: 'Q1', city: 'San Francisco', country: 'USA', description: 'Background checks' },
    { id: 'scaleai', name: 'Scale AI', type: 'company', category: 'AI', amount: 1000, valuation: 13800, year: 2024, quarter: 'Q2', city: 'San Francisco', country: 'USA', description: 'AI data infrastructure' },
    { id: 'applied', name: 'Applied Intuition', type: 'company', category: 'Autonomous', amount: 250, valuation: 6000, year: 2024, quarter: 'Q1', city: 'Mountain View', country: 'USA', description: 'ADAS/AD software' },
    { id: 'osapiens', name: 'osapiens', type: 'company', category: 'Climate Tech', amount: 120, valuation: 500, year: 2024, quarter: 'Q3', city: 'Mannheim', country: 'Germany', description: 'ESG compliance software' },
    { id: 'xenergy', name: 'X-Energy', type: 'company', category: 'Climate Tech', amount: 500, valuation: 2000, year: 2024, quarter: 'Q4', city: 'Rockville', country: 'USA', description: 'Nuclear energy' },
    { id: 'ascend', name: 'Ascend Elements', type: 'company', category: 'Climate Tech', amount: 460, valuation: 1500, year: 2024, quarter: 'Q1', city: 'Westborough', country: 'USA', description: 'Battery recycling' },
    { id: 'form', name: 'Form Energy', type: 'company', category: 'Climate Tech', amount: 405, valuation: 2000, year: 2024, quarter: 'Q4', city: 'Somerville', country: 'USA', description: 'Energy storage' },
    { id: 'twelve', name: 'Twelve', type: 'company', category: 'Climate Tech', amount: 200, valuation: 1000, year: 2024, quarter: 'Q3', city: 'San Francisco', country: 'USA', description: 'CO2 to materials' },
    { id: 'path', name: 'Path Robotics', type: 'company', category: 'Robotics', amount: 100, valuation: 500, year: 2024, quarter: 'Q4', city: 'Columbus', country: 'USA', description: 'Welding robots' },
    { id: 'graymatter', name: 'GrayMatter Robotics', type: 'company', category: 'Robotics', amount: 45, valuation: 250, year: 2024, quarter: 'Q2', city: 'Los Angeles', country: 'USA', description: 'Surface treatment robots' },
    { id: 'instagrid', name: 'Instagrid', type: 'company', category: 'Climate Tech', amount: 95, valuation: 500, year: 2024, quarter: 'Q1', city: 'Ludwigsburg', country: 'Germany', description: 'Portable energy' },
    { id: 'intenseye', name: 'Intenseye', type: 'company', category: 'Safety AI', amount: 64, valuation: 300, year: 2024, quarter: 'Q1', city: 'New York', country: 'USA', description: 'Workforce safety AI' },
    { id: 'higharc', name: 'Higharc', type: 'company', category: 'Construction', amount: 54, valuation: 300, year: 2024, quarter: 'Q1', city: 'Raleigh', country: 'USA', description: 'Homebuilding platform' },
    { id: 'scala', name: 'Scala Data Centers', type: 'company', category: 'Data Center', amount: 550, valuation: 2500, year: 2024, quarter: 'Q4', city: 'Sao Paulo', country: 'Brazil', description: 'Data center construction' },
    { id: '1komma5', name: '1KOMMA5°', type: 'company', category: 'Climate Tech', amount: 165, valuation: 1000, year: 2024, quarter: 'Q4', city: 'Hamburg', country: 'Germany', description: 'Clean energy systems' },
    { id: 'aira', name: 'Aira', type: 'company', category: 'Climate Tech', amount: 160, valuation: 800, year: 2024, quarter: 'Q1', city: 'Stockholm', country: 'Sweden', description: 'Sustainable HVAC' },
    { id: 'guesty', name: 'Guesty', type: 'company', category: 'PropTech', amount: 130, valuation: 900, year: 2024, quarter: 'Q2', city: 'Covina', country: 'USA', description: 'Rental management' },
    { id: 'gropyus', name: 'Gropyus', type: 'company', category: 'Construction', amount: 109, valuation: 500, year: 2024, quarter: 'Q4', city: 'Vienna', country: 'Austria', description: 'Modular buildings' },
  ];

  // Add all companies
  [...companies2026, ...companies2025, ...companies2024].forEach(c => {
    nodes.push(c);
  });

  // Create links - Company to Sector
  const sectorMapping: Record<string, string> = {
    'AI': 'ai', 'AI Infrastructure': 'ai', 'AI Biotech': 'ai', 'Healthcare AI': 'healthcare',
    'Enterprise AI': 'enterprise', 'Robotics': 'robotics', 'E-Commerce': 'ecommerce',
    'Healthcare': 'healthcare', 'Healthcare & Biotech': 'healthcare',
    'Financial Services': 'fintech', 'Fintech': 'fintech',
    'Climate Tech': 'climate', 'Defense Tech': 'defense',
    'Cybersecurity': 'cybersecurity', 'Enterprise Software': 'enterprise',
    'Aerospace': 'defense', 'Social Media': 'enterprise',
    'Design': 'enterprise', 'Productivity': 'enterprise',
    'HR Tech': 'enterprise', 'Security': 'cybersecurity',
    'Autonomous': 'robotics', 'Safety AI': 'ai',
    'Construction': 'climate', 'Data Center': 'semiconductors',
    'PropTech': 'enterprise', 'AI Hardware': 'semiconductors'
  };

  [...companies2026, ...companies2025, ...companies2024].forEach(c => {
    const sectorId = sectorMapping[c.category || ''];
    if (sectorId) {
      links.push({
        source: c.id,
        target: sectorId,
        type: 'belongs_to'
      });
    }

    // Company to Location
    const locationMap: Record<string, string> = {
      'San Francisco': 'sf', 'New York': 'nyc', 'Los Angeles': 'la',
      'Boston': 'boston', 'Seattle': 'seattle', 'Austin': 'austin',
      'London': 'london', 'Paris': 'paris', 'Berlin': 'berlin',
      'Tel Aviv': 'telaviv', 'Toronto': 'toronto', 'Singapore': 'singapore',
      'Palo Alto': 'paloalto', 'Mountain View': 'mountainview',
      'Santa Clara': 'santaclara', 'Cambridge': 'boston',
      'Pittsburgh': 'sf', 'Brooklyn': 'nyc', 'Sunnyvale': 'santaclara',
      'Redwood City': 'sf', 'San Diego': 'sf', 'Hawthorne': 'la',
      'Beijing': 'singapore', 'Stockholm': 'london', 'Sydney': 'singapore',
      'Jacksonville': 'austin', 'Waltham': 'boston', 'San Mateo': 'sf',
      'Mannheim': 'berlin', 'Rockville': 'nyc', 'Westborough': 'boston',
      'Somerville': 'boston', 'Columbus': 'nyc', 'Ludwigsburg': 'berlin',
      'Raleigh': 'nyc', 'Sao Paulo': 'singapore', 'Hamburg': 'berlin',
      'Vienna': 'berlin', 'Covina': 'la',
      'Las Vegas': 'austin'
    };

    const locId = locationMap[c.city || ''];
    if (locId) {
      links.push({
        source: c.id,
        target: locId,
        type: 'located_in'
      });
    }
  });

  // Company to Investor links (major rounds)
  const investorLinks: FundingLink[] = [
    // 2026
    { source: 'quince', target: 'iconiq', type: 'funded_by', amount: 500, round: 'Series E' },
    { source: 'nexthop', target: 'lightspeed', type: 'funded_by', amount: 500, round: 'Series B' },
    { source: 'nexthop', target: 'a16z', type: 'funded_by', amount: 500, round: 'Series B' },
    { source: 'mind', target: 'accel', type: 'funded_by', amount: 500, round: 'Series A' },
    { source: 'mind', target: 'a16z', type: 'funded_by', amount: 500, round: 'Series A' },
    { source: 'lmarena', target: 'a16z', type: 'funded_by', amount: 100, round: 'Seed' },
    { source: 'lmarena', target: 'lightspeed', type: 'funded_by', amount: 100, round: 'Seed' },
    { source: 'skild', target: 'lightspeed', type: 'funded_by', amount: 300, round: 'Series A' },
    { source: 'skild', target: 'sequoia', type: 'funded_by', amount: 300, round: 'Series A' },
    { source: 'recursive', target: 'lightspeed', type: 'funded_by', amount: 300, round: 'Series A' },
    { source: 'recursive', target: 'sequoia', type: 'funded_by', amount: 300, round: 'Series A' },
    { source: 'upscale', target: 'maverick', type: 'funded_by', amount: 200, round: 'Seed' },

    // 2025 - OpenAI
    { source: 'openai', target: 'softbank', type: 'funded_by', amount: 40000, round: 'Series D' },
    { source: 'openai', target: 'thrive', type: 'funded_by', amount: 40000, round: 'Series D' },
    { source: 'openai', target: 'microsoft', type: 'funded_by', amount: 40000, round: 'Series D' },
    { source: 'openai', target: 'nvidia', type: 'funded_by', amount: 40000, round: 'Series D' },

    // Anthropic
    { source: 'anthropic', target: 'lightspeed', type: 'funded_by', amount: 3500, round: 'Series E' },
    { source: 'anthropic', target: 'salesforce', type: 'funded_by', amount: 3500, round: 'Series E' },

    // xAI
    { source: 'xai', target: 'a16z', type: 'funded_by', amount: 6000, round: 'Series C' },
    { source: 'xai', target: 'nvidia', type: 'funded_by', amount: 6000, round: 'Series C' },

    // Cursor
    { source: 'cursor', target: 'thrive', type: 'funded_by', amount: 900, round: 'Series C' },
    { source: 'cursor', target: 'a16z', type: 'funded_by', amount: 2300, round: 'Series D' },

    // Cognition
    { source: 'cognition', target: 'foundersfund', type: 'funded_by', amount: 400, round: 'Series C' },

    // Sierra
    { source: 'sierra', target: 'greenoaks', type: 'funded_by', amount: 350, round: 'Series B' },

    // Harvey
    { source: 'harvey', target: 'sequoia', type: 'funded_by', amount: 300, round: 'Series D' },
    { source: 'harvey', target: 'kleiner', type: 'funded_by', amount: 300, round: 'Series E' },
    { source: 'harvey', target: 'coatue', type: 'funded_by', amount: 300, round: 'Series E' },

    // Abridge
    { source: 'abridge', target: 'a16z', type: 'funded_by', amount: 300, round: 'Series D' },
    { source: 'abridge', target: 'a16z', type: 'funded_by', amount: 300, round: 'Series E' },
    { source: 'abridge', target: 'khosla', type: 'funded_by', amount: 300, round: 'Series E' },

    // ElevenLabs
    { source: 'elevenlabs', target: 'iconiq', type: 'funded_by', amount: 180, round: 'Series C' },
    { source: 'elevenlabs', target: 'a16z', type: 'funded_by', amount: 180, round: 'Series C' },
    { source: 'elevenlabs', target: 'sequoia', type: 'funded_by', amount: 180, round: 'Series C' },

    // Luma
    { source: 'luma', target: 'humain', type: 'funded_by', amount: 900, round: 'Series C' },
    { source: 'luma', target: 'a16z', type: 'funded_by', amount: 900, round: 'Series C' },

    // Glean
    { source: 'glean', target: 'kleiner', type: 'funded_by', amount: 150, round: 'Series F' },
    { source: 'glean', target: 'sequoia', type: 'funded_by', amount: 150, round: 'Series F' },
    { source: 'glean', target: 'lightspeed', type: 'funded_by', amount: 150, round: 'Series F' },

    // Together AI
    { source: 'together', target: 'prosperity7', type: 'funded_by', amount: 305, round: 'Series B' },
    { source: 'together', target: 'gc', type: 'funded_by', amount: 305, round: 'Series B' },
    { source: 'together', target: 'nvidia', type: 'funded_by', amount: 305, round: 'Series B' },

    // Lambda
    { source: 'lambda', target: 'sgw', type: 'funded_by', amount: 480, round: 'Series D' },
    { source: 'lambda', target: 'nvidia', type: 'funded_by', amount: 480, round: 'Series D' },

    // Groq
    { source: 'groq', target: 'disruptive', type: 'funded_by', amount: 750, round: 'Series D' },

    // Cerebras
    { source: 'cerebras', target: 'fidelity', type: 'funded_by', amount: 1100, round: 'Series G' },

    // Shield AI
    { source: 'shield', target: 'a16z', type: 'funded_by', amount: 240, round: 'Series F' },

    // SandboxAQ
    { source: 'sandbox', target: 'nvidia', type: 'funded_by', amount: 450, round: 'Series E' },
    { source: 'sandbox', target: 'google', type: 'funded_by', amount: 450, round: 'Series E' },

    // Runway
    { source: 'runway', target: 'gc', type: 'funded_by', amount: 308, round: 'Series D' },
    { source: 'runway', target: 'softbank', type: 'funded_by', amount: 308, round: 'Series D' },
    { source: 'runway', target: 'nvidia', type: 'funded_by', amount: 308, round: 'Series D' },

    // Scale AI
    { source: 'scale', target: 'accel', type: 'funded_by', amount: 1000, round: 'Series F' },

    // Databricks
    { source: 'databricks', target: 'tiger', type: 'funded_by', amount: 10000, round: 'Series J' },

    // Stripe
    { source: 'stripe', target: 'foundersfund', type: 'funded_by', amount: 650, round: 'Series I' },

    // Rippling
    { source: 'rippling', target: 'nvidia', type: 'funded_by', amount: 200, round: 'Series F' },

    // X-Energy
    { source: 'xenergy', target: 'amazon', type: 'funded_by', amount: 500, round: 'Series C' },

    // Ascend Elements
    { source: 'ascend', target: 'temasek', type: 'funded_by', amount: 460, round: 'Growth' },

    // Form Energy
    { source: 'form', target: 'trowe', type: 'funded_by', amount: 405, round: 'Series F' },

    // Applied Intuition
    { source: 'applied', target: 'porsche', type: 'funded_by', amount: 250, round: 'Series E' },
    { source: 'applied', target: 'a16z', type: 'funded_by', amount: 250, round: 'Series E' },

    // Scala Data Centers
    { source: 'scala', target: 'coatue', type: 'funded_by', amount: 550, round: 'Growth' },

    // Guesty
    { source: 'guesty', target: 'kkr', type: 'funded_by', amount: 130, round: 'Series G' },

    // Intenseye
    { source: 'intenseye', target: 'lightspeed', type: 'funded_by', amount: 64, round: 'Series B' },

    // GrayMatter
    { source: 'graymatter', target: 'wellington', type: 'funded_by', amount: 45, round: 'Series B' },

    // Instagrid
    { source: 'instagrid', target: 'tvg', type: 'funded_by', amount: 95, round: 'Series C' },
  ];

  links.push(...investorLinks);

  return { nodes, links };
};

// Get unique years from data
export const getYears = (data: FundingData): number[] => {
  const years = new Set<number>();
  data.nodes.forEach(n => {
    if (n.year) years.add(n.year);
  });
  return Array.from(years).sort((a, b) => b - a);
};

// Get unique sectors
export const getSectors = (data: FundingData): string[] => {
  const sectors = new Set<string>();
  data.nodes.forEach(n => {
    if (n.type === 'sector') sectors.add(n.name);
  });
  return Array.from(sectors).sort();
};

// Get unique locations
export const getLocations = (data: FundingData): string[] => {
  const locations = new Set<string>();
  data.nodes.forEach(n => {
    if (n.type === 'location') locations.add(n.name);
  });
  return Array.from(locations).sort();
};

// Filter data by year
export const filterByYear = (data: FundingData, year: number | 'all'): FundingData => {
  if (year === 'all') return data;

  const filteredNodes = data.nodes.filter(n => n.year === year || n.type === 'sector' || n.type === 'location' || n.type === 'investor');
  const nodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = data.links.filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string));

  return { nodes: filteredNodes, links: filteredLinks };
};

// Get funding statistics
export const getFundingStats = (data: FundingData, year: number | 'all') => {
  const filtered = year === 'all' ? data : filterByYear(data, year);
  const companies = filtered.nodes.filter(n => n.type === 'company');

  const totalFunding = companies.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalValuation = companies.reduce((sum, c) => sum + (c.valuation || 0), 0);
  const avgDealSize = companies.length > 0 ? totalFunding / companies.length : 0;
  const companyCount = companies.length;

  // Top sectors
  const sectorCounts: Record<string, number> = {};
  companies.forEach(c => {
    if (c.category) {
      sectorCounts[c.category] = (sectorCounts[c.category] || 0) + (c.amount || 0);
    }
  });
  const topSectors = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top locations
  const locationCounts: Record<string, number> = {};
  companies.forEach(c => {
    if (c.city) {
      locationCounts[c.city] = (locationCounts[c.city] || 0) + (c.amount || 0);
    }
  });
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    totalFunding,
    totalValuation,
    avgDealSize,
    companyCount,
    topSectors,
    topLocations
  };
};
