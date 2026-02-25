import React from 'react';
import { CheckCircle2, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journey = ({ selectedLead }) => {
  const navigate = useNavigate();

  if (!selectedLead) {
    return (
      <div className="p-20 text-center">
        <div className="bg-slate-50 inline-block p-10 rounded-[3rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Select a lead from the Leads page to view their journey</p>
        </div>
      </div>
    );
  }

  const milestones = [
    { type: 'Discovery', date: 'Feb 20, 2026', desc: 'Initial lead captured.', icon: <CheckCircle2 className="text-emerald-500"/> },
    { type: 'Outreach', date: 'Feb 22, 2026', desc: 'First intro email sent.', icon: <Mail className="text-blue-500"/> },
    { type: 'Proposal', date: 'Feb 24, 2026', desc: 'Price proposal sent for review.', icon: <Clock className="text-amber-500"/> },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto text-left">
      <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest mb-8 transition-all">
        <ArrowLeft size={16}/> Back to Leads
      </button>

      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">{selectedLead.company}</h1>
        <p className="text-slate-400 font-bold uppercase text-xs mt-3 tracking-[0.3em]">Lifecycle Activity Feed</p>
      </div>

      <div className="relative border-l-4 border-slate-100 ml-6 pl-12 space-y-10">
        {milestones.map((step, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[68px] top-0 bg-white p-2 rounded-full border-4 border-slate-50 shadow-sm">{step.icon}</div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900">{step.type}</h3>
                <span className="text-slate-400 text-[10px] font-black uppercase flex items-center gap-2"><Calendar size={12}/> {step.date}</span>
              </div>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;