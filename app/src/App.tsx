import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, Filter, BarChart3, Network, Info, X, RefreshCw, Volume2, Square } from 'lucide-react';
import FundingGraph from '@/components/FundingGraph';
import StatsPanel from '@/components/StatsPanel';
import NodeDetailsPanel from '@/components/NodeDetailsPanel';
import Legend from '@/components/Legend';
import { fetchFundingData, fetchFundingStats, fetchYears, checkHealth, fetchNarrationAudio } from '@/api/fundingApi';
import type { FundingNode, FundingData } from '@/data/fundingData';

const TECH_BADGES = [
  { label: 'Neo4j', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { label: 'Firecrawl', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  { label: 'ElevenLabs', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { label: 'D3.js', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
];

function fmtMoney(n?: number) {
  if (!n) return '';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}B` : `$${n}M`;
}

function App() {
  const [data, setData] = useState<FundingData>({ nodes: [], links: [] });
  const [stats, setStats] = useState({
    totalFunding: 0,
    totalValuation: 0,
    avgDealSize: 0,
    companyCount: 0,
    topSectors: [] as [string, number][],
    topLocations: [] as [string, number][]
  });
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<FundingNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'company' | 'investor' | 'sector' | 'location'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [narrateState, setNarrateState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [narratingNodeId, setNarratingNodeId] = useState<string | null>(null);

  const handleNodeNarratingChange = useCallback((nodeId: string | null) => {
    // Mutual exclusion: stop global audio if node narration starts
    if (nodeId !== null && narrateState === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setNarrateState('idle');
    }
    setNarratingNodeId(nodeId);
  }, [narrateState]);

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fundingData, statsData, yearsData] = await Promise.all([
          fetchFundingData(selectedYear),
          fetchFundingStats(selectedYear),
          fetchYears()
        ]);
        setData(fundingData);
        setStats(statsData);
        setYears(yearsData);
        setApiStatus('connected');
        setLastRefreshed(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setApiStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  // Ticker items — funded companies sorted by amount descending
  const tickerItems = useMemo(() => {
    const companies = data.nodes
      .filter(n => n.type === 'company' && n.amount)
      .sort((a, b) => (b.amount || 0) - (a.amount || 0));
    if (companies.length === 0) return [];
    const items = companies.map(n => `${n.name}  ${fmtMoney(n.amount)}`);
    // Duplicate for seamless loop
    return [...items, ...items];
  }, [data.nodes]);

  const filteredData = useMemo(() => {
    let filtered = { ...data };

    if (filterType !== 'all') {
      filtered = {
        nodes: filtered.nodes.filter(n => n.type === filterType || n.type === 'sector' || n.type === 'location'),
        links: filtered.links
      };
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchingNodes = new Set(
        filtered.nodes
          .filter(n =>
            n.name.toLowerCase().includes(query) ||
            n.category?.toLowerCase().includes(query) ||
            n.city?.toLowerCase().includes(query)
          )
          .map(n => n.id)
      );

      filtered.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source as FundingNode).id;
        const targetId = typeof link.target === 'string' ? link.target : (link.target as FundingNode).id;
        if (matchingNodes.has(sourceId)) matchingNodes.add(targetId);
        if (matchingNodes.has(targetId)) matchingNodes.add(sourceId);
      });

      filtered = {
        nodes: filtered.nodes.filter(n => matchingNodes.has(n.id)),
        links: filtered.links.filter(l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as FundingNode).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as FundingNode).id;
          return matchingNodes.has(sourceId) && matchingNodes.has(targetId);
        })
      };
    }

    return filtered;
  }, [data, filterType, searchQuery]);

  const handleNodeClick = useCallback((node: FundingNode) => {
    setSelectedNode(node);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedYear('all');
    setFilterType('all');
    setSearchQuery('');
  }, []);

  const [searchSuggestions, setSearchSuggestions] = useState<FundingNode[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchSuggestions([]); return; }
    const companies = data.nodes
      .filter(n => n.type === 'company' && n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    setSearchSuggestions(companies);
  }, [searchQuery, data.nodes]);

  const handleNarrate = async () => {
    if (narrateState === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setNarrateState('idle');
      return;
    }
    // Stop node narration if active
    if (narratingNodeId !== null) {
      setSelectedNode(null);
    }
    setNarrateState('loading');
    try {
      const blob = await fetchNarrationAudio(selectedYear);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setNarrateState('idle'); URL.revokeObjectURL(url); };
      audio.onerror = () => { setNarrateState('idle'); URL.revokeObjectURL(url); };
      await audio.play();
      setNarrateState('playing');
    } catch {
      setNarrateState('idle');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [fundingData, statsData] = await Promise.all([
        fetchFundingData(selectedYear),
        fetchFundingStats(selectedYear)
      ]);
      setData(fundingData);
      setStats(statsData);
      setApiStatus('connected');
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  // Narrate button style helpers
  const narrateBg =
    narrateState === 'playing' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' :
    narrateState === 'loading' ? 'linear-gradient(135deg, #4c1d95, #1d4ed8)' :
    'linear-gradient(135deg, #6d28d9, #2563eb)';

  const narrateAnimation =
    narrateState === 'playing' ? 'pulse-glow-active 1.2s ease-in-out infinite' :
    narrateState === 'idle'    ? 'pulse-glow 2.5s ease-in-out infinite' :
    'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020617', color: 'white' }}>
      {/* ── Header ── */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Left: logo + title + status + tech badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, background: 'linear-gradient(135deg, #3b82f6, #9333ea)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network style={{ width: 19, height: 19, color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>Startup Funding Graph</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: apiStatus === 'connected' ? '#34d399' : '#ef4444' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: apiStatus === 'connected' ? '#34d399' : '#ef4444', flexShrink: 0 }} />
                  {data.nodes.length} nodes
                </span>
                {TECH_BADGES.map(b => (
                  <span key={b.label} style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4, color: b.color, background: b.bg, border: `1px solid ${b.color}30` }}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center: hero NARRATE button */}
          <button
            onClick={handleNarrate}
            disabled={narrateState === 'loading'}
            title={narrateState === 'playing' ? 'Stop narration' : 'Generate AI funding briefing'}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px',
              background: narrateBg,
              border: 'none',
              borderRadius: 10,
              cursor: narrateState === 'loading' ? 'wait' : 'pointer',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.02em',
              animation: narrateAnimation,
              transition: 'opacity 0.2s',
              opacity: narrateState === 'loading' ? 0.75 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {narrateState === 'playing'
              ? <Square style={{ width: 15, height: 15 }} />
              : <Volume2 style={{ width: 15, height: 15, animation: narrateState === 'loading' ? 'spin 1s linear infinite' : 'none' }} />
            }
            {narrateState === 'idle'    && 'AI Briefing'}
            {narrateState === 'loading' && 'Generating…'}
            {narrateState === 'playing' && 'Stop'}
          </button>

          {/* Right: controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={refreshData}
              disabled={loading}
              title="Refresh data"
              style={{ padding: 7, background: '#1e293b', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              <RefreshCw style={{ width: 15, height: 15, color: '#64748b', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: 160, padding: '7px 26px 7px 30px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: 13 }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 13, height: 13, color: '#64748b' }} />
                </button>
              )}
              {searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, zIndex: 50 }}>
                  {searchSuggestions.map(s => (
                    <button key={s.id} onClick={() => { setSearchQuery(s.name); setSelectedNode(s); }} style={{ width: '100%', padding: '7px 12px', textAlign: 'left', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: 12 }}>
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))} style={{ padding: '7px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: 13 }}>
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)} style={{ padding: '7px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: 13 }}>
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="investor">Investors</option>
              <option value="sector">Sectors</option>
              <option value="location">Locations</option>
            </select>

            <button onClick={() => setShowStats(!showStats)} style={{ padding: 7, background: showStats ? 'rgba(59,130,246,0.2)' : '#1e293b', border: 'none', borderRadius: 8, color: showStats ? '#60a5fa' : '#64748b' }}>
              <BarChart3 style={{ width: 17, height: 17 }} />
            </button>
            <button onClick={() => setShowLegend(!showLegend)} style={{ padding: 7, background: showLegend ? 'rgba(59,130,246,0.2)' : '#1e293b', border: 'none', borderRadius: 8, color: showLegend ? '#60a5fa' : '#64748b' }}>
              <Info style={{ width: 17, height: 17 }} />
            </button>

            {(selectedYear !== 'all' || filterType !== 'all' || searchQuery) && (
              <button onClick={clearFilters} style={{ padding: '7px 10px', background: '#1e293b', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Filter style={{ width: 13, height: 13 }} /> Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Ticker bar ── */}
      {tickerItems.length > 0 && (
        <div style={{ background: '#080f1e', borderBottom: '1px solid #1e293b', height: 28, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#3b82f6', padding: '0 10px', borderRight: '1px solid #1e293b', letterSpacing: '0.05em' }}>LIVE</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: `ticker-scroll ${tickerItems.length * 2.5}s linear infinite` }}>
              {tickerItems.map((item, i) => (
                <span key={i} style={{ fontSize: 11, color: '#64748b', padding: '0 20px' }}>
                  <span style={{ color: '#cbd5e1' }}>{item.split('  ')[0]}</span>
                  {item.split('  ')[1] && <span style={{ color: '#34d399', marginLeft: 4 }}>{item.split('  ')[1]}</span>}
                  <span style={{ margin: '0 6px', color: '#334155' }}>•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ textAlign: 'center' }}>
              <RefreshCw style={{ width: 32, height: 32, color: '#3b82f6', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#94a3b8' }}>Loading from Neo4j…</p>
            </div>
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ textAlign: 'center', padding: 24, background: '#1e293b', borderRadius: 12, maxWidth: 400 }}>
              <p style={{ color: '#ef4444', marginBottom: 12 }}>{error}</p>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>Make sure the Neo4j backend is running on port 3001</p>
              <button onClick={refreshData} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}>Retry</button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          {filteredData.nodes.length > 0 ? (
            <FundingGraph data={filteredData} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} narratingNodeId={narratingNodeId} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f172a', color: '#64748b', fontSize: 18 }}>
              {loading ? 'Loading…' : 'No data to display'}
            </div>
          )}

          {showStats && filteredData.nodes.length > 0 && !loading && (
            <div style={{ position: 'absolute', top: 16, left: 16, width: 280, maxHeight: 'calc(100% - 32px)', overflow: 'auto' }}>
              <StatsPanel {...stats} selectedYear={selectedYear} />
            </div>
          )}

          {showLegend && (
            <div style={{ position: 'absolute', top: 16, right: 16, width: 180 }}>
              <Legend />
            </div>
          )}
        </div>

        {selectedNode && <NodeDetailsPanel node={selectedNode} data={data} onClose={() => setSelectedNode(null)} onNarratingChange={handleNodeNarratingChange} />}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '7px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
          <span>Powered by Neo4j · Scraped with Firecrawl · Narrated by ElevenLabs</span>
          <span>
            {lastRefreshed
              ? `Updated ${lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'March 2026'}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
