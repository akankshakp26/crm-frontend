import React, { useState } from 'react';
import { Plus, X, ChevronRight, Edit2, Trash2, AlertTriangle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const LeadsPage = ({ leads, setLeads, setSelectedLead }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null); // NEW: Track lead being deleted
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

  // --- CONFIRMED DELETE ---
  const confirmDelete = () => {
    setLeads(leads.filter(l => l.id !== deletingLead.id));
    setDeletingLead(null);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
    setEditingLead(null);
  };

  return (
    <div className="relative p-4 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lead Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
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
              <th className="p-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-8">
                  <button onClick={() => handleLeadClick(lead)} className="flex items-center gap-2 font-black text-slate-800 hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-300">
                    {lead.company} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                  </button>
                </td>
                <td className="p-8 text-center">
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase bg-blue-100 text-blue-700">{lead.status}</span>
                </td>
                <td className="p-8 text-right font-black text-slate-900 text-lg">${(lead.value || 0).toLocaleString()}</td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingLead(lead)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                    {/* TRIGGER CUSTOM POP-UP */}
                    <button onClick={() => setDeletingLead(lead)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CUSTOM DELETE POP-UP */}
      {deletingLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Lead?</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Are you sure you want to remove <span className="font-bold text-slate-900">{deletingLead.company}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeletingLead(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleEditSave} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative">
            <button type="button" onClick={() => setEditingLead(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight text-left">Edit Lead</h2>
            <div className="space-y-6">
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-black focus:ring-2 focus:ring-blue-600 text-left" value={editingLead.company} onChange={(e) => setEditingLead({...editingLead, company: e.target.value})} />
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-black focus:ring-2 focus:ring-blue-600 text-left" type="number" value={editingLead.value} onChange={(e) => setEditingLead({...editingLead, value: parseInt(e.target.value)})} />
            </div>
            <button type="submit" className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg">Save Changes</button>
          </form>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleAddLead} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-left">New Lead</h2>
            <div className="space-y-4">
              <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-left" placeholder="Company Name" value={newLead.company} onChange={(e) => setNewLead({...newLead, company: e.target.value})} />
              <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-left" placeholder="Value" type="number" value={newLead.value} onChange={(e) => setNewLead({...newLead, value: e.target.value})} />
            </div>
            <button type="submit" className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black">Create Lead</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;