interface StatsPanelProps {
  totalFunding: number;
  totalValuation: number;
  avgDealSize: number;
  companyCount: number;
  topSectors: [string, number][];
  topLocations: [string, number][];
  selectedYear: number | 'all';
}

const StatsPanel = ({ totalFunding, totalValuation, avgDealSize, companyCount, topSectors, topLocations, selectedYear }: StatsPanelProps) => {
  const fmt = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n.toFixed(0)}M`;
  const fmtLarge = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}T` : n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n}M`;

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginBottom: 12 }}>
        Overview {selectedYear !== 'all' && `(${selectedYear})`}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: 10, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Total Funding</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#34d399' }}>{fmtLarge(totalFunding)}</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: 10, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Valuation</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#60a5fa' }}>{fmtLarge(totalValuation)}</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: 10, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Avg Deal</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fbbf24' }}>{fmt(avgDealSize)}</div>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: 10, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Companies</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#a78bfa' }}>{companyCount}</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Top Sectors</div>
        {topSectors.map(([name, amt], i) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#475569', width: 16 }}>{i+1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#cbd5e1' }}>{name}</span>
                <span style={{ color: '#34d399' }}>{fmt(amt)}</span>
              </div>
              <div style={{ height: 3, background: '#1e293b', borderRadius: 2, marginTop: 2 }}>
                <div style={{ height: '100%', width: `${(amt / topSectors[0][1]) * 100}%`, background: '#10b981', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Top Locations</div>
        {topLocations.map(([name, amt], i) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#475569', width: 16 }}>{i+1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#cbd5e1' }}>{name}</span>
                <span style={{ color: '#60a5fa' }}>{fmt(amt)}</span>
              </div>
              <div style={{ height: 3, background: '#1e293b', borderRadius: 2, marginTop: 2 }}>
                <div style={{ height: '100%', width: `${(amt / topLocations[0][1]) * 100}%`, background: '#3b82f6', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
