import type { FundingNode, FundingData } from '@/data/fundingData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface FundingStats {
  totalFunding: number;
  totalValuation: number;
  avgDealSize: number;
  companyCount: number;
  topSectors: [string, number][];
  topLocations: [string, number][];
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    signal: AbortSignal.timeout(5000),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? (payload as { error?: { message?: string } }).error?.message
        : undefined;
    throw new Error(message || `API request failed for ${path}`);
  }

  return payload as T;
}

export async function fetchFundingData(year?: number | 'all'): Promise<FundingData> {
  const suffix = year && year !== 'all' ? `?year=${year}` : '';
  const payload = await requestJson<FundingData & { meta?: { source?: string } }>(`/funding${suffix}`);
  return {
    nodes: payload.nodes,
    links: payload.links,
  };
}

export async function fetchFundingStats(year?: number | 'all'): Promise<FundingStats> {
  const suffix = year && year !== 'all' ? `?year=${year}` : '';
  return requestJson<FundingStats>(`/stats${suffix}`);
}

export async function fetchYears(): Promise<number[]> {
  const payload = await requestJson<{ years: number[] }>('/years');
  return payload.years;
}

export async function searchCompanies(query: string): Promise<FundingNode[]> {
  const payload = await requestJson<{ results: FundingNode[] }>(`/search?q=${encodeURIComponent(query)}`);
  return payload.results;
}

export async function fetchNodeDetails(id: string): Promise<{ node: FundingNode; connections: FundingNode[] }> {
  return requestJson<{ node: FundingNode; connections: FundingNode[] }>(`/node/${encodeURIComponent(id)}`);
}

export async function fetchNarrationAudio(year?: number | 'all'): Promise<Blob> {
  const suffix = year && year !== 'all' ? `?year=${year}` : '';
  const response = await fetch(`${API_URL}/narrate${suffix}`, {
    signal: AbortSignal.timeout(30000), // narration can take a few seconds
  });
  if (!response.ok) throw new Error('Failed to generate narration');
  return response.blob();
}

export async function fetchNodeNarrationAudio(nodeId: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/narrate/${encodeURIComponent(nodeId)}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Failed to generate brief for ${nodeId}`);
  return response.blob();
}

export async function checkHealth(): Promise<{ status: string; neo4j: string }> {
  try {
    return await requestJson<{ status: string; neo4j: string }>('/health');
  } catch (error) {
    return { status: 'error', neo4j: 'disconnected' };
  }
}
