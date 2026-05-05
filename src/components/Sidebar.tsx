import React, { useState } from 'react';
import { LayoutDashboard, Megaphone, Target, BarChart3, Rocket, Cpu, Palette, Plus, TrendingUp, Users, DollarSign, Save, CheckCircle2, Columns } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  onSelectTemplate?: (prompt: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const analyticsData = [
  { day: '01', reach: 4000, eng: 240 },
  { day: '02', reach: 3000, eng: 139 },
  { day: '03', reach: 2000, eng: 980 },
  { day: '04', reach: 2780, eng: 390 },
  { day: '05', reach: 1890, eng: 480 },
  { day: '06', reach: 2390, eng: 380 },
  { day: '07', reach: 3490, eng: 430 },
];

export default function Sidebar({ onSelectTemplate, activeTab, onSelectTab }: SidebarProps) {
  const [dateRange, setDateRange] = useState('7d');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1200);
  };

  const menuItems = [
    { id: 'engine', icon: LayoutDashboard, label: 'Control Center' },
    { id: 'campaigns', icon: Megaphone, label: 'Ad Campaigns' },
    { id: 'ab-test', icon: Columns, label: 'A/B Testing' },
    { id: 'audience', icon: Target, label: 'Audience Insight' },
    { id: 'performance', icon: BarChart3, label: 'Performance' },
  ];

  const templates = [
    { icon: Rocket, label: 'Product Launch', prompt: 'Create a comprehensive 30-day product launch strategy for a new eco-friendly consumer tech product.' },
    { icon: Cpu, label: 'SaaS Growth', prompt: 'Develop a B2B SaaS marketing funnel focusing on lead generation and reducing churn for a project management tool.' },
    { icon: Palette, label: 'Brand Refresh', prompt: 'Outline a brand identity refresh strategy for a boutique coffee roastery targeting urban professionals.' },
  ];

  return (
    <div className="flex flex-col h-full p-4 gap-6 custom-scrollbar overflow-y-auto pb-24">
      {/* Primary Action */}
      <div className="px-2">
        <button
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`w-full group relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] transition-all shadow-xl ${
            saveStatus === 'saved'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
        >
          <AnimatePresence mode="wait">
            {saveStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                Save Campaign
              </motion.div>
            )}
            {saveStatus === 'saving' && (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Plus className="w-4 h-4 text-indigo-400 rotate-45" />
                </motion.div>
                Synchronizing...
              </motion.div>
            )}
            {saveStatus === 'saved' && (
              <motion.div
                key="saved"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Checkpoint Saved
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Navigation</h3>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${
              activeTab === item.id 
                ? 'bg-white/10 text-white font-semibold border border-white/10 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-400' : ''}`} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Campaign Templates</h3>
        {templates.map((template) => (
          <button
            key={template.label}
            onClick={() => onSelectTemplate?.(template.prompt)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <template.icon className="w-4 h-4 group-hover:text-fuchsia-400" />
            {template.label}
          </button>
        ))}
      </div>

      {/* New Analytics Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Analytics</h3>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-[9px] font-mono text-indigo-400 outline-none cursor-pointer uppercase tracking-tighter"
          >
            <option value="7d">Last 7D</option>
            <option value="30d">Last 30D</option>
            <option value="90d">Last 90D</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Reach
              </span>
              <div className="text-sm font-bold text-white">1.2M <span className="text-emerald-400 text-[10px] font-normal ml-1">+5%</span></div>
            </div>
            <div className="w-24 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <Line type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Engagement
              </span>
              <div className="text-sm font-bold text-white">85.4K <span className="text-emerald-400 text-[10px] font-normal ml-1">+12%</span></div>
            </div>
            <div className="w-24 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <Line type="monotone" dataKey="eng" stroke="#d946ef" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 flex items-center gap-1 lowercase font-mono italic">
                <DollarSign className="w-3 h-3" /> avg. cpa
              </span>
              <span className="text-white font-bold">$2.40</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hyperparameters</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">TEMPERATURE</label>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-indigo-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-[9px] font-mono">
              <span className="text-indigo-400">0.75</span>
              <span className="text-slate-600 italic uppercase">Creative</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">TOP_P</label>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-fuchsia-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-[9px] font-mono">
              <span className="text-fuchsia-400">0.50</span>
              <span className="text-slate-600 italic uppercase">Focused</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hardware Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">VRAM Usage</span>
            <span className="text-white font-mono">18.2 / 24 GB</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">NPU Load</span>
            <span className="text-white font-mono text-emerald-400">42%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
