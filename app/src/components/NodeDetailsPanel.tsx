import type { FundingNode, FundingData } from '@/data/fundingData';

interface NodeDetailsPanelProps {
  node: FundingNode | null;
  data: FundingData;
  onClose: () => void;
}

const NodeDetailsPanel = ({ node, data, onClose }: NodeDetailsPanelProps) => {
  if (!node) return null;

  const fmt = (n?: number) => n ? (n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n}M`) : '';

  // Find connected nodes
  const connected: FundingNode[] = [];
  data.links.forEach(link => {
    const s = typeof link.source === 'string' ? link.source : (link.source as FundingNode).id;
    const t = typeof link.target === 'string' ? link.target : (link.target as FundingNode).id;
    if (s === node.id || t === node.id) {
      const otherId = s === node.id ? t : s;
      const other = data.nodes.find(n => n.id === otherId);
      if (other) connected.push(other);
    }
  });

  const companies = connected.filter(n => n.type === 'company');
  const investors = connected.filter(n => n.type === 'investor');
  const sectors = connected.filter(n => n.type === 'sector');
  const locations = connected.filter(n => n.type === 'location');

  const getColor = (type: string) => {
    if (type === 'company') return '#3b82f6';
    if (type === 'investor') return '#10b981';
    if (type === 'sector') return '#f59e0b';
    if (type === 'location') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 320,
      background: 'rgba(15, 23, 42, 0.98)', borderLeft: '1px solid #334155',
      padding: 20, overflow: 'auto', zIndex: 100
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 12, right: 12,
        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20
      }}>×</button>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{node.name}</div>
        <div style={{ fontSize: 12, color: getColor(node.type), textTransform: 'capitalize' }}>{node.type}</div>
      </div>

      {node.description && (
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, padding: 12, background: 'rgba(30, 41, 59, 0.6)', borderRadius: 8 }}>
          {node.description}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        {node.category && <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>Category:</span> <span style={{ color: '#cbd5e1' }}>{node.category}</span></div>}
        {node.amount ? <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>Funding:</span> <span style={{ color: '#34d399' }}>{fmt(node.amount)}</span></div> : null}
        {node.valuation ? <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>Valuation:</span> <span style={{ color: '#60a5fa' }}>{fmt(node.valuation)}</span></div> : null}
        {node.city ? <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>Location:</span> <span style={{ color: '#cbd5e1' }}>{node.city}, {node.country}</span></div> : null}
        {node.year ? <div style={{ fontSize: 12 }}><span style={{ color: '#64748b' }}>Year:</span> <span style={{ color: '#cbd5e1' }}>{node.year}</span></div> : null}
      </div>

      {companies.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8 }}>Companies ({companies.length})</div>
          {companies.slice(0, 8).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>{c.name}</span>
              {c.amount ? <span style={{ fontSize: 11, color: '#34d399' }}>{fmt(c.amount)}</span> : null}
            </div>
          ))}
        </div>
      )}

      {investors.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8 }}>Investors ({investors.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {investors.map(i => (
              <span key={i.id} style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: 12 }}>{i.name}</span>
            ))}
          </div>
        </div>
      )}

      {sectors.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8 }}>Sectors ({sectors.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {sectors.map(s => (
              <span key={s.id} style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderRadius: 12 }}>{s.name}</span>
            ))}
          </div>
        </div>
      )}

      {locations.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8 }}>Locations ({locations.length})</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {locations.map(l => (
              <span key={l.id} style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: 12 }}>{l.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetailsPanel;
