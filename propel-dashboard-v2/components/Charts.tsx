
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { TimeRange } from '../types';

// --- Mock Data Generators ---

const generateActivityData = (range: TimeRange) => {
  // Simulating different granularities based on range
  switch (range) {
    case '1D':
      return Array.from({ length: 8 }, (_, i) => ({
        name: `${9 + i}:00`,
        calls: Math.floor(Math.random() * 10),
        chats: Math.floor(Math.random() * 15),
      }));
    case '7D':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        name: day,
        calls: Math.floor(Math.random() * 25) + 5,
        chats: Math.floor(Math.random() * 40) + 10,
      }));
    case '1M':
      return Array.from({ length: 15 }, (_, i) => ({
        name: `Day ${i * 2 + 1}`,
        calls: Math.floor(Math.random() * 30) + 10,
        chats: Math.floor(Math.random() * 50) + 20,
      }));
    case '3M':
      return Array.from({ length: 12 }, (_, i) => ({
        name: `W${i + 1}`,
        calls: Math.floor(Math.random() * 100) + 50,
        chats: Math.floor(Math.random() * 200) + 80,
      }));
    case '6M':
    case '1Y':
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        .slice(0, range === '6M' ? 6 : 12)
        .map(month => ({
          name: month,
          calls: Math.floor(Math.random() * 400) + 100,
          chats: Math.floor(Math.random() * 800) + 200,
        }));
    default:
      return [];
  }
};

const generatePerformanceData = (range: TimeRange) => {
  // Simulating value (€) of qualified leads
  const baseValue = 500000; 
  
  const getData = (labels: string[]) => labels.map(label => ({
    name: label,
    value: Math.floor(Math.random() * baseValue) + 100000,
  }));

  switch (range) {
    case '1D':
      return getData(['09:00', '12:00', '15:00', '18:00']);
    case '7D':
      return getData(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    case '1M':
      return getData(['Week 1', 'Week 2', 'Week 3', 'Week 4']);
    case '3M':
      return getData(['Month 1', 'Month 2', 'Month 3']);
    case '6M':
      return getData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
    case '1Y':
      return getData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    default:
      return [];
  }
};

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload, label, isCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-2 shadow-sm text-foreground">
        <p className="text-xs font-medium text-muted mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {isCurrency ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Call Analytics Specifics ---

const generateCallAnalyticsData = () => [
  { time: '9 am', calls: 24, minUse: 2500, avgTime: 1800 },
  { time: '10 am', calls: 18, minUse: 1800, avgTime: 1200 },
  { time: '11 am', calls: 35, minUse: 3200, avgTime: 2100 },
  { time: '12 pm', calls: 42, minUse: 3800, avgTime: 2400 },
  { time: '1 pm', calls: 28, minUse: 2900, avgTime: 1600 },
  { time: '2 pm', calls: 55, minUse: 4500, avgTime: 2800 },
  { time: '3 pm', calls: 48, minUse: 4100, avgTime: 2600 },
  { time: '4 pm', calls: 30, minUse: 3000, avgTime: 1900 },
];

const CustomCallTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-white dark:bg-zinc-900 p-4 shadow-xl text-foreground min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-3">
           {/* Header / Title if needed */}
           
           <div className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-muted">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span> Total Calls
              </span>
              <span className="text-sm font-bold">{data.calls} calls</span>
           </div>
           
           <div className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-muted">
                 <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span> Min use
              </span>
              <span className="text-sm font-bold">{new Intl.NumberFormat().format(data.minUse)} min</span>
           </div>
           
           <div className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-muted">
                 <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> Avg. call time
              </span>
              <span className="text-sm font-bold">{new Intl.NumberFormat().format(data.avgTime)} min</span>
           </div>
           
           {/* Visual "Call Analysis" Badge from screenshot */}
           <div className="mt-1 self-end">
               <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/30">
                   Call Analysis
               </div>
           </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Chart Components ---

export const ActivityChart = ({ range }: { range: TimeRange }) => {
  const data = useMemo(() => generateActivityData(range), [range]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inbound Activity (Calls vs Chats)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="var(--muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="calls" 
                name="Calls"
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1' }} 
              />
              <Line 
                type="monotone" 
                dataKey="chats" 
                name="Chats"
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PerformanceChart = ({ range }: { range: TimeRange }) => {
  const data = useMemo(() => generatePerformanceData(range), [range]);
  
  const totalValue = useMemo(() => 
    data.reduce((acc, curr) => acc + curr.value, 0)
  , [data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted text-sm font-medium uppercase tracking-wider">Qualified Pipeline Value</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div className="mb-4">
            <span className="text-3xl font-bold text-foreground tracking-tight">
                {formatCurrency(totalValue)}
            </span>
            <span className="text-sm text-muted ml-2 font-medium">
                 generated in {range}
            </span>
        </div>
        <div className="flex-1 w-full min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                  hide
              />
              <Tooltip content={<CustomTooltip isCurrency />} cursor={{ fill: 'var(--foreground)', opacity: 0.1 }} />
              <Bar 
                dataKey="value" 
                name="Value"
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const CallAnalyticsChart = () => {
    const data = generateCallAnalyticsData();

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0 shadow-sm border border-purple-200 dark:border-purple-800">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Total Calls</CardTitle>
                            <p className="text-sm text-muted font-medium">Analytics Dashboard</p>
                            <p className="text-sm text-muted mt-2 max-w-lg hidden md:block leading-relaxed">
                                Track performance, conversion rates, and conversation insights to optimize strategies,
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                         <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-surface transition-colors shadow-sm">
                            Total Calls
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6"/></svg>
                         </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col h-[350px] w-full p-6 pt-2">
                    <div className="mb-4">
                        <p className="text-sm text-muted font-medium mb-1">Total Call Analysis</p>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">5,425</h2>
                    </div>
                    
                    <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMinUse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="var(--muted)" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="var(--muted)" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `${value / 1000} k min`}
                                />
                                <Tooltip content={<CustomCallTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="minUse" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorMinUse)" 
                                    activeDot={{ r: 6, strokeWidth: 4, stroke: 'white', fill: '#8b5cf6' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
