import React from 'react';
import { Flag, Zap, CheckCircle2, MessageSquare, Handshake } from 'lucide-react';

const Journey = () => {
  const milestones = [
    { title: "First Contact", date: "Jan 10, 2026", desc: "Initial inquiry via website", icon: MessageSquare, status: "completed" },
    { title: "Lead Qualified", date: "Jan 15, 2026", desc: "Passed sales discovery call", icon: Zap, status: "completed" },
    { title: "Contract Signed", date: "Jan 28, 2026", desc: "Official conversion to Enterprise Client", icon: Handshake, status: "completed" },
    { title: "Project Kickoff", date: "Feb 05, 2026", desc: "Internal team assigned", icon: Flag, status: "current" },
    { title: "First Delivery", date: "Pending", desc: "Expected milestone for Q1", icon: CheckCircle2, status: "upcoming" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">Client Journey Roadmap</h1>
      
      <div className="relative border-l-4 border-slate-100 ml-6 space-y-12">
        {milestones.map((step, i) => (
          <div key={i} className="relative pl-12">
            {/* The Dot */}
            <div className={`absolute -left-[14px] top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
              step.status === 'completed' ? 'bg-blue-600' : step.status === 'current' ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'
            }`}>
              {step.status === 'completed' && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <step.icon className={step.status === 'completed' ? 'text-blue-600' : 'text-slate-400'} size={20} />
                  <h3 className="font-bold text-lg text-slate-800">{step.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{step.date}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;