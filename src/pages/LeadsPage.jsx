import React, { useState } from 'react';
import { Plus, X, ChevronRight } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const LeadsPage = ({ leads, setLeads, setSelectedLead }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ company: '', value: '' });

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    navigate('/journey');
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.company || !newLead.value) return;
    const entry = { id: Date.now(), company: newLead.company, value: parseInt(newLead.value), stage: 'Discovery', status: 'New' };
    setLeads([...leads, entry]);
    setShowAddModal(false);
    setNewLead({ company: '', value: '' });
  };

  return (
    <div className="relative p-4 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lead Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">Company</th>
              <th className="p-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</th>
              <th className="p-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.length > 0 ? leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-8">
                  <button onClick={() => handleLeadClick(lead)} className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-300">
                    {lead.company} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                  </button>
                </td>
                <td className="p-8 text-center">
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase bg-blue-100 text-blue-700">{lead.status}</span>
                </td>
                <td className="p-8 text-right font-black text-slate-900 text-lg">${(lead.value || 0).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="p-20 text-center font-bold text-slate-400 italic">No leads match your search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleAddLead} className="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-8">New Lead</h2>
            <div className="space-y-4">
              <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Company Name" value={newLead.company} onChange={(e) => setNewLead({...newLead, company: e.target.value})} />
              <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Value" type="number" value={newLead.value} onChange={(e) => setNewLead({...newLead, value: e.target.value})} />
            </div>
            <button type="submit" className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black">Create Lead</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;