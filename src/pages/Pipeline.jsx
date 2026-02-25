import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  ChevronRight,
  Loader2
} from "lucide-react";

const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api/leads";

  // Mapping backend 'status' enum to Pipeline column titles
  const columns = [
    { id: "New", title: "Discovery", color: "bg-blue-500" },
    { id: "Contacted", title: "Contacted", color: "bg-purple-500" },
    { id: "Qualified", title: "Negotiation", color: "bg-emerald-500" },
    { id: "Lost", title: "Closed Won", color: "bg-slate-400" },
  ];

  // 1. Fetch live data from the backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Map backend fields to frontend expected names
        const formattedData = data.map(lead => ({
          id: lead._id,
          company: lead.name, // backend 'name' -> frontend 'company'
          value: lead.value || 0,
          status: lead.status || "New",
        }));
        
        setLeads(formattedData);
      } catch (error) {
        console.error("Pipeline fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const onDragOver = (e) => e.preventDefault();

  // 2. Save the new status to MongoDB when a card is dropped
  const onDrop = async (e, newStatus) => {
    const leadId = e.dataTransfer.getData("leadId");
    
    try {
      const response = await fetch(`${API_URL}/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state so the UI reflects the change immediately
        setLeads(prevLeads => 
          prevLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
        );
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-black uppercase tracking-widest text-xs">Syncing Pipeline with Database...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Sales Pipeline</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Drag cards to update lead status</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none w-64 font-bold"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-x-auto pb-6">
        {columns.map((column) => (
          <div 
            key={column.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
            className="flex-shrink-0 w-80 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`} />
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                  {column.title}
                </h3>
                <span className="ml-2 px-2 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-black">
                  {leads.filter(l => l.status === column.id).length}
                </span>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-[2.5rem] p-4 flex-grow border-2 border-dashed border-slate-200/60 min-h-[400px]">
              <div className="space-y-4">
                {leads.filter((l) => l.status === column.id).length === 0 ? (
                  <p className="text-center text-slate-300 py-10 text-xs font-bold uppercase tracking-tighter">No leads here</p>
                ) : (
                  leads
                    .filter((lead) => lead.status === column.id)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("leadId", lead.id)}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing hover:shadow-xl hover:-translate-y-1 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {lead.company}
                          </h4>
                          <button className="text-slate-300 hover:text-slate-900 transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-black text-slate-900">
                            ${lead.value.toLocaleString()}
                          </div>
                          <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;