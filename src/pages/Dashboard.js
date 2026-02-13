import React from 'react';
import InteractionLogs from '../components/InteractionLogs';
import RecentActivity from '../components/RecentActivity';

const Dashboard = ({ leads }) => {
  const totalRevenue = leads.reduce((sum, l) => sum + (l.stage === 'Closed Won' ? (l.value || 0) : 0), 0);
  const activeLeads = leads.filter(l => l.stage !== 'Closed Won').length;

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight text-left">Performance Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Revenue Forecast</p>
          <h3 className="text-5xl font-black text-slate-900 mt-2">${totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-left">Active Pipeline Leads</p>
          <h3 className="text-5xl font-black mt-2 text-left">{activeLeads}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm min-h-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Interaction Logs</h2>
          <InteractionLogs />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;