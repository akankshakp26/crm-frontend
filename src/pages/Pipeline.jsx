import React, { useState } from 'react';
import { Plus, X, BarChart3, Target, Zap, Clock, TrendingUp } from 'lucide-react';

const Pipeline = ({ leads, setLeads }) => {
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

  const onDragEnd = () => {
    setDraggingId(null);
  };

  // FIXED: Added the missing onDragOver function
  const onDragOver = (e) => {
    e.preventDefault();
  };
  
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
    <div className="p-4 relative text-left min-h-screen">
      <style>{`
        @keyframes pulse-border {
          0% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { border-color: #60a5fa; box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .dragging-pulse { animation: pulse-border 1.5s infinite; opacity: 0.5; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER STATS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div className="flex gap-12 items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
            <p className="text-blue-600 font-black text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Total Value: ${funnelTotal.toLocaleString()}
            </p>
          </div>
          <div className="hidden xl:flex gap-10 border-l border-slate-200 pl-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Avg. Deal</p>
              <p className="text-lg font-black text-slate-900">${leads.length ? Math.round(funnelTotal/leads.length).toLocaleString() : 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Velocity</p>
              <p className="text-lg font-black text-slate-900 flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> 12 Days</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95">
          <Plus size={20} /> <span className="uppercase text-sm tracking-widest">New Deal</span>
        </button>
      </div>

      {/* TARGET PROGRESS BAR */}
      <div className="mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Zap size={14} className="text-amber-500" /> Monthly Target
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ${getStageTotal('Closed Won').toLocaleString()} <span className="text-slate-300 font-medium">/ ${targetAmount.toLocaleString()}</span>
            </p>
          </div>
          <p className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{Math.round(progressPercent)}%</p>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* KANBAN COLUMNS */}
      <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar">
        {stages.map((stage) => {
          const total = getStageTotal(stage);
          const stageLeads = leads.filter(l => l.stage === stage);
          
          return (
            <div key={stage} className="flex-shrink-0 w-80" onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage)}>
              <div className="mb-8 px-4 flex justify-between items-end">
                <div>
                  <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{stage}</h3>
                  <p className="text-blue-600 font-black text-lg mt-1">${total.toLocaleString()}</p>
                </div>
                <span className="text-[10px] font-black text-slate-300">{stageLeads.length}</span>
              </div>

              <div className="space-y-5 min-h-[500px] bg-slate-50/40 rounded-[3rem] p-3 border border-slate-100/50">
                {stageLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    draggable 
                    onDragStart={(e) => onDragStart(e, lead.id)}
                    onDragEnd={onDragEnd}
                    className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-grab hover:shadow-xl transition-all active:scale-95 group ${draggingId === lead.id ? 'dragging-pulse' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-slate-800 text-base">{lead.company}</h4>
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white uppercase">A</div>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <p className="text-lg font-black text-slate-900 tracking-tight">${(Number(lead.value) || 0).toLocaleString()}</p>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${lead.value > 10000 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                        {lead.value > 10000 ? 'High' : 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD DEAL MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleAddDeal} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-slate-300"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Create New Deal</h2>
            <div className="space-y-6">
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold" placeholder="Company" value={newDeal.company} onChange={(e) => setNewDeal({...newDeal, company: e.target.value})} />
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold" type="number" placeholder="Value" value={newDeal.value} onChange={(e) => setNewDeal({...newDeal, value: e.target.value})} />
            </div>
            <button type="submit" className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg">Create Deal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pipeline;