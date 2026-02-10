import React, { useState } from 'react';
import { UserPlus, Search, MoreVertical } from 'lucide-react';

const Leads = () => {
  // Mock data based on your team's Lead Schema [cite: 23]
  const [leads] = useState([
    { id: 1, name: "Arjun Mehta", org: "Tech Solutions", status: "New", engagement: "High" },
    { id: 2, name: "Sita Rao", org: "Green Energy", status: "Contacted", engagement: "Medium" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Lead Management</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <UserPlus size={18} /> Add New Lead
        </button>
      </div>

      {/* Search Bar [cite: 28] */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search leads or organizations..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Leads Table [cite: 215] */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-semibold">Lead Name</th>
              <th className="p-4 font-semibold">Organization</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-blue-50/50 transition">
                <td className="p-4 font-medium text-slate-700">{lead.name}</td>
                <td className="p-4 text-gray-600">{lead.org}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline text-sm font-semibold">
                    Convert to Client
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;