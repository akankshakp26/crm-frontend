import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

const ClientsPage = ({ leads }) => {
  const activeClients = leads.filter(l => l.stage === 'Closed Won');

  return (
    <div className="p-4 text-left">
      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Active Clients</h1>
      {activeClients.length === 0 ? (
        <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No clients found. Close a deal in the Pipeline!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeClients.map((client) => (
            <div key={client.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl">{client.company.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{client.company}</h3>
                  <p className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1"><ShieldCheck size={12} /> Enterprise Account</p>
                </div>
              </div>
              <button className="p-3 bg-slate-50 text-slate-300 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><ExternalLink size={20} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;