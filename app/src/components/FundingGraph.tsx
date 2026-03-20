import { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import type { FundingNode, FundingData } from '@/data/fundingData';

interface FundingGraphProps {
  data: FundingData;
  onNodeClick?: (node: FundingNode) => void;
  selectedNodeId?: string | null;
}

type SimNode = FundingNode & { x?: number; y?: number; vx?: number; vy?: number; fx?: number | null; fy?: number | null };
type SimLink = { source: string | SimNode; target: string | SimNode; type?: string; amount?: number };

const FundingGraph: React.FC<FundingGraphProps> = ({ data, onNodeClick, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
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
    if (!svgRef.current || data.nodes.length === 0) return;

    simRef.current?.stop();

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1200;
    const height = 700;

    // Glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'node-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Clone nodes so D3 can mutate them
    const nodes: SimNode[] = data.nodes.map(n => ({ ...n }));

    const links: SimLink[] = data.links.map(l => ({
      ...l,
      source: typeof l.source === 'string' ? l.source : (l.source as FundingNode).id,
      target: typeof l.target === 'string' ? l.target : (l.target as FundingNode).id,
    }));

    // Force simulation
    const simulation = d3.forceSimulation<SimNode, SimLink>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id(d => d.id).distance(90).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimNode>(d => getNodeSize(d.type, d.amount) + 6));

    simRef.current = simulation;

    // Links
    const linkSel = g.selectAll<SVGLineElement, SimLink>('line.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => (d.type === 'funded_by' ? '#10b981' : d.type === 'belongs_to' ? '#f59e0b' : '#ef4444'))
      .attr('stroke-width', d => (d.type === 'funded_by' && d.amount ? Math.min(5, d.amount / 200 + 1) : 1.5))
      .attr('stroke-opacity', 0.35);

    // Node groups
    const nodeSel = g.selectAll<SVGGElement, SimNode>('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Circles
    nodeSel.append('circle')
      .attr('r', d => getNodeSize(d.type, d.amount))
      .attr('fill', d => getNodeColor(d.type, d.amount))
      .attr('stroke', d => d.id === selectedNodeId ? 'white' : 'transparent')
      .attr('stroke-width', 2)
      .style('filter', d => (d.type === 'company' && (d.amount || 0) >= 100) ? 'url(#node-glow)' : 'none')
      .style('opacity', 0)
      .transition()
      .delay((_, i) => i * 8)
      .duration(400)
      .style('opacity', 1);

    // Labels
    nodeSel.filter(d => d.type === 'sector' || d.type === 'location' || (d.type === 'company' && (d.amount || 0) > 80))
      .append('text')
      .attr('dy', d => -getNodeSize(d.type, d.amount) - 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#e2e8f0')
      .attr('pointer-events', 'none')
      .text(d => d.name.length > 14 ? d.name.slice(0, 14) + '…' : d.name);

    // Drag behaviour
    const drag = d3.drag<SVGGElement, SimNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeSel.call(drag);

    // Interactions
    nodeSel
      .on('click', (e, d) => { e.stopPropagation(); onNodeClick?.(d); })
      .on('mouseenter', (e, d) => { setHoveredNode(d); setMousePos({ x: e.clientX, y: e.clientY }); })
      .on('mousemove', e => setMousePos({ x: e.clientX, y: e.clientY }))
      .on('mouseleave', () => setHoveredNode(null));

    // Tick
    simulation.on('tick', () => {
      linkSel
        .attr('x1', d => (d.source as SimNode).x ?? 0)
        .attr('y1', d => (d.source as SimNode).y ?? 0)
        .attr('x2', d => (d.target as SimNode).x ?? 0)
        .attr('y2', d => (d.target as SimNode).y ?? 0);

      nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', e => g.attr('transform', e.transform.toString()));
    svg.call(zoom);

    return () => { simulation.stop(); };
  }, [data, onNodeClick, selectedNodeId]);

  const resetZoom = useCallback(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(500)
      .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  }, []);

  const fmt = (n?: number) => n ? (n >= 1000 ? `$${(n / 1000).toFixed(1)}B` : `$${n}M`) : '';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a' }}>
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1200 700" style={{ display: 'block' }} />

      <button onClick={resetZoom} style={{
        position: 'absolute', bottom: 16, right: 16,
        padding: '7px 14px', background: '#1e293b', color: '#94a3b8',
        border: '1px solid #334155', borderRadius: 8, cursor: 'pointer', fontSize: '12px'
      }}>Reset View</button>

      {hoveredNode && (
        <div style={{
          position: 'fixed', left: mousePos.x + 14, top: mousePos.y - 10,
          background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
          padding: 12, zIndex: 100, pointerEvents: 'none', minWidth: 180,
          animation: 'fade-in-up 0.15s ease',
        }}>
          <div style={{ fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{hoveredNode.name}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            <div style={{ textTransform: 'capitalize', marginBottom: 2 }}>{hoveredNode.type}</div>
            {hoveredNode.category && <div>{hoveredNode.category}</div>}
            {hoveredNode.amount ? <div style={{ color: '#34d399', marginTop: 2 }}>Funding: {fmt(hoveredNode.amount)}</div> : null}
            {hoveredNode.valuation ? <div style={{ color: '#a78bfa' }}>Val: {fmt(hoveredNode.valuation)}</div> : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingGraph;
