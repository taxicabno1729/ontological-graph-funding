'use strict';

const Anthropic = require('@anthropic-ai/sdk');

// ── Prompt builders ─────────────────────────────────────────────────────────

function buildPrompt(node, connections) {
  if (node.type === 'company') {
    const investorNames = connections
      .filter(c => c.type === 'investor')
      .map(c => c.name)
      .join(', ') || 'undisclosed';

    const valuation = node.valuation ? `$${node.valuation}M` : 'undisclosed';
    const location = [node.city, node.country].filter(Boolean).join(', ') || 'undisclosed';
    const quarterStr = node.quarter ? ` ${node.quarter}` : '';

    return (
      `You are a VC analyst delivering a spoken briefing. Write exactly 3-4 sentences about this startup in a confident tone suitable for text-to-speech. ` +
      `Cover: what the company does, its funding amount, key investors, and one reason it is notable. No bullet points, markdown, or headers.\n\n` +
      `Company: ${node.name} | Category: ${node.category || 'technology'} | Funding: $${node.amount || 0}M (${node.year || ''}${quarterStr})\n` +
      `Valuation: ${valuation} | Location: ${location}\n` +
      `Investors: ${investorNames} | Description: ${node.description || 'not provided'}`
    );
  }

  if (node.type === 'investor') {
    const portfolio = connections
      .filter(c => c.type === 'company')
      .slice(0, 8)
      .map(c => `${c.name} ($${c.amount || 0}M)`)
      .join(', ') || 'undisclosed portfolio';

    const sectors = connections
      .filter(c => c.type === 'sector')
      .map(c => c.name)
      .join(', ') || 'various sectors';

    return (
      `You are a VC analyst. Write 3-4 spoken sentences about this investor's thesis based on their portfolio. ` +
      `Cover: focus areas, sectors, notable bets. No bullet points or markdown.\n\n` +
      `Investor: ${node.name}\n` +
      `Portfolio (${connections.filter(c => c.type === 'company').length} companies): ${portfolio}\n` +
      `Sectors: ${sectors}`
    );
  }

  if (node.type === 'sector') {
    const companies = connections.filter(c => c.type === 'company');
    const total = companies.reduce((sum, c) => sum + (c.amount || 0), 0);

    return (
      `You are a VC analyst. Write 3-4 spoken sentences about this investment sector for a funding briefing. ` +
      `Cover: what drives investor interest, number of funded companies, total capital, one notable trend. No bullet points or markdown.\n\n` +
      `Sector: ${node.name}\n` +
      `Companies tracked: ${companies.length} | Total funding: $${total}M\n` +
      `Notable companies: ${companies.slice(0, 5).map(c => c.name).join(', ') || 'none listed'}`
    );
  }

  if (node.type === 'location') {
    const companies = connections.filter(c => c.type === 'company');
    const total = companies.reduce((sum, c) => sum + (c.amount || 0), 0);

    return (
      `You are a VC analyst. Write 3-4 spoken sentences about this startup hub for a funding briefing. ` +
      `Cover: what makes it notable for venture capital, number of funded companies, total capital deployed, one emerging trend. No bullet points or markdown.\n\n` +
      `Location: ${node.name}\n` +
      `Companies tracked: ${companies.length} | Total funding: $${total}M\n` +
      `Notable companies: ${companies.slice(0, 5).map(c => c.name).join(', ') || 'none listed'}`
    );
  }

  return `Describe this funding graph node named "${node.name}" of type "${node.type}" in 3-4 spoken sentences. No bullet points or markdown.`;
}

// ── Fallback templates (no API key) ─────────────────────────────────────────

function buildFallback(node, connections) {
  if (node.type === 'company') {
    const investorNames = connections
      .filter(c => c.type === 'investor')
      .map(c => c.name)
      .join(', ') || 'undisclosed investors';

    const category = node.category || 'technology';
    const amount = node.amount ? `$${node.amount}M` : 'an undisclosed amount';
    const valuation = node.valuation ? `, reaching a valuation of $${node.valuation}M` : '';
    const location = [node.city, node.country].filter(Boolean).join(', ');
    const locationStr = location ? ` Based in ${location},` : '';

    return (
      `${node.name} is a ${category} company that has raised ${amount} in funding from ${investorNames}${valuation}.` +
      `${locationStr} the company is making waves in the ${category} space.` +
      ` With backing from established investors, ${node.name} is positioned to accelerate its growth and expand its market footprint.` +
      ` Keep an eye on this startup as it continues to execute on its vision.`
    );
  }

  if (node.type === 'investor') {
    const portfolio = connections.filter(c => c.type === 'company');
    const count = portfolio.length;
    const total = portfolio.reduce((sum, c) => sum + (c.amount || 0), 0);
    const sectors = connections.filter(c => c.type === 'sector').map(c => c.name).join(', ') || 'diverse sectors';
    const notable = portfolio.slice(0, 3).map(c => c.name).join(', ') || 'emerging startups';

    return (
      `${node.name} is an active investor with ${count} portfolio companies and a combined deployed capital of $${total}M.` +
      ` The firm focuses on ${sectors}, backing founders at various stages of growth.` +
      ` Notable bets include ${notable}, reflecting a thesis around high-conviction investments in transformative technology.` +
      ` ${node.name} continues to be a sought-after partner for ambitious founders.`
    );
  }

  if (node.type === 'sector') {
    const companies = connections.filter(c => c.type === 'company');
    const total = companies.reduce((sum, c) => sum + (c.amount || 0), 0);
    const notable = companies.slice(0, 3).map(c => c.name).join(', ') || 'several startups';

    return (
      `The ${node.name} sector is attracting significant venture capital interest, with ${companies.length} tracked companies raising a combined $${total}M.` +
      ` Investors are drawn to this space by rapid technological change and large addressable markets.` +
      ` Notable players include ${notable}, each competing to define the next wave of innovation.` +
      ` ${node.name} remains one of the most dynamic areas for early and growth-stage investment.`
    );
  }

  if (node.type === 'location') {
    const companies = connections.filter(c => c.type === 'company');
    const total = companies.reduce((sum, c) => sum + (c.amount || 0), 0);
    const notable = companies.slice(0, 3).map(c => c.name).join(', ') || 'several startups';

    return (
      `${node.name} is an emerging startup hub with ${companies.length} tracked companies that have collectively raised $${total}M.` +
      ` The region benefits from a strong talent pipeline, supportive infrastructure, and growing venture capital presence.` +
      ` Notable companies headquartered here include ${notable}.` +
      ` ${node.name} is increasingly on the radar of global investors looking beyond traditional tech corridors.`
    );
  }

  return `${node.name} is a ${node.type} node in the funding graph with ${connections.length} connections. It plays a key role in the startup funding ecosystem.`;
}

// ── Main export ──────────────────────────────────────────────────────────────

async function buildNodeScript(node, connections) {
  if (!process.env.ANTHROPIC_API_KEY) return buildFallback(node, connections);
  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: buildPrompt(node, connections) }],
    });
    return message.content[0].text.trim();
  } catch (_) {
    return buildFallback(node, connections);
  }
}

module.exports = { buildNodeScript };
