const { AppError } = require('./errors');

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseYearParam(value) {
  if (value === undefined || value === null || value === '' || value === 'all') {
    return null;
  }

  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 2100) {
    throw new AppError(400, 'Query parameter "year" must be "all" or a valid year.', 'INVALID_YEAR');
  }

  return parsed;
}

function normalizeInvestor(investor) {
  if (typeof investor === 'string') {
    const name = investor.trim();
    if (!name) {
      return null;
    }

    return {
      id: slugify(name),
      name,
      category: 'Investor',
    };
  }

  if (investor && typeof investor === 'object') {
    const name = String(investor.name || '').trim();
    if (!name) {
      return null;
    }

    return {
      id: slugify(investor.id || name),
      name,
      category: investor.category ? String(investor.category).trim() : 'Investor',
    };
  }

  return null;
}

function validateCompanyPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new AppError(400, 'Request body must be a JSON object.', 'INVALID_BODY');
  }

  const name = String(payload.name || '').trim();
  if (!name) {
    throw new AppError(400, 'Field "name" is required.', 'INVALID_COMPANY');
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError(400, 'Field "amount" must be a positive number.', 'INVALID_COMPANY');
  }

  const year = Number.parseInt(String(payload.year), 10);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new AppError(400, 'Field "year" must be a valid year.', 'INVALID_COMPANY');
  }

  const valuation =
    payload.valuation === undefined || payload.valuation === null || payload.valuation === ''
      ? null
      : Number(payload.valuation);
  if (valuation !== null && (!Number.isFinite(valuation) || valuation < 0)) {
    throw new AppError(400, 'Field "valuation" must be a non-negative number when provided.', 'INVALID_COMPANY');
  }

  const quarter =
    payload.quarter === undefined || payload.quarter === null || payload.quarter === ''
      ? null
      : String(payload.quarter).trim().toUpperCase();
  if (quarter && !['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
    throw new AppError(400, 'Field "quarter" must be one of Q1, Q2, Q3, or Q4.', 'INVALID_COMPANY');
  }

  const city = payload.city ? String(payload.city).trim() : null;
  const country = payload.country ? String(payload.country).trim() : null;
  const category = payload.category ? String(payload.category).trim() : null;
  const description = payload.description ? String(payload.description).trim() : null;
  const round = payload.round ? String(payload.round).trim() : null;
  const sourceUrl = payload.source_url
    ? String(payload.source_url).trim()
    : payload.sourceUrl
      ? String(payload.sourceUrl).trim()
      : null;

  const investors = Array.isArray(payload.investors)
    ? payload.investors.map(normalizeInvestor).filter(Boolean)
    : [];
  const dedupedInvestors = Object.values(
    investors.reduce((acc, investor) => {
      acc[investor.id] = investor;
      return acc;
    }, {})
  );

  return {
    id: slugify(payload.id || name),
    name,
    category,
    amount,
    valuation,
    year,
    quarter,
    city,
    country,
    description,
    round,
    sourceUrl,
    investors: dedupedInvestors,
    sector: category
      ? {
          id: slugify(category),
          name: category,
          category: category,
        }
      : null,
    location: city
      ? {
          id: slugify(country ? `${city}-${country}` : city),
          name: city,
          country,
        }
      : null,
  };
}

module.exports = {
  parseYearParam,
  slugify,
  validateCompanyPayload,
};
