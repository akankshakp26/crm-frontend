import React from 'react';
import { ShieldCheck, TrendingUp, Building2 } from 'lucide-react';

const ClientsPage = ({ leads }) => {
  // Filter for active clients
  const activeClients = leads.filter(l => l.status === 'Qualified' || l.status === 'Confirmed');

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      
      {/* 🔹 MAIN HEADER SECTION (Total Badge on the Right) */}
      <div className="mb-12 flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Active Clients</h1>
          <p className="text-blue-600 font-bold text-xs uppercase mt-3 tracking-[0.3em] flex items-center gap-2">
             <TrendingUp size={14} /> High-Value Enterprise Accounts
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end gap-3">
          {/* Total Badge moved here */}
          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-slate-200 w-fit">
            <span className="text-blue-500 font-black text-xl">{activeClients.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-l border-slate-700 pl-2">Total</span>
          </div>

          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Portfolio Status</p>
            <p className="text-slate-900 font-black text-sm uppercase">Live & Synced</p>
          </div>
        </div>
      </div>

      {activeClients.length === 0 ? (
        <div className="p-24 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Building2 className="text-slate-200" size={32} />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            No active clients detected.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeClients.map((client) => {
            const displayId = (client.id || client._id || "000000").toString();

            return (
              <div 
                key={displayId} 
                className="group relative bg-slate-900 p-1 rounded-[2.8rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
              >
                <div className="bg-slate-900 rounded-[2.6rem] p-8 h-full flex flex-col justify-between overflow-hidden relative border border-slate-800">
                  
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />

                  {/* 🔹 CARD TOP SECTION (Fixed: Restored Client Name/Initial) */}
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full w-fit">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                         <span className="text-blue-400 text-[9px] font-black uppercase tracking-wider">Verified Account</span>
                       </div>
                       <h3 className="text-3xl font-black text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                        {client.company || client.name}
                      </h3>
                    </div>
                    
                    <div className="bg-slate-800 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl border border-white/5 shadow-inner">
                      {(client.company || client.name)?.charAt(0)}
                    </div>
                  </div>

                  {/* Bottom Metrics Block */}
                  <div className="mt-6">
                    <div className="flex justify-between items-end bg-black/30 p-6 rounded-[2rem] border border-white/5">
                      <div>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Contract Value</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-blue-500 font-bold text-sm">₹</span>
                          <span className="text-white font-black text-2xl">
                            {(client.value || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Record ID</p>
                        <p className="text-slate-400 font-mono text-[10px] font-bold">
                          #{displayId.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;