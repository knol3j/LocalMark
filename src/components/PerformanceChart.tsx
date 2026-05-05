import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', ctr: 2.1, conv: 1.2 },
  { name: 'Tue', ctr: 2.8, conv: 1.5 },
  { name: 'Wed', ctr: 2.5, conv: 1.4 },
  { name: 'Thu', ctr: 3.2, conv: 1.8 },
  { name: 'Fri', ctr: 4.1, conv: 2.2 },
  { name: 'Sat', ctr: 3.8, conv: 2.0 },
  { name: 'Sun', ctr: 4.5, conv: 2.5 },
];

export function CTRChart() {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Area 
            type="monotone" 
            dataKey="ctr" 
            stroke="#818cf8" 
            fillOpacity={1} 
            fill="url(#colorCtr)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionChart() {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
            itemStyle={{ color: '#d946ef' }}
          />
          <Bar dataKey="conv" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#d946ef' : '#d946ef44'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
