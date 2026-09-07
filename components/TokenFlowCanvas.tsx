'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Zap, Cpu, Database, Activity } from 'lucide-react';

interface TokenFlowCanvasProps {
  requestsPerMonth?: number;
  cachingPercentage?: number;
  className?: string;
}

export default function TokenFlowCanvas({
  requestsPerMonth = 500_000,
  cachingPercentage = 50,
  className = '',
}: TokenFlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [activeModel, setActiveModel] = useState<string>('DeepSeek V3');
  const [liveTokensPerSec, setLiveTokensPerSec] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };

    window.addEventListener('resize', handleResize);

    // Dynamic speeds derived from request volume slider
    const speedMultiplier = Math.max(0.6, Math.min(3.0, requestsPerMonth / 300_000));
    setLiveTokensPerSec(Math.round((requestsPerMonth * 2500) / (30 * 24 * 3600)));

    // Define Topology Nodes
    const getNodes = () => [
      { id: 'client', x: width * 0.12, y: height * 0.5, label: 'Client API Request', color: '#707eff', icon: 'zap' },
      { id: 'gateway', x: width * 0.35, y: height * 0.35, label: 'Routing Gateway', color: '#38bdf8', icon: 'cpu' },
      { id: 'cache', x: width * 0.35, y: height * 0.72, label: `KV-Cache (${cachingPercentage}%)`, color: '#10b981', icon: 'db' },
      { id: 'model', x: width * 0.65, y: height * 0.5, label: activeModel, color: '#a855f7', icon: 'model' },
      { id: 'output', x: width * 0.88, y: height * 0.5, label: 'Stream Completion', color: '#818cf8', icon: 'stream' },
    ];

    interface Particle {
      x: number;
      y: number;
      progress: number;
      speed: number;
      pathType: 'cache' | 'direct' | 'out';
      color: string;
      size: number;
    }

    const particles: Particle[] = [];
    const maxParticles = Math.min(65, Math.floor(25 + (requestsPerMonth / 1_000_000) * 40));

    for (let i = 0; i < maxParticles; i++) {
      const isCached = Math.random() * 100 < cachingPercentage;
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: (0.003 + Math.random() * 0.004) * speedMultiplier,
        pathType: isCached ? 'cache' : 'direct',
        color: isCached ? '#10b981' : '#707eff',
        size: 2 + Math.random() * 2.5,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#08090a';
      ctx.fillRect(0, 0, width, height);

      const nodes = getNodes();

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Network Paths
      const drawCurvedLine = (n1: { x: number; y: number }, n2: { x: number; y: number }, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        const midX = (n1.x + n2.x) / 2;
        ctx.bezierCurveTo(midX, n1.y, midX, n2.y, n2.x, n2.y);
        ctx.stroke();
      };

      // Background path connections
      drawCurvedLine(nodes[0], nodes[1], 'rgba(56, 189, 248, 0.25)'); // Client to Gateway
      drawCurvedLine(nodes[0], nodes[2], 'rgba(16, 185, 129, 0.25)'); // Client to Cache
      drawCurvedLine(nodes[1], nodes[3], 'rgba(168, 85, 247, 0.25)'); // Gateway to Model
      drawCurvedLine(nodes[2], nodes[3], 'rgba(16, 185, 129, 0.25)'); // Cache to Model
      drawCurvedLine(nodes[3], nodes[4], 'rgba(129, 140, 248, 0.35)'); // Model to Output

      // Update & Draw Particles
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          const isCached = Math.random() * 100 < cachingPercentage;
          p.pathType = isCached ? 'cache' : 'direct';
          p.color = isCached ? '#34d399' : '#818cf8';
        }

        let startNode, targetNode;
        if (p.progress < 0.5) {
          startNode = nodes[0];
          targetNode = p.pathType === 'cache' ? nodes[2] : nodes[1];
          const localT = p.progress * 2;
          const midX = (startNode.x + targetNode.x) / 2;
          p.x = Math.pow(1 - localT, 2) * startNode.x + 2 * (1 - localT) * localT * midX + Math.pow(localT, 2) * targetNode.x;
          p.y = Math.pow(1 - localT, 2) * startNode.y + 2 * (1 - localT) * localT * targetNode.y + Math.pow(localT, 2) * targetNode.y;
        } else {
          startNode = p.pathType === 'cache' ? nodes[2] : nodes[1];
          targetNode = nodes[3];
          const localT = (p.progress - 0.5) * 2;
          const midX = (startNode.x + targetNode.x) / 2;
          p.x = Math.pow(1 - localT, 2) * startNode.x + 2 * (1 - localT) * localT * midX + Math.pow(localT, 2) * targetNode.x;
          p.y = Math.pow(1 - localT, 2) * startNode.y + 2 * (1 - localT) * localT * startNode.y + Math.pow(localT, 2) * targetNode.y;
        }

        // Draw particle with luminous glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Completion Output Stream
      for (let i = 0; i < 8; i++) {
        const streamProgress = ((frame * 0.02 + i / 8) % 1);
        const sx = nodes[3].x + streamProgress * (nodes[4].x - nodes[3].x);
        const sy = nodes[3].y + Math.sin(frame * 0.05 + i) * 8;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a5b4fc';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      nodes.forEach((node, idx) => {
        const pulse = Math.sin(frame * 0.04 + idx) * 3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 22 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}15`;
        ctx.fill();

        // Node circle container
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#111318';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node center pip
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Label
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 32);
      });

      if (isRunning) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRunning, requestsPerMonth, cachingPercentage, activeModel]);

  return (
    <div className={`surface-card rounded-2xl p-5 border border-white/10 relative overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <span>Interactive HTML5 Canvas Simulator</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Real-Time Inference & KV-Cache Token Flow Pipeline
            </h3>
          </div>
        </div>

        {/* Controls & Model Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            {['DeepSeek V3', 'Claude 3.5', 'GPT-4o'].map((m) => (
              <button
                key={m}
                onClick={() => setActiveModel(m)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeModel === m
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={isRunning ? 'Pause Animation' : 'Resume Animation'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Canvas Element */}
      <div className="relative w-full rounded-xl overflow-hidden bg-[#08090a] border border-white/5 shadow-inner">
        <canvas ref={canvasRef} className="w-full block h-[320px] sm:h-[360px]" />
        
        {/* Live HUD overlay */}
        <div className="absolute top-3 left-3 bg-[#0d0f14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold">{liveTokensPerSec.toLocaleString()}</span>
            <span className="text-slate-500">tok/s throughput</span>
          </div>
          <div className="text-slate-400 border-l border-white/10 pl-3">
            Cache hit: <span className="text-emerald-400 font-bold">{cachingPercentage}%</span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-[#0d0f14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400">
          HTML5 60FPS Reactive Particle Mesh
        </div>
      </div>
    </div>
  );
}
