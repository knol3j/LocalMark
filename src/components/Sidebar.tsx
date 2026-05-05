import React, { useState } from 'react';
import { LayoutDashboard, Megaphone, Target, BarChart3, Rocket, Cpu, Palette, Plus, TrendingUp, Users, DollarSign, Save, CheckCircle2, Columns, Zap, Activity, Eye } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useCollaboration } from './CollaborationProvider';

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

const MCP_MODULES = [
  { id: 'AdSync', label: 'AdSync', description: 'Meta/Google Deployment', color: 'indigo' },
  { id: 'EmailFlow', label: 'EmailFlow', description: 'CRM/Hubspot Automation', color: 'rose' },
  { id: 'SocialPilot', label: 'SocialPilot', description: 'Social Multi-Scheduler', color: 'emerald' },
  { id: 'InfluencerConnect', label: 'InfluencerLink', description: 'Blogger/Creator outreach', color: 'orange' },
  { id: 'SearchInsight', label: 'SearchInsight', description: 'Trend Analysis MCP', color: 'fuchsia' },
  { id: 'CopySentinel', label: 'CopyGuard', description: 'Brand Compliance Auto-check', color: 'amber' },
  { id: 'PixelRetarget', label: 'PixelTarget', description: 'Remarketing dynamic loops', color: 'cyan' },
];

export default function Sidebar({ onSelectTemplate, activeTab, onSelectTab }: SidebarProps) {
  const { campaignState, toggleModule } = useCollaboration();
  const enabledModules = campaignState.enabledModules || [];
  
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
    { id: 'campaigns', icon: Eye, label: 'Campaign Preview' },
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

      <div className="glass-panel !p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> MCP Servers
          </h3>
          <Activity className="w-3 h-3 text-indigo-400/50 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {MCP_MODULES.map((module) => {
            const isEnabled = enabledModules.includes(module.id);
            return (
              <button
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
                  isEnabled 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col items-start px-1">
                  <span className={`text-[10px] font-bold ${isEnabled ? `text-${module.color}-400` : 'text-slate-400'}`}>
                    {module.label}
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-tighter">
                    {module.description}
                  </span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                  <motion.div 
                    animate={{ x: isEnabled ? 16 : 2 }}
                    className="absolute top-1 w-2 h-2 bg-white rounded-full shadow-lg"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel !p-5 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Meta</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">ID Prefix</span>
            <span className="text-white font-mono">{campaignState.id?.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Active Modules</span>
            <span className="text-white font-mono">{enabledModules.length}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Memory Context</span>
            <span className="text-indigo-400 font-mono">{(campaignState.activePrompt?.length || 0) > 0 ? 'SYNCHRONIZED' : 'WAITING'}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel !p-5">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Deployment Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Production Auth</span>
            <span className="text-emerald-400 font-mono">ACTIVE</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Pixel Tracking</span>
            <span className={`${enabledModules.includes('PixelRetarget') ? 'text-emerald-400' : 'text-slate-600'} font-mono`}>
              {enabledModules.includes('PixelRetarget') ? 'READY' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
