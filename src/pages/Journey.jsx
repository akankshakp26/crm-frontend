import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, Circle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journey = ({ selectedLead }) => {
  const navigate = useNavigate();

  // Define the standard roadmap
  const fullRoadmap = ["New", "Contacted", "Negotiation", "Confirmed"];

  // Unique descriptions for each stage when they are in the "Future"
  const futureDescriptions = {
    "New": "Entry point: Awaiting initial system verification.",
    "Contacted": "Outreach: Preparing to establish first communication with the client.",
    "Negotiation": "Strategic Phase: Getting ready to discuss contract terms and pricing.",
    "Confirmed": "Final Goal: Preparing for deal closure and account hand-off."
  };

  if (!selectedLead) return (
    <div className="p-24 text-center">
       <div className="inline-block p-16 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
          <p className="font-black text-slate-300 uppercase tracking-widest text-xs italic">Select a lead to view full journey</p>
       </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest mb-10 transition-all">
        <ArrowLeft size={16}/> Back to Leads
      </button>

      <div className="max-w-5xl mx-auto flex items-end justify-between mb-24 pb-12 border-b border-slate-50">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{selectedLead.company}</h1>
          <p className="text-blue-600 font-bold uppercase text-xs mt-4 tracking-[0.4em]">Comprehensive Lifecycle Journey</p>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl">
          <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest text-left">Current Stage</p>
          <p className="text-2xl font-black mt-1 uppercase italic">{selectedLead.status}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative border-l-4 border-slate-100 ml-8 pl-16 space-y-12 pb-20">
        {fullRoadmap.map((stage, index) => {
          const entry = selectedLead.history?.find(h => h.type === stage);
          const isCompleted = !!entry;
          const isCurrent = selectedLead.status === stage;

          return (
            <div key={index} className="relative group">
              {/* Vertical Connector Icons */}
              <div className="absolute -left-[86px] top-0 bg-white p-3 rounded-full border-4 border-slate-50 shadow-sm transition-transform">
                {isCompleted ? (
                  <CheckCircle2 className="text-blue-600" size={24}/>
                ) : isCurrent ? (
                  <Star className="text-blue-600 animate-pulse" size={24}/>
                ) : (
                  <Circle className="text-slate-400" size={24}/>
                )}
              </div>

              {/* Step Card - Past, Present, and Future are all bold and clear */}
              <div className={`p-10 rounded-[3rem] shadow-xl border transition-all duration-300 ${
                isCurrent ? 'bg-white border-blue-500 shadow-blue-100' : 'bg-white border-slate-100'
              }`}>
                <div className="flex justify-between items-start mb-4 text-left">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                    {stage} {isCurrent && <span className="text-blue-600 text-[10px] ml-2 tracking-widest">— CURRENT POINT</span>}
                  </h3>
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      <Clock size={12}/> {new Date(entry.date).toDateString()}
                    </div>
                  )}
                </div>
                
                {/* Custom Subtitles based on the Stage */}
                <p className="font-bold leading-relaxed text-slate-600 text-left">
                  {isCompleted 
                    ? entry.desc 
                    : isCurrent 
                      ? "The account is successfully residing in this stage of the lifecycle." 
                      : futureDescriptions[stage]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Journey;