import React, { useState } from 'react';
import { UserPlus, Search, MoreVertical } from 'lucide-react';

const Leads = () => {
  // Mock data based on your team's Lead Schema [cite: 23]
const LeadsPage = () => {
  const leads = [
    { id: 1, name: 'Alpha Corp', contact: 'Rahul S.', status: 'New', value: '$5,000' },
    { id: 2, name: 'Beta Tech', contact: 'Sneha M.', status: 'Contacted', value: '$12,000' },
    { id: 3, name: 'Global Sol.', contact: 'Vikram K.', status: 'Negotiation', value: '$8,500' },
  ];

  return (
    <div className="clean-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800">Active Leads</h2>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
          + Add New Lead
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100 text-left">
              <th className="pb-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Company</th>
              <th className="pb-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Contact</th>
              <th className="pb-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
              <th className="pb-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-5 font-bold text-slate-700">{lead.name}</td>
                <td className="py-5 text-slate-500 font-medium">{lead.contact}</td>
                <td className="py-5">
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-black uppercase">
                    {lead.status}
                  </span>
                </td>
                <td className="py-5 text-right font-black text-slate-800">{lead.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
}
export default Leads;