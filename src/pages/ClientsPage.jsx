import React from 'react';
import { ShieldCheck, ExternalLink, TrendingUp, Building2 } from 'lucide-react';

const ClientsPage = ({ leads }) => {
  // FIXED: Changed filter to match the 'Qualified' (Confirmed) status from your Pipeline
  const activeClients = leads.filter(l => l.status === 'Qualified' || l.status === 'Confirmed');

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      {/* Heading Section */}
      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Active Clients</h1>
        <p className="text-blue-600 font-bold text-xs uppercase mt-3 tracking-[0.3em] flex items-center gap-2">
           <TrendingUp size={14} /> High-Value Enterprise Accounts
        </p>
      </div>

      {activeClients.length === 0 ? (
        <div className="p-24 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Building2 className="text-slate-200" size={32} />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            No active clients detected. <br/> Close a deal in the Pipeline to populate this list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeClients.map((client) => (
            <div 
              key={client.id} 
              className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col justify-between group hover:bg-black transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle Blue Glow Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all" />

              <div className="flex items-start justify-between mb-8">
                <div className="bg-blue-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-blue-600/20">
                  {client.company?.charAt(0)}
                </div>
                <button className="p-4 bg-slate-800 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                  <ExternalLink size={20} />
                </button>
              </div>

              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={12} /> Verified Client
                </p>
                <h3 className="font-black text-2xl text-white mb-4 tracking-tight">
                  {client.company}
                </h3>
                
                <div className="flex items-end justify-between border-t border-slate-800 pt-6 mt-4">
                  <div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Contract Value</p>
                    <p className="text-white font-black text-xl">₹{(client.value || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">ID</p>
                    <p className="text-slate-400 font-bold text-[10px]">#{client.id?.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;