import React from "react";
import toast from 'react-hot-toast';
import axiosInstance from "../api/axiosInstance";

const Pipeline = ({ leads, setLeads, refresh }) => {
  const columns = [
    { id: "New", title: "Leads Created" },
    { id: "Contacted", title: "Contacted" },
    { id: "Negotiation", title: "Negotiation" },
    { id: "Confirmed", title: "Deal Confirmed" },
    { id: "Lost", title: "Deal Lost" }
  ];

  const onDrop = async (e, newStatus) => {
    const leadId = e.dataTransfer.getData("leadId");
    const lead = leads.find(l => l.id === leadId);

    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      refresh();

      if (newStatus === "Confirmed") {
        toast.success(`Congratulations! ${lead.company} worth ₹${lead.value.toLocaleString()} is confirmed!`, {
          duration: 5000,
          style: { background: '#0f172a', color: '#3b82f6', borderRadius: '1rem', border: '2px solid #3b82f6' }
        });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 h-full bg-white text-left">
      <h1 className="text-4xl font-black mb-10 text-slate-900">Sales Pipeline</h1>
      <div className="flex gap-6 overflow-x-auto pb-10">
        {columns.map(col => (
          <div key={col.id} onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, col.id)} className="min-w-[300px] flex-shrink-0">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">{col.title}</h3>
            <div className={`rounded-[2.5rem] p-4 min-h-[500px] border-2 border-dashed ${col.id === 'Lost' ? 'bg-red-50/30 border-red-100' : 'bg-slate-50/50 border-slate-100'}`}>
              {leads.filter(l => l.status === col.id).map(lead => (
                <div key={lead.id} draggable onDragStart={e => e.dataTransfer.setData("leadId", lead.id)} className="bg-white p-6 rounded-[2rem] shadow-sm mb-4 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group">
                  <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{lead.company}</h4>
                  <p className="text-xl font-black mt-4 text-slate-900">₹{lead.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Pipeline;