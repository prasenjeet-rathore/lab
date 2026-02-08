import React, { useEffect, useRef, useState } from 'react';
import { GraphData, Node, Link } from '../types';
import * as d3 from 'd3';

interface NetworkGraphProps {
  data: GraphData;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (wrapperRef.current) {
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;

    // Simulation setup
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 1.5));

    // Arrow marker
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // pushed back a bit
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#cbd5e1")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5)
      .attr("marker-end", "url(#arrow)");

    // Draw nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => d.val)
      .attr("fill", d => d.risk > 0.8 ? "#FF6200" : (d.risk > 0.5 ? "#F59E0B" : "#64748B"))
      .attr("cursor", "pointer")
      // Drag behavior
      .call(drag(simulation) as any);

    // Labels
    const label = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text(d => d.label)
      .attr("fill", "#334155")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("pointer-events", "none")
      .style("text-shadow", "0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff");

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden relative" ref={wrapperRef}>
       <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-bold text-ing-slate uppercase tracking-wider flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Relationship Network
        </h3>
      </div>
      <div className="flex-1 bg-slate-50 relative">
        <svg ref={svgRef} width="100%" height="100%" className="w-full h-full block" />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 text-xs shadow-sm">
          <div className="flex items-center space-x-3">
             <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-ing-orange mr-1"></span> High Risk</div>
             <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> Med Risk</div>
             <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-1"></span> Low Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;