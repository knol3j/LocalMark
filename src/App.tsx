/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import { Sparkles, Zap, Shield, Globe, BarChart3, Download, Share2, LogIn, User as UserIcon, FileJson, FileText, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { CTRChart, ConversionChart } from './components/PerformanceChart';
import Onboarding from './components/Onboarding';
import ABTestingPanel from './components/ABTestingPanel';
import CampaignPreview from './components/CampaignPreview';
import AudienceInsight from './components/AudienceInsight';
import Performance from './components/Performance';
import { CollaborationProvider, useCollaboration } from './components/CollaborationProvider';
import { signInWithGoogle } from './lib/firebase';
import { jsPDF } from 'jspdf';

function AppContent() {
  const { user, loading: authLoading, campaignState, updateCampaignState, sendMessage, messages } = useCollaboration();
  const activePrompt = campaignState.activePrompt;
  const activeTab = campaignState.activeTab || 'engine';
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('marketflow_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('marketflow_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  const handleTemplateSelect = (prompt: string) => {
    updateCampaignState({ activePrompt: prompt });
  };

  const setActiveTab = (tab: string) => {
    updateCampaignState({ activeTab: tab });
  };

  const handleExport = (format: 'txt' | 'json' | 'pdf') => {
    const fileName = `marketflow-campaign-export.${format}`;
    setExportMenuOpen(false);

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(24);
      doc.text("MARKETFLOW", 20, 30);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("Campaign Architecture Report", 20, 45);
      
      doc.setDrawColor(255, 255, 255, 0.1);
      doc.line(20, 55, 190, 55);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 65);
      doc.text(`User: ${user?.displayName || 'Anonymous'}`, 20, 72);
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Campaign Context & Vision", 20, 90);
      
      doc.setFontSize(10);
      doc.setTextColor(203, 213, 225);
      const splitText = doc.splitTextToSize(activePrompt || "No prompt active", 170);
      doc.text(splitText, 20, 100);

      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Latest Collaboration Thread", 20, 160);
      
      let y = 170;
      messages.slice(-5).forEach((msg: any) => {
        doc.setFontSize(8);
        doc.setTextColor(99, 102, 241);
        doc.text(msg.role.toUpperCase(), 20, y);
        doc.setTextColor(148, 163, 184);
        const msgLines = doc.splitTextToSize(msg.content.substring(0, 200), 170);
        doc.text(msgLines, 20, y + 5);
        y += 25;
      });
      
      doc.save(fileName);
      return;
    }

    let content = "";
    let type = "";

    if (format === 'txt') {
      content = "MarketFlow Campaign Export\n" + 
                "==========================\n\n" + 
                "Context: " + (activePrompt || "None") + "\n\n" +
                "Date: " + new Date().toLocaleString();
      type = 'text/plain';
    } else if (format === 'json') {
      content = JSON.stringify({
        version: "2.4.0",
        exportDate: new Date().toISOString(),
        user: { name: user?.displayName, id: user?.uid },
        campaign: {
          prompt: activePrompt,
          tab: activeTab
        },
        recentMessages: messages.slice(-20)
      }, null, 2);
      type = 'application/json';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center">
        <Zap className="w-12 h-12 text-indigo-500 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Collaborative Intelligence</h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            MarketFlow is a collaborative multimodal engine. Sign in to start co-creating enterprise-scale campaigns in real-time.
          </p>
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full py-4 bg-white text-[#020617] font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl hover:scale-[1.02]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
              <Shield className="w-3 h-3" /> Encrypted
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
              <Globe className="w-3 h-3" /> Low Latency
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout sidebar={<Sidebar onSelectTemplate={handleTemplateSelect} activeTab={activeTab} onSelectTab={setActiveTab} />}>
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        {/* Main Workspace Group */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Bar for Engine Status */}
          <div className="h-16 flex items-center justify-between px-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Local Engine: {activeTab === 'ab-test' ? 'Optimization Mode' : 'Ready'}</span>
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest hidden md:block">
                Active Build: <span className="text-white">Vision-Ad-Gen-v2.4</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-indigo-500/50">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-full h-full p-1 text-slate-400" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest max-w-[80px] truncate">
                  {user.displayName?.split(' ')[0]}
                </span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              </div>

              <div className="w-px h-6 bg-white/10"></div>

              <div className="relative" ref={exportRef}>
                <button 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative"
                  title="Export Campaign"
                >
                  <Download className="w-4 h-4" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1e293b] text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Export Options</span>
                </button>

                <AnimatePresence>
                  {exportMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-2 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                          Select Format
                        </div>
                        <button 
                          onClick={() => handleExport('txt')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                        >
                          <FileText className="w-4 h-4 text-blue-400 group-hover/item:scale-110 transition-transform" />
                          <div className="text-left">
                            <div className="font-bold">Text Document</div>
                            <div className="text-[10px] text-slate-500">Simple context dump</div>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleExport('json')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                        >
                          <FileJson className="w-4 h-4 text-fuchsia-400 group-hover/item:scale-110 transition-transform" />
                          <div className="text-left">
                            <div className="font-bold">JSON Schema</div>
                            <div className="text-[10px] text-slate-500">Full campaign data</div>
                          </div>
                        </button>
                        <button 
                          onClick={() => handleExport('pdf')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                        >
                          <FileCode className="w-4 h-4 text-emerald-400 group-hover/item:scale-110 transition-transform" />
                          <div className="text-left">
                            <div className="font-bold">PDF Master Report</div>
                            <div className="text-[10px] text-slate-500">Executive summary</div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative">
                <Share2 className="w-4 h-4" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1e293b] text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Share Link</span>
              </button>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all">
                {activeTab === 'ab-test' ? 'RE-RUN TEST' : 'RECOMPILE BUILD'}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'engine' ? (
                <motion.div 
                  key="engine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex flex-col gap-0"
                >
                  <div className="flex-1 min-h-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl relative flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden min-h-0">
                      <CampaignPreview />
                    </div>

                    <div className="h-[35%] min-h-[180px] md:min-h-[320px] bg-[#020617]/40 border-t border-white/10 backdrop-blur-3xl relative z-10">
                      <ChatPanel externalPrompt={activePrompt} />
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === 'campaigns' ? (
                <motion.div 
                  key="campaigns"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10"
                >
                  <CampaignPreview />
                </motion.div>
              ) : activeTab === 'ab-test' ? (
                <motion.div 
                  key="ab-test"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <ABTestingPanel 
                    onNavigatePerformance={() => setActiveTab('performance')} 
                    onNavigateEngine={(context) => {
                      updateCampaignState({ activePrompt: context, activeTab: 'engine' });
                    }}
                  />
                </motion.div>
              ) : activeTab === 'audience' ? (
                <motion.div 
                  key="audience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <AudienceInsight />
                </motion.div>
              ) : activeTab === 'performance' ? (
                <motion.div 
                  key="performance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <Performance />
                </motion.div>
              ) : (
                <motion.div 
                  key="fallback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10 backdrop-blur-sm">
                      <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeTab} node initializing...</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar: Build Output / Performance */}
        <aside className="w-64 lg:w-80 hidden md:flex flex-col gap-4 overflow-hidden shrink-0">
          <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-indigo-400" />
              Live Performance
            </h3>
            
            <div className="flex-1 font-mono text-[10px] space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">CTR Trends</span>
                  <span className="text-indigo-400 font-bold">+12.4%</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-2 h-44 overflow-hidden flex items-center justify-center">
                  <CTRChart />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Daily Conversions</span>
                  <span className="text-fuchsia-400 font-bold">+8.2%</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-2 h-44 overflow-hidden flex items-center justify-center">
                  <ConversionChart />
                </div>
              </div>
              
              <div className="mt-6 border border-white/10 bg-white/5 p-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                  <span className="text-fuchsia-300 font-bold uppercase tracking-tight">Engine Insight</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Performance is peaking during weekend cycles. Suggesting increased budget allocation for Friday-Sunday slots.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="h-24 bg-indigo-950/20 border border-white/5 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">LATENCY</span>
              <span className="text-white">42ms</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">INFERENCE SPEED</span>
              <span className="text-indigo-400">48 t/s</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                className="h-full bg-indigo-500" 
              />
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <CollaborationProvider>
      <AppContent />
    </CollaborationProvider>
  );
}
