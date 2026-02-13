import React, { useState } from 'react';
import { Edit2, Trash2, Search, Plus, AlertCircle, X } from 'lucide-react'; 
import { initialLeads } from './Leads'; 

const LeadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState(initialLeads);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const requestDelete = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setLeads(leads.filter(l => l.id !== selectedLead.id));
    setShowModal(false);
    setSelectedLead(null);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <div className={`transition-all duration-300 ${showModal ? 'blur-sm grayscale-[0.5]' : ''}`}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lead Management</h1>
            <p className="text-slate-500 mt-1 font-medium italic text-sm">Reviewing {filteredLeads.length} active opportunities</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus size={20} /> Add New Lead
          </button>
        </div>

        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by company..."
            className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-100 outline-none focus:border-blue-500 transition-all shadow-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- FIXED ALIGNMENT TABLE --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-8 font-black text-slate-400 uppercase text-[10px] tracking-widest text-left">Company</th>
                {/* ALIGNMENT FIX: Headers now match the data */}
                <th className="p-8 font-black text-slate-400 uppercase text-[10px] tracking-widest text-left">Status</th>
                <th className="p-8 font-black text-slate-400 uppercase text-[10px] tracking-widest text-left">Value</th>
                <th className="p-8 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-8 font-bold text-slate-800">{lead.name}</td>
                  
                  {/* ALIGNMENT FIX: Status badge aligned to the left */}
                  <td className="p-8 text-left">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      lead.status === 'Negotiation' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* ALIGNMENT FIX: Value text aligned to the left */}
                  <td className="p-8 text-left font-black text-slate-900 text-lg">
                    {lead.value}
                  </td>

                  <td className="p-8 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => requestDelete(lead)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                <AlertCircle size={32} />
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Lead?</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Are you sure you want to remove <span className="text-slate-900 font-bold">{selectedLead?.name}</span>? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowModal(false)} className="py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;