import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Columns, ArrowRight, Zap, Target, MousePointer2, TrendingUp, 
  Palette, BarChart3, Rocket, Users, Smartphone, Globe, Clock, Activity,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { dataService, Variation } from '../services/dataService';
import { useCollaboration } from './CollaborationProvider';

interface ABTestingPanelProps {
  onNavigatePerformance: () => void;
  onNavigateEngine: (context: string) => void;
}

export default function ABTestingPanel({ onNavigatePerformance, onNavigateEngine }: ABTestingPanelProps) {
  const { campaignState } = useCollaboration();
  const [activeMetric, setActiveMetric] = useState<'ctr' | 'conv'>('ctr');
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);

  useEffect(() => {
    if (!campaignState.id) return;

    const unsubscribe = dataService.subscribeToVariations(campaignState.id, (data) => {
      setVariations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [campaignState.id]);

  useEffect(() => {
    if (variations.length === 0) return;
    const interval = setInterval(() => {
      setLiveUpdateCount(c => c + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [variations.length]);

  const chartData = variations.map(v => ({
    name: v.id.toUpperCase(),
    value: v[activeMetric],
    color: v.status === 'winner' ? '#d946ef' : '#6366f1'
  }));

  return (
    <div className="flex flex-col h-full glass-panel p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <Columns className="w-6 h-6 text-indigo-400" />
            Ad Variation Lab
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-400 text-sm">Comparing {variations.length} multimodal variations for campaign optimization.</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveMetric('ctr')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeMetric === 'ctr' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            CTR %
          </button>
          <button 
            onClick={() => setActiveMetric('conv')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeMetric === 'conv' ? 'bg-fuchsia-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            CONV %
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Zap className="w-12 h-12 text-indigo-500 animate-pulse" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syncing variations database...</div>
        </div>
      ) : variations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Rocket className="w-12 h-12 text-slate-600" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">No variations detected. Trigger a strategy build in the Engine.</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {variations.map((v, i) => (
          <motion.div 
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card overflow-hidden group relative transition-all hover:scale-[1.02] flex flex-col !p-0 ${
              v.status === 'winner' ? 'border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/10' : 'border-white/10 shadow-lg'
            }`}
          >
            {v.status === 'winner' && (
              <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                <div className="bg-fuchsia-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg pulse">
                  <Zap className="w-3 h-3 fill-current" /> WINNER
                </div>
                <button 
                  onClick={onNavigatePerformance}
                  className="bg-[#0F172A]/80 backdrop-blur-md border border-fuchsia-500/30 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-fuchsia-500 transition-all shadow-xl"
                  title="View analytics for this variation"
                >
                  <BarChart3 className="w-3 h-3" /> DEEP DIVE
                </button>
              </div>
            )}
            <div className="relative h-32 overflow-hidden shrink-0">
              <img src={v.image} alt={v.label} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-4 flex gap-1.5">
                <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
                  <Smartphone className="w-2.5 h-2.5 text-indigo-400" />
                  <span className="text-[8px] text-white font-bold uppercase tracking-tight">{v.platform.split('/')[0]}</span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4 flex-grow flex flex-col">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.label}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Users className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-[8px] text-slate-500 uppercase font-medium">{v.audience}</span>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 italic text-[11px] text-slate-300 leading-relaxed min-h-[60px]">
                "{v.copy}"
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center relative overflow-hidden group/metric">
                  <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">CTR</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    {v.ctr}%
                    {v.trend === 'up' && <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />}
                    {v.trend === 'down' && <Activity className="w-2.5 h-2.5 text-rose-400 rotate-180" />}
                  </div>
                  <motion.div 
                    key={`${v.id}-ctr-${liveUpdateCount}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-indigo-500/5 pointer-events-none"
                  />
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center relative overflow-hidden group/metric">
                  <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">CONV</div>
                  <div className="text-sm font-bold text-white">{v.conv}%</div>
                  <motion.div 
                    key={`${v.id}-conv-${liveUpdateCount}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-fuchsia-500/5 pointer-events-none"
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 space-y-2">
                <div className="flex items-center justify-between text-[8px] uppercase tracking-widest font-bold border-b border-white/5 pb-2">
                  <span className="text-slate-500">Targeting Efficiency</span>
                  <span className="text-emerald-400">{(v.ctr * v.conv * 10).toFixed(1)}/100</span>
                </div>
                
                <button 
                  onClick={() => onNavigateEngine(`Refine and expand on ${v.label}: ${v.copy}`)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                >
                  <Rocket className="w-3 h-3 text-indigo-400 group-hover/btn:scale-110 transition-transform" /> 
                  Refine Strategy
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Predictive Head-to-Head
          </h3>
          <button 
            onClick={onNavigatePerformance}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
          >
            Explore Performance Dashboard
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} width={60} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[24px] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Engine Recommendation</h4>
                <p className="text-[10px] text-emerald-400/80 font-mono">Neural Optimization Model v4.1</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Analysis of <span className="text-white font-bold">Variation B (Premium)</span> reveals a significant resonance with high-intent audience clusters. While its CTR is slightly lower than Variation A, its <span className="text-emerald-400 font-bold">conversion efficiency is 33% higher</span>, leading to a projected <span className="text-white font-bold">18% reduction in overall CPA</span>.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Primary Factor</div>
                  <div className="text-[11px] text-white flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-400" /> Behavioral Intent Match
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Visual Strength</div>
                  <div className="text-[11px] text-white flex items-center gap-1">
                    <Palette className="w-3 h-3 text-fuchsia-400" /> Color Contrast Ratio (9.2:1)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-[24px] flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Confidence Score</div>
              <div className="text-3xl font-bold text-white font-mono">94.2%</div>
            </div>
            
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94.2%' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight italic">
                Derived from 12k simulated interaction tokens across 4 demographic seeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>
);
}
