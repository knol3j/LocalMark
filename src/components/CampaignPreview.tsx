import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Share2, Smartphone, Globe, MessageSquare, 
  Eye, Zap, ListChecks, ArrowRight, Instagram, Linkedin, Video
} from 'lucide-react';
import { useCollaboration } from './CollaborationProvider';
import ReactMarkdown from 'react-markdown';

export default function CampaignPreview() {
  const { messages, campaignState } = useCollaboration();
  
  // Find the last assistant message that looks like a campaign
  const lastCampaign = [...messages].reverse().find(m => 
    m.role === 'assistant' && m.content.includes('[Campaign Strategy]')
  );

  if (!lastCampaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <div className="p-4 bg-white/5 rounded-full">
          <Sparkles className="w-8 h-8 text-indigo-400/50" />
        </div>
        <p className="text-sm font-medium">Generate a campaign strategy to see the preview.</p>
      </div>
    );
  }

  // Parse sections for a cleaner preview
  const sections = lastCampaign.content.split(/(\[.*?\]:)/g);
  const enabledModules = campaignState.enabledModules || [];
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 bg-[#0F172A]/50">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Campaign Execution Blueprint
            </h2>
            <p className="text-slate-400 mt-1">Unified view of your automated marketing strategy.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Ready for Deployment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Strategy Column */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((part, idx) => {
              if (part.startsWith('[') && part.endsWith(']:')) {
                const title = part.replace(/[\[\]:]/g, '');
                const content = sections[idx + 1];
                
                if (title.toLowerCase().includes('strategy')) {
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 space-y-6"
                    >
                      <div className="flex items-center gap-3 text-indigo-400 border-b border-white/5 pb-4">
                        <Zap className="w-5 h-5" />
                        <h3 className="text-lg font-bold tracking-tight uppercase text-white">{title}</h3>
                      </div>
                      <div className="markdown-body prose prose-invert prose-sm max-w-none text-slate-300">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  );
                }
                
                if (title.toLowerCase().includes('ad copy') || title.toLowerCase().includes('social')) {
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-fuchsia-400">
                        {title.toLowerCase().includes('copy') ? <MessageSquare className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        <h4 className="text-xs font-bold uppercase tracking-widest">{title}</h4>
                      </div>
                      <div className="prose prose-invert prose-xs text-slate-400">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  );
                }
              }
              return null;
            })}
          </div>

          {/* Right Column: Platform Visuals & Kit */}
          <div className="space-y-6">
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[28px] p-6 space-y-6">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Smartphone className="w-3 h-3" /> Creative Assets Kit
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-fuchsia-400" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-tight">Instagram Reel</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-bold">READY</span>
                  </div>
                  <div className="w-full aspect-[9/16] bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img src="https://picsum.photos/seed/reel/400/700" alt="Reel Preview" className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110" />
                    <Video className="w-8 h-8 text-white/20 absolute" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-tight">LinkedIn Post</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-bold">READY</span>
                  </div>
                  <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img src="https://picsum.photos/seed/linked/600/400" alt="LinkedIn Preview" className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110" />
                    <Share2 className="w-8 h-8 text-white/20 absolute" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ListChecks className="w-3 h-3" /> Distribution Checklist
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Platform Optimization', status: true },
                  { label: 'Pixel Tracking Setup', status: enabledModules.includes('AdSync') || enabledModules.includes('PixelRetarget') },
                  { label: 'A/B Test Routing', status: true },
                  { label: 'Compliance & Tone Check', status: enabledModules.includes('CopySentinel') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{item.label}</span>
                    {item.status ? (
                      <div className="w-4 h-4 bg-emerald-500/20 rounded flex items-center justify-center">
                        <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-amber-500/10 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
