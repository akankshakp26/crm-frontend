import React from 'react';
import { CheckCircle2, ArrowLeft, Calendar, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journey = ({ selectedLead }) => {
  const navigate = useNavigate();
  const companyName = selectedLead ? selectedLead.company : "No Lead Selected";
  const value = selectedLead ? selectedLead.value : 0;

  const timelineData = [
    { id: 1, title: "Lead Entry", date: "Feb 01", desc: `${companyName} was added to the CRM pipeline.`, status: "completed", icon: <Calendar size={20}/> },
    { id: 2, title: "Initial Contact", date: "Feb 05", desc: "Discovery call conducted with the stakeholders.", status: "completed", icon: <MessageSquare size={20}/> },
    { id: 3, title: "Proposal Phase", date: "Feb 10", desc: `Drafting a contract with a forecast value of $${value.toLocaleString()}.`, status: "in-progress", icon: <FileText size={20}/> },
  ];

  return (
    <div className="max-w-4xl mx-auto text-left animate-in fade-in duration-700">
      <button 
        onClick={() => navigate('/leads')} 
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all"
      >
        <ArrowLeft size={16} /> Back to Leads
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{companyName}</h1>
        <p className="text-blue-600 font-bold mt-2 uppercase tracking-widest text-[10px]">Strategic Client Roadmap</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
        <div className="space-y-12">
          {timelineData.map((item) => (
            <div key={item.id} className="relative flex items-start gap-12 group">
              <div className={`z-10 w-16 h-16 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl ${item.status === 'completed' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-white text-blue-600 border-blue-50 shadow-sm'}`}>
                {item.status === 'completed' ? <CheckCircle2 size={24} /> : item.icon}
              </div>
              <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">{item.date}</span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journey;