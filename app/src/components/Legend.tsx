const Legend = () => {
  const items = [
    { label: 'Large Deal ($1B+)', color: '#8b5cf6' },
    { label: 'Medium Deal ($100M+)', color: '#3b82f6' },
    { label: 'Small Deal (<$100M)', color: '#06b6d4' },
    { label: 'Investor / VC', color: '#10b981' },
    { label: 'Sector', color: '#f59e0b' },
    { label: 'Location', color: '#ef4444' },
  ];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
      <h3 style={{ fontSize: 12, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Legend</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
          <span style={{ fontSize: 11, color: '#cbd5e1' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
