import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden relative">
      {/* Mesh Gradient Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 flex flex-col bg-white/5 backdrop-blur-xl z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-fuchsia-500 rounded-lg shadow-lg shadow-indigo-500/20"></div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              LocalMark <span className="text-indigo-400 font-normal">v2.4</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sidebar}
        </div>
        <div className="p-4 border-t border-white/10 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          BUILD VERSION 0.12.5a
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden z-10">
        {children}
      </main>
    </div>
  );
}
