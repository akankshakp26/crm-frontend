import React from "react";
import toast from 'react-hot-toast';
import axiosInstance from "../api/axiosInstance";

const Pipeline = ({ leads, setLeads, refresh }) => {
  // 🔹 COLOR CONFIG (Dots only)
  const columnConfig = {
    "New": { title: "Leads Created", dot: "bg-blue-500" },
    "Contacted": { title: "Contacted", dot: "bg-purple-500" },
    "Negotiation": { title: "Negotiation", dot: "bg-orange-500" },
    "Confirmed": { title: "Deal Confirmed", dot: "bg-emerald-500" },
    "Lost": { title: "Deal Lost", dot: "bg-rose-500" }
  };

  const columns = Object.keys(columnConfig).map(key => ({
    id: key,
    ...columnConfig[key]
  }));

  const onDrop = async (e, newStatus) => {
    const leadId = e.dataTransfer.getData("leadId");
    const lead = leads.find(l => (l.id || l._id) === leadId);

    if (!lead || lead.status === newStatus) return;

    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      refresh();

      if (newStatus === "Confirmed") {
        toast.success(`${lead.company} deal confirmed!`, {
          style: { background: '#0f172a', color: '#fff', borderRadius: '1rem' }
        });
      }
    } catch (err) { 
      console.error("Pipeline update failed:", err); 
    }
  };

  return (
    <div className="p-8 h-full bg-white text-left">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
        <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-[0.4em]">Visual Deal Flow</p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar">
        {columns.map(col => (
          <div 
            key={col.id} 
            onDragOver={e => e.preventDefault()} 
            onDrop={e => onDrop(e, col.id)} 
            className="min-w-[320px] flex-shrink-0 flex flex-col"
          >
            {/* COLUMN HEADER */}
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {col.title}
              </h3>
              <span className="ml-auto bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black text-[10px]">
                {leads.filter(l => l.status === col.id).length}
              </span>
            </div>
            
            {/* CLEAN COLUMN BODY */}
            <div className="rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-4 flex-grow min-h-[500px]">
              <div className="space-y-4">
                {leads.filter(l => l.status === col.id).map(lead => (
                  <div 
                    key={lead.id || lead._id} 
                    draggable 
                    onDragStart={e => e.dataTransfer.setData("leadId", lead.id || lead._id)} 
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 cursor-grab active:cursor-grabbing hover:border-blue-200 transition-all group shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-slate-900 text-lg leading-tight">
                        {lead.company || lead.name}
                      </h4>
                      {/* Minimal status dot on card */}
                      <div className={`w-2 h-2 rounded-full ${col.dot} mt-2`} />
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Value</p>
                        <p className="text-xl font-black text-slate-900 tracking-tighter">₹{(lead.value || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-slate-200 group-hover:text-blue-500 transition-colors font-black">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;