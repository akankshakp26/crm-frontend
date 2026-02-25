import React from 'react';
import RecentActivity from '../components/RecentActivity';

const Dashboard = ({ leads }) => {
  const totalRevenue = leads.filter(l => l.status === 'Confirmed').reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Performance Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-transform">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Active Leads</p>
          <h3 className="text-5xl font-black mt-2">{leads.filter(l => l.status !== 'Lost').length}</h3>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-transform">
          <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest">Total Revenue</p>
          <h3 className="text-5xl font-black mt-2">₹{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Market Status</p>
          <h3 className="text-5xl font-black text-slate-900 mt-2">Stable</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
          <h2 className="text-2xl font-black mb-6 text-blue-400">Pipeline Health</h2>
          <div className="space-y-6">
            {['New', 'Contacted', 'Negotiation'].map(status => (
              <div key={status}>
                <div className="flex justify-between mb-2 font-bold uppercase text-[10px] tracking-widest">
                  <span>{status}</span>
                  <span>{leads.filter(l => l.status === status).length} Companies</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(leads.filter(l => l.status === status).length / leads.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;