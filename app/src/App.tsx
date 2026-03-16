import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, BarChart3, Network, Info, X, RefreshCw } from 'lucide-react';
import FundingGraph from '@/components/FundingGraph';
import StatsPanel from '@/components/StatsPanel';
import NodeDetailsPanel from '@/components/NodeDetailsPanel';
import Legend from '@/components/Legend';
import { fetchFundingData, fetchFundingStats, fetchYears, checkHealth } from '@/api/fundingApi';
import type { FundingNode, FundingData } from '@/data/fundingData';

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

  // Check API health on mount
  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  // Fetch data when year changes
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setApiStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  // Filter data based on search and type
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

  // Search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<FundingNode[]>([]);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    
    const companies = data.nodes
      .filter(n => n.type === 'company' && n.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    setSearchSuggestions(companies);
  }, [searchQuery, data.nodes]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020617', color: 'white' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #9333ea)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Startup Funding Graph</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <span>Data: {data.nodes.length} nodes, {data.links.length} links</span>
                <span>|</span>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  color: apiStatus === 'connected' ? '#34d399' : '#ef4444'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: apiStatus === 'connected' ? '#34d399' : '#ef4444'
                  }} />
                  Neo4j {apiStatus}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Refresh button */}
            <button 
              onClick={refreshData}
              disabled={loading}
              style={{ 
                padding: '8px', 
                background: '#1e293b', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px', color: '#64748b', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '180px', padding: '8px 28px 8px 32px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: '16px', height: '16px', color: '#64748b' }} />
                </button>
              )}
              {searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', zIndex: 50 }}>
                  {searchSuggestions.map(s => (
                    <button key={s.id} onClick={() => { setSearchQuery(s.name); setSelectedNode(s); }} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '13px' }}>
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))} style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)} style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="investor">Investors</option>
              <option value="sector">Sectors</option>
              <option value="location">Locations</option>
            </select>

            <button onClick={() => setShowStats(!showStats)} style={{ padding: '8px', background: showStats ? 'rgba(59, 130, 246, 0.2)' : '#1e293b', border: 'none', borderRadius: '8px', color: showStats ? '#60a5fa' : '#64748b' }}>
              <BarChart3 style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={() => setShowLegend(!showLegend)} style={{ padding: '8px', background: showLegend ? 'rgba(59, 130, 246, 0.2)' : '#1e293b', border: 'none', borderRadius: '8px', color: showLegend ? '#60a5fa' : '#64748b' }}>
              <Info style={{ width: '18px', height: '18px' }} />
            </button>

            {(selectedYear !== 'all' || filterType !== 'all' || searchQuery) && (
              <button onClick={clearFilters} style={{ padding: '8px 12px', background: '#1e293b', border: 'none', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter style={{ width: '14px', height: '14px' }} />
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {/* Loading overlay */}
        {loading && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'rgba(2, 6, 23, 0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{ textAlign: 'center' }}>
              <RefreshCw style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#94a3b8' }}>Loading from Neo4j...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'rgba(2, 6, 23, 0.9)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{ textAlign: 'center', padding: '24px', background: '#1e293b', borderRadius: '12px', maxWidth: '400px' }}>
              <p style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</p>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
                Make sure the Neo4j backend is running on port 3001
              </p>
              <button 
                onClick={refreshData}
                style={{ 
                  padding: '8px 16px', 
                  background: '#3b82f6', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          {filteredData.nodes.length > 0 ? (
            <FundingGraph data={filteredData} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f172a', color: '#64748b', fontSize: '18px' }}>
              {loading ? 'Loading...' : 'No data to display'}
            </div>
          )}

          {showStats && filteredData.nodes.length > 0 && !loading && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '280px', maxHeight: 'calc(100% - 32px)', overflow: 'auto' }}>
              <StatsPanel {...stats} selectedYear={selectedYear} />
            </div>
          )}

          {showLegend && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '180px' }}>
              <Legend />
            </div>
          )}
        </div>

        {selectedNode && <NodeDetailsPanel node={selectedNode} data={data} onClose={() => setSelectedNode(null)} />}
      </main>

      <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '8px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
          <span>Powered by Neo4j Graph Database</span>
          <span>Updated: March 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
