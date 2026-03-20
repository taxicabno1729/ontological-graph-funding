'use strict';

const { ElevenLabsClient } = require('elevenlabs');

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel
const MODEL_ID = 'eleven_multilingual_v2';

/**
 * Build a narration script from funding stats and recent companies.
 */
function buildScript(stats, nodes) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const total = stats.totalFunding || 0;
  const companyCount = stats.companyCount || 0;
  const topSectors = (stats.topSectors || []).slice(0, 3).map(s => s.name).filter(Boolean);
  const topLocations = (stats.topLocations || []).slice(0, 3).map(l => l.name).filter(Boolean);

  const companies = (nodes || [])
    .filter(n => n.type === 'company')
    .slice(0, 5);

  const recentLines = companies.map(c => {
    const amount = c.amount || 0;
    const amountStr = amount >= 1000
      ? `$${(amount / 1000).toFixed(1)} billion`
      : `$${Math.round(amount)} million`;
    const round = c.round ? `a ${c.round} of ` : '';
    return `${c.name}, a ${c.category || 'technology'} company, raised ${round}${amountStr}.`;
  });

  const totalStr = total >= 1000
    ? `$${(total / 1000).toFixed(1)} billion`
    : `$${Math.round(total)} million`;

  const lines = [
    `Welcome to the Startup Funding Daily Briefing for ${today}.`,
    '',
    `Our graph currently tracks ${companyCount} companies with a combined funding total of ${totalStr}.`,
  ];

  if (topSectors.length) {
    lines.push(`The top sectors attracting investment are ${topSectors.join(', ')}.`);
  }
  if (topLocations.length) {
    lines.push(`Leading startup hubs include ${topLocations.join(', ')}.`);
  }

  lines.push('', 'Here are the latest funding rounds:', '');
  lines.push(...(recentLines.length ? recentLines : ["No recent rounds to report."]));
  lines.push('', "That's your funding briefing. Stay tuned for more updates.");

  return lines.join('\n');
}

/**
 * Convert a script to MP3 audio using ElevenLabs and return a Buffer.
 */
async function textToSpeech(script) {
  const client = new ElevenLabsClient();

  const audioStream = await client.textToSpeech.convert(VOICE_ID, {
    text: script,
    model_id: MODEL_ID,
    output_format: 'mp3_44100_128',
  });

  const chunks = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = { buildScript, textToSpeech };
