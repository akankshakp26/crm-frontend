import React, { useState, useEffect } from 'react';
import { DollarSign, X, CheckCircle } from 'lucide-react';

const PipelinePage = () => {
  const [leads, setLeads] = useState([
    { id: 1, company: 'Alpha Corp', value: 5000, time: '2d ago', stage: 'Discovery' },
    { id: 2, company: 'Vertex Media', value: 3000, time: '1d ago', stage: 'Discovery' },
    { id: 3, company: 'Skyline Ltd', value: 7000, time: '5h ago', stage: 'Proposal' },
    { id: 4, company: 'Global Solutions', value: 12000, time: 'Just now', stage: 'Negotiation' },
    { id: 5, company: 'Beta Tech', value: 8000, time: '3d ago', stage: 'Negotiation' },
    { id: 6, company: 'Omega Inc', value: 20000, time: '1w ago', stage: 'Closed Won' }
  ]);

  const [notification, setNotification] = useState(null);
  const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const onDragStart = (e, id) => e.dataTransfer.setData("id", id);
  const onDragOver = (e) => e.preventDefault();
  
  const onDrop = (e, targetStage) => {
    const id = e.dataTransfer.getData("id");
    const lead = leads.find(l => l.id.toString() === id);

    // Show professional notification instead of confetti
    if (targetStage === 'Closed Won' && lead.stage !== 'Closed Won') {
      setNotification(`Deal Secured: ${lead.company} moved to Closed Won!`);
    }

    setLeads(leads.map(l => l.id.toString() === id ? { ...l, stage: targetStage } : l));
  };

  const getStageTotal = (stage) => {
    return leads.filter(l => l.stage === stage)
      .reduce((sum, current) => sum + current.value, 0).toLocaleString();
  };

  return (
    <div className="relative min-h-screen p-4">
      {/* TOAST NOTIFICATION - Professional Corporate Style */}
      {notification && (
        <div className="fixed top-10 right-10 z-[100] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 border-l-4 border-l-blue-500">
          <CheckCircle className="text-blue-400" size={20} />
          <p className="font-bold text-sm">{notification}</p>
          <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {stages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-72 bg-slate-50/50 p-4 rounded-[2.5rem]" onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage)}>
            <div className="mb-6 px-1">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{stage}</h3>
              <div className="flex items-center text-blue-600 gap-0.5 font-black text-sm">
                <DollarSign size={12} strokeWidth={3} /> {getStageTotal(stage)}
              </div>
            </div>

            <div className="space-y-3 min-h-[250px]">
              {leads.filter(l => l.stage === stage).map((lead) => (
                <div key={lead.id} draggable onDragStart={(e) => onDragStart(e, lead.id)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-grab border-l-4 border-l-blue-600">
                  <h4 className="font-bold text-slate-800 text-sm">{lead.company}</h4>
                  <p className="text-sm font-black text-slate-900 mt-2">${lead.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelinePage;