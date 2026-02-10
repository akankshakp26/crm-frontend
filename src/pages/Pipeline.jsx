import React from 'react';
import { DollarSign, MoreHorizontal, Plus } from 'lucide-react';

const Pipeline = () => {
  const stages = [
    { name: "Qualification", deals: [{ id: 1, title: "Alpha Corp Tech", value: "$5,000" }] },
    { name: "Proposal", deals: [{ id: 2, title: "Green Valley Setup", value: "$2,500" }] },
    { name: "Negotiation", deals: [] },
    { name: "Closed Won", deals: [{ id: 3, title: "Blue Sky Exports", value: "$12,000" }] }
  ];

  return (
    <div className="space-y-6 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
        <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Total Forecast: $19,500
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {stages.map((stage, idx) => (
          <div key={idx} className="min-w-[280px] bg-gray-100/50 rounded-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage.name}</h3>
              <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md shadow-sm">
                {stage.deals.length}
              </span>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto">
              {stage.deals.map((deal) => (
                <div key={deal.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors cursor-grab">
                  <p className="font-bold text-slate-800 text-sm mb-2">{deal.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-green-600 flex items-center">
                      <DollarSign size={12} /> {deal.value}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={16}/></button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all flex items-center justify-center gap-1 text-sm font-medium">
                <Plus size={16} /> Add Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;