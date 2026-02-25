import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journey = ({ selectedLead }) => {
  const navigate = useNavigate();

  if (!selectedLead) return <div className="p-20 text-center font-black text-slate-300">SELECT A LEAD FROM THE TABLE TO VIEW JOURNEY</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-left min-h-screen">
      <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest mb-10 transition-all">
        <ArrowLeft size={16}/> Back to Leads
      </button>

      <div className="flex items-end justify-between mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{selectedLead.company}</h1>
          <p className="text-blue-500 font-bold uppercase text-xs mt-4 tracking-[0.4em]">Client Lifecycle Timeline</p>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl">
          <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Current Status</p>
          <p className="text-2xl font-black mt-1 uppercase italic">{selectedLead.status}</p>
        </div>
      </div>

      <div className="relative border-l-4 border-slate-100 ml-8 pl-16 space-y-12">
        {selectedLead.history?.map((event, i) => (
          <div key={i} className="relative group">
            <div className="absolute -left-[86px] top-0 bg-white p-3 rounded-full border-4 border-slate-50 shadow-sm group-hover:scale-110 transition-transform">
              {event.type === 'Confirmed' ? <Star className="text-blue-500" size={24}/> : <CheckCircle2 className="text-slate-300" size={24}/>}
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-black text-slate-900 mb-2">{event.type}</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] mb-4 flex items-center gap-2"><Clock size={12}/> {new Date(event.date).toDateString()}</p>
              <p className="text-slate-500 font-bold leading-relaxed">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Journey;