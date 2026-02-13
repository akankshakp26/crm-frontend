import React, { useState } from 'react';
import { Plus, X, TrendingUp, Zap } from 'lucide-react';

const Pipeline = ({ leads, setLeads, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDeal, setNewDeal] = useState({ company: '', value: '' });
  const [draggingId, setDraggingId] = useState(null);
  const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

  // --- CALCULATION LOGIC ---
  const getStageTotal = (stageName) => {
    return leads
      .filter(l => l.stage === stageName)
      .reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
  };

  const funnelTotal = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const targetAmount = 100000; 
  const progressPercent = Math.min((getStageTotal('Closed Won') / targetAmount) * 100, 100);

  // --- DRAG AND DROP LOGIC ---
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
    setDraggingId(id);
  };

  const onDragOver = (e) => e.preventDefault();
  
  const onDrop = (e, targetStage) => {
    const id = e.dataTransfer.getData("id");
    setLeads(leads.map(l => l.id.toString() === id ? { ...l, stage: targetStage } : l));
    setDraggingId(null);
  };

  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newDeal.company || !newDeal.value) return;
    const entry = { 
      id: Date.now(), 
      company: newDeal.company, 
      value: parseInt(newDeal.value), 
      stage: 'Discovery', 
      status: 'New' 
    };
    setLeads([...leads, entry]);
    setShowForm(false);
    setNewDeal({ company: '', value: '' });
  };

  return (
    <div className="p-4 text-left min-h-screen">
      <style>{`
        .dragging-pulse { animation: pulse 1.5s infinite; opacity: 0.5; }
        @keyframes pulse { 
          0% { box-shadow: 0 0 0 0 #2563eb; } 
          70% { box-shadow: 0 0 0 10px transparent; } 
          100% { box-shadow: 0 0 0 0 transparent; } 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="font-black text-xs mt-2 uppercase tracking-widest flex items-center gap-2 text-blue-600">
            <TrendingUp size={14} /> Total Value: ${funnelTotal.toLocaleString()}
          </p>
        </div>
        
        {/* MATCHED: Using bg-slate-900 to match LeadsPage */}
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} /> NEW DEAL
        </button>
      </div>

      {/* THE PROGRESS BAR */}
      <div className="mb-14 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Zap size={14} className="text-amber-500" /> Monthly Target Revenue
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${getStageTotal('Closed Won').toLocaleString()} <span className="text-slate-200 font-medium">/ ${targetAmount.toLocaleString()}</span>
            </p>
          </div>
          <p className="text-sm font-black px-3 py-1 rounded-lg bg-blue-50 text-blue-600">
            {Math.round(progressPercent)}% Achieved
          </p>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex gap-10 overflow-x-auto pb-10 no-scrollbar">
        {stages.map((stage) => {
          const total = getStageTotal(stage);
          return (
            <div key={stage} className="flex-shrink-0 w-80" onDragOver={onDragOver} onDrop={e => onDrop(e, stage)}>
              <div className="mb-10 px-4 text-left">
                <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">{stage}</h3>
                <p className="font-black text-xl mt-2 text-blue-600">${total.toLocaleString()}</p>
              </div>

              <div className="space-y-6 min-h-[600px] bg-slate-50/30 rounded-[3.5rem] p-3 border border-slate-100/50">
                {leads.filter(l => l.stage === stage).map((lead) => (
                  <div 
                    key={lead.id} 
                    draggable 
                    onDragStart={e => onDragStart(e, lead.id)} 
                    onDragEnd={() => setDraggingId(null)} 
                    className={`bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-grab hover:shadow-xl transition-all active:scale-95 group ${draggingId === lead.id ? 'dragging-pulse' : ''}`}
                  >
                    <h4 className="font-bold text-slate-800 text-base mb-6 text-left">{lead.company}</h4>
                    <div className="flex justify-between items-end">
                      <p className="text-xl font-black text-slate-900">${(Number(lead.value) || 0).toLocaleString()}</p>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md flex-shrink-0 bg-blue-600">
                        {user?.initial || 'A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleAddDeal} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight text-left">Create New Deal</h2>
            <div className="space-y-6">
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" placeholder="Company" value={newDeal.company} onChange={(e) => setNewDeal({...newDeal, company: e.target.value})} />
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" type="number" placeholder="Value" value={newDeal.value} onChange={(e) => setNewDeal({...newDeal, value: e.target.value})} />
            </div>
            {/* MATCHED: Primary Action Button in Slate-900 */}
            <button type="submit" className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">Create Deal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pipeline;