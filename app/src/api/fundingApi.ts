import type { FundingNode, FundingData } from '@/data/fundingData';
import { getCompleteFundingData, getYears as getYearsData, getFundingStats as getStatsData } from '@/data/dynamicFundingData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface FundingStats {
  totalFunding: number;
  totalValuation: number;
  avgDealSize: number;
  companyCount: number;
  topSectors: [string, number][];
  topLocations: [string, number][];
}

// Fallback data for when API is unavailable
const fallbackData = getCompleteFundingData();

export async function fetchFundingData(year?: number | 'all'): Promise<FundingData> {
  try {
    const url = year && year !== 'all' 
      ? `${API_URL}/funding?year=${year}` 
      : `${API_URL}/funding`;
    
    const response = await fetch(url, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    console.log('Using fallback data');
    // Return filtered fallback data
    if (year && year !== 'all') {
      const filtered = {
        nodes: fallbackData.nodes.filter(n => n.year === year || n.type === 'sector' || n.type === 'location' || n.type === 'investor'),
        links: fallbackData.links
      };
      return filtered;
    }
    return fallbackData;
  }
}

export async function fetchFundingStats(year?: number | 'all'): Promise<FundingStats> {
  try {
    const url = year && year !== 'all' 
      ? `${API_URL}/stats?year=${year}` 
      : `${API_URL}/stats`;
    
    const response = await fetch(url, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    console.log('Using fallback stats');
    return getStatsData(fallbackData, year || 'all');
  }
}

export async function fetchYears(): Promise<number[]> {
  try {
    const response = await fetch(`${API_URL}/years`, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    console.log('Using fallback years');
    return getYearsData(fallbackData);
  }
}

export async function searchCompanies(query: string): Promise<FundingNode[]> {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    // Search fallback data
    return fallbackData.nodes
      .filter(n => n.type === 'company' && n.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }
}

export async function fetchNodeDetails(id: string): Promise<{ node: FundingNode; connections: FundingNode[] }> {
  try {
    const response = await fetch(`${API_URL}/node/${encodeURIComponent(id)}`, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    // Get from fallback data
    const node = fallbackData.nodes.find(n => n.id === id);
    if (!node) throw new Error('Node not found');
    
    const connectedIds = new Set<string>();
    fallbackData.links.forEach(l => {
      const sourceId = typeof l.source === 'string' ? l.source : (l.source as FundingNode).id;
      const targetId = typeof l.target === 'string' ? l.target : (l.target as FundingNode).id;
      if (sourceId === id) connectedIds.add(targetId);
      if (targetId === id) connectedIds.add(sourceId);
    });
    
    const connections = fallbackData.nodes.filter(n => connectedIds.has(n.id));
    return { node, connections };
  }
}

export async function checkHealth(): Promise<{ status: string; neo4j: string }> {
  try {
    const response = await fetch(`${API_URL}/health`, { timeout: 3000 } as any);
    if (!response.ok) throw new Error('API error');
    return response.json();
  } catch (error) {
    return { status: 'ok', neo4j: 'fallback' };
  }
}
