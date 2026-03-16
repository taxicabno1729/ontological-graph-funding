import { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import type { FundingNode, FundingData } from '@/data/fundingData';

interface FundingGraphProps {
  data: FundingData;
  onNodeClick?: (node: FundingNode) => void;
  selectedNodeId?: string | null;
}

const FundingGraph: React.FC<FundingGraphProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<FundingNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getNodeColor = (type: string, amount?: number): string => {
    if (type === 'company') {
      if (amount && amount >= 1000) return '#8b5cf6';
      if (amount && amount >= 100) return '#3b82f6';
      return '#06b6d4';
    }
    if (type === 'investor') return '#10b981';
    if (type === 'sector') return '#f59e0b';
    if (type === 'location') return '#ef4444';
    return '#6b7280';
  };

  const getNodeSize = (type: string, amount?: number): number => {
    if (type === 'company') {
      if (amount && amount >= 1000) return 20;
      if (amount && amount >= 100) return 14;
      return 8;
    }
    if (type === 'investor') return 12;
    if (type === 'sector') return 16;
    if (type === 'location') return 14;
    return 8;
  };

  useEffect(() => {
    if (!svgRef.current) return;
    if (data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1200;
    const height = 700;
    const g = svg.append('g');

    // Simple node positioning - spread nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 250;

    const positionedNodes = data.nodes.map((n, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      return {
        ...n,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Create node map
    const nodeById = new Map(positionedNodes.map(n => [n.id, n]));

    // Resolve links
    const resolvedLinks = data.links.map(l => ({
      ...l,
      source: typeof l.source === 'string' ? nodeById.get(l.source) : l.source,
      target: typeof l.target === 'string' ? nodeById.get(l.target) : l.target
    })).filter(l => l.source && l.target);

    // Draw links
    g.selectAll('line.link')
      .data(resolvedLinks)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => (d.source as any).x)
      .attr('y1', d => (d.source as any).y)
      .attr('x2', d => (d.target as any).x)
      .attr('y2', d => (d.target as any).y)
      .attr('stroke', d => d.type === 'funded_by' ? '#10b981' : d.type === 'belongs_to' ? '#f59e0b' : '#ef4444')
      .attr('stroke-width', d => d.type === 'funded_by' && d.amount ? Math.min(6, d.amount / 200) : 1.5)
      .attr('stroke-opacity', 0.5);

    // Draw nodes
    const nodeSel = g.selectAll('g.node')
      .data(positionedNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Circles
    nodeSel.append('circle')
      .attr('r', d => getNodeSize(d.type, d.amount))
      .attr('fill', d => getNodeColor(d.type, d.amount))
      .attr('stroke', 'none');

    // Labels
    nodeSel.filter(d => d.type === 'sector' || d.type === 'location' || (d.type === 'company' && (d.amount || 0) > 80))
      .append('text')
      .attr('dy', d => -getNodeSize(d.type, d.amount) - 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#e2e8f0')
      .text(d => d.name.length > 12 ? d.name.slice(0, 12) + '...' : d.name);

    // Interactions
    nodeSel
      .on('click', (e, d) => { e.stopPropagation(); onNodeClick?.(d); })
      .on('mouseenter', (e, d) => {
        setHoveredNode(d);
        setMousePos({ x: e.clientX, y: e.clientY });
      })
      .on('mousemove', (e) => setMousePos({ x: e.clientX, y: e.clientY }))
      .on('mouseleave', () => setHoveredNode(null));

    // Zoom
    svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 4]).on('zoom', e => g.attr('transform', e.transform.toString())));

  }, [data, onNodeClick]);

  const resetZoom = useCallback(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(500)
      .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  }, []);

  const fmt = (n?: number) => n ? (n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n}M`) : '';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1200 700" style={{ display: 'block' }} />
      
      <button onClick={resetZoom} style={{
        position: 'absolute', bottom: 16, right: 16,
        padding: '8px 16px', background: '#1e293b', color: 'white',
        border: '1px solid #334155', borderRadius: 8, cursor: 'pointer'
      }}>Reset View</button>

      {hoveredNode && (
        <div style={{
          position: 'fixed', left: mousePos.x + 10, top: mousePos.y - 10,
          background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
          padding: 12, zIndex: 100, pointerEvents: 'none', minWidth: 180
        }}>
          <div style={{ fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{hoveredNode.name}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            <div>{hoveredNode.type}</div>
            {hoveredNode.category && <div>{hoveredNode.category}</div>}
            {hoveredNode.amount ? <div style={{ color: '#34d399' }}>Funding: {fmt(hoveredNode.amount)}</div> : null}
            {hoveredNode.valuation ? <div>Val: {fmt(hoveredNode.valuation)}</div> : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingGraph;
