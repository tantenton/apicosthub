'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Zap, Cpu, Database, Activity, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenFlowCanvasProps {
  requestsPerMonth?: number;
  cachingPercentage?: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  type: 'input' | 'cache' | 'reasoning' | 'output';
}

export default function TokenFlowCanvas({
  requestsPerMonth = 500_000,
  cachingPercentage = 40,
}: TokenFlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeModel, setActiveModel] = useState<'deepseek-v3' | 'claude-3-5' | 'gpt-4o'>('deepseek-v3');
  const [liveTokensPerSec, setLiveTokensPerSec] = useState<number>(1420);
  const [turboMode, setTurboMode] = useState<boolean>(false);

  const stateRef = useRef({
    isPlaying: true,
    speedMultiplier: 1.0,
    turbo: false,
    particles: [] as Particle[],
  });

  stateRef.current.isPlaying = isPlaying;
  stateRef.current.turbo = turboMode;
  stateRef.current.speedMultiplier = Math.max(0.5, Math.min(3.0, (requestsPerMonth / 500_000)));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };

    window.addEventListener('resize', handleResize);

    // Node Positions
    const getNodes = () => {
      const cy = height / 2;
      return {
        client: { x: width * 0.12, y: cy, label: 'Client App', color: '#2563eb' },
        router: { x: width * 0.32, y: cy, label: 'Gateway Router', color: '#4f46e5' },
        cache: { x: width * 0.52, y: cy - 85, label: 'KV-Cache (Prefix Hit)', color: '#059669' },
        llm: { x: width * 0.52, y: cy + 75, label: 'Model Inference', color: '#7c3aed' },
        collector: { x: width * 0.72, y: cy, label: 'Token Assembly', color: '#4f46e5' },
        consumer: { x: width * 0.90, y: cy, label: 'SSE Stream Target', color: '#0284c7' },
      };
    };

    const spawnParticle = (nodes: ReturnType<typeof getNodes>): Particle => {
      const isCacheHit = Math.random() * 100 < cachingPercentage;
      const type: Particle['type'] = isCacheHit ? 'cache' : 'input';
      const color = isCacheHit ? '#059669' : '#2563eb';

      return {
        x: nodes.client.x,
        y: nodes.client.y,
        targetX: nodes.router.x,
        targetY: nodes.router.y,
        progress: 0,
        speed: (0.012 + Math.random() * 0.008) * stateRef.current.speedMultiplier * (stateRef.current.turbo ? 2.5 : 1),
        color,
        size: 3.5 + Math.random() * 2,
        type,
      };
    };

    let particles: Particle[] = [];
    let lastSpawn = performance.now();

    const render = (time: number) => {
      if (stateRef.current.isPlaying) {
        // Spawn particles
        const nodes = getNodes();
        const spawnInterval = stateRef.current.turbo ? 40 : 120 / stateRef.current.speedMultiplier;
        if (time - lastSpawn > spawnInterval && particles.length < 80) {
          particles.push(spawnParticle(nodes));
          lastSpawn = time;
        }

        // Clean Canvas with Soft Crisp Light Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Subtle background grid dots
        ctx.fillStyle = '#e2e8f0';
        for (let gx = 20; gx < width; gx += 30) {
          for (let gy = 20; gy < height; gy += 30) {
            ctx.beginPath();
            ctx.arc(gx, gy, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw connections with sleek light borders
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        const drawEdge = (x1: number, y1: number, x2: number, y2: number) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        };

        drawEdge(nodes.client.x, nodes.client.y, nodes.router.x, nodes.router.y);
        drawEdge(nodes.router.x, nodes.router.y, nodes.cache.x, nodes.cache.y);
        drawEdge(nodes.router.x, nodes.router.y, nodes.llm.x, nodes.llm.y);
        drawEdge(nodes.cache.x, nodes.cache.y, nodes.collector.x, nodes.collector.y);
        drawEdge(nodes.llm.x, nodes.llm.y, nodes.collector.x, nodes.collector.y);
        drawEdge(nodes.collector.x, nodes.collector.y, nodes.consumer.x, nodes.consumer.y);

        ctx.setLineDash([]);

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.progress += p.speed;

          if (p.progress >= 1.0) {
            // State transitions
            if (p.targetX === nodes.router.x) {
              p.x = nodes.router.x;
              p.y = nodes.router.y;
              p.progress = 0;
              if (p.type === 'cache') {
                p.targetX = nodes.cache.x;
                p.targetY = nodes.cache.y;
              } else {
                p.targetX = nodes.llm.x;
                p.targetY = nodes.llm.y;
              }
            } else if (p.targetX === nodes.cache.x || p.targetX === nodes.llm.x) {
              p.x = p.targetX;
              p.y = p.targetY;
              p.progress = 0;
              p.targetX = nodes.collector.x;
              p.targetY = nodes.collector.y;
              p.color = p.type === 'cache' ? '#059669' : '#7c3aed';
            } else if (p.targetX === nodes.collector.x) {
              p.x = nodes.collector.x;
              p.y = nodes.collector.y;
              p.progress = 0;
              p.targetX = nodes.consumer.x;
              p.targetY = nodes.consumer.y;
              p.color = '#4f46e5';
            } else {
              particles.splice(i, 1);
              continue;
            }
          }

          // Compute position along current segment
          const cx = p.x + (p.targetX - p.x) * p.progress;
          const cy = p.y + (p.targetY - p.y) * p.progress;

          // Outer luminous glow
          ctx.beginPath();
          ctx.arc(cx, cy, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '25';
          ctx.fill();

          // Particle core
          ctx.beginPath();
          ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        // Draw Nodes
        Object.entries(nodes).forEach(([key, n]) => {
          // Outer ripple
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = n.color + '15';
          ctx.fill();

          // Outer ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = n.color;
          ctx.stroke();

          // Center dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();

          // Node text label
          ctx.font = '600 11px Inter, sans-serif';
          ctx.fillStyle = '#1e293b';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + 32);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [cachingPercentage, activeModel]);

  return (
    <div className="surface-card rounded-2xl p-6 shadow-xl border border-slate-200 overflow-hidden my-6">
      {/* Simulator Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive HTML5 Live Engine
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Real-Time Token Stream & KV-Cache Routing Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics-based particle engine rendering inference request routing and prefix cache hits at 60 FPS.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setTurboMode(!turboMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              turboMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{turboMode ? 'Turbo (3x)' : '1x Speed'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[360px] bg-white rounded-xl border border-slate-200 my-4 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Live Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block">Cache Hit Rate</span>
          <span className="font-mono font-bold text-emerald-600 text-sm">
            {cachingPercentage}% Hits
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block">Simulation Pipeline</span>
          <span className="font-mono font-bold text-indigo-600 text-sm">
            Active 60 FPS
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block">Monthly Invocations</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {(requestsPerMonth / 1000).toLocaleString()}k calls
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block">Routing Latency</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            ~18ms Overhead
          </span>
        </div>
      </div>
    </div>
  );
}
