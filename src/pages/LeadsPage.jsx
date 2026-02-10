import React, { useState } from 'react';
import { Search, Filter, UserPlus, CheckCircle, Trash2, Edit, X } from 'lucide-react';

const LeadsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([
    { id: 1, name: "Arjun Mehta", org: "Tech Solutions", status: "New", email: "arjun@techsol.com" },
    { id: 2, name: "Sita Rao", org: "Green Energy", status: "Contacted", email: "sita@greenenergy.in" },
  ]);

  const handleConvert = (id, name) => {
    setLeads(leads.filter(lead => lead.id !== id));
    alert(`${name} converted to Client!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 shadow-sm"
        >
          <UserPlus size={18} /> Add New Lead
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search leads..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Leads Table - Using the code from our previous step */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-semibold">Lead Name</th>
              <th className="p-4 font-semibold">Organization</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{lead.name}</td>
                <td className="p-4 text-gray-600">{lead.org}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleConvert(lead.id, lead.name)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Convert to Client
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No leads found. Click "Add New Lead" to get started!
          </div>
        )}
      </div>
      </div>

      {/* ADD LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Lead Name</label>
                <input required type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Rajesh Khanna" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Organization</label>
                <input required type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Global Tech" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="name@company.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Status</label>
                <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;