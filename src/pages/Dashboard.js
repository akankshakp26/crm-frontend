// src/pages/Dashboard.js
import React from 'react';
import StatsGrid from '../components/StatsGrid'; 

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
     
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-gray-500">Welcome back, Monika. Here's what's happening today.</p>
        </header>

        <StatsGrid />

        {/* Glass Dashboard Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {[
    { label: 'Revenue Forecast', value: '$42,500', growth: '+12.5%', icon: '💰', color: 'blue' },
    { label: 'Active Leads', value: '2,842', growth: '+3.2%', icon: '🚀', color: 'indigo' },
    { label: 'Conversion Rate', value: '18.4%', growth: '+1.5%', icon: '📈', color: 'emerald' },
    { label: 'Avg. Deal Size', value: '$12,200', growth: '-0.8%', icon: '💎', color: 'purple' }
  ].map((stat, i) => (
    <div 
      key={i} 
      className="bg-white/40 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
        </div>
        <div className="text-2xl">{stat.icon}</div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 relative z-10">
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.growth.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {stat.growth}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">vs last month</span>
      </div>
    </div>
  ))}
</div>
      </main>
    </div>
  );
};

export default Dashboard;