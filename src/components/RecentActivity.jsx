import React from 'react';
import { CheckCircle, UserPlus, MessageSquare, Clock } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { type: 'Lead', text: 'New lead "Alpha Corp" added', time: '10 mins ago', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'Conversion', text: 'Arjun Mehta converted to Client', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { type: 'Note', text: 'Follow-up note added for Sita Rao', time: 'Yesterday', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" /> Recent Activity
      </h3>
      <div className="space-y-6">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 relative">
            {i !== activities.length - 1 && <div className="absolute left-6 top-10 w-0.5 h-10 bg-slate-100"></div>}
            <div className={`h-12 w-12 rounded-2xl ${act.bg} ${act.color} flex items-center justify-center shrink-0`}>
              <act.icon size={20} />
            </div>
            <div className="pt-1">
              <p className="font-bold text-slate-800">{act.text}</p>
              <p className="text-sm text-slate-400 font-medium">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;