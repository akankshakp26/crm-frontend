import React from 'react';
import { Phone, Users, FileText, Clock } from 'lucide-react';

const InteractionLogs = () => {
  const logs = [
    { type: 'Call', desc: 'Initial discovery call', date: '10:00 AM', icon: Phone, color: 'text-blue-500' },
    { type: 'Meeting', desc: 'Requirements gathering', date: 'Yesterday', icon: Users, color: 'text-green-500' },
    { type: 'Note', desc: 'Client requested a follow-up next week', date: '2 days ago', icon: FileText, color: 'text-amber-500' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-blue-600" /> Recent Interactions
      </h3>
      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg bg-gray-50 ${log.color}`}>
              <log.icon size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-700">{log.type}</p>
              <p className="text-sm text-gray-500">{log.desc}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{log.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractionLogs;
