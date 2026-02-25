import React, { useState } from "react";
import { Plus, Trash2, AlertTriangle, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const LeadsPage = ({ leads, setLeads, user, setSelectedLead }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ company: "", value: "", email: "" });
  const [deletingLead, setDeletingLead] = useState(null);

  const isAdmin = user?.role === "admin";
  const API_URL = "http://localhost:5000/api/leads";

  const handleViewJourney = (lead) => {
    setSelectedLead(lead); // Set global state
    navigate("/journey"); // Redirect
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    const leadData = { name: newLead.company, email: newLead.email, value: parseInt(newLead.value) || 0 };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      if (response.ok) {
        const saved = await response.json();
        setLeads([...leads, { id: saved._id, company: saved.name, value: saved.value, status: saved.status, email: saved.email }]);
        setShowAddModal(false);
        setNewLead({ company: "", value: "", email: "" });
      }
    } catch (error) { console.error(error); }
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${deletingLead.id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setLeads(leads.filter(l => l.id !== deletingLead.id));
        setDeletingLead(null);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-widest">Management Portal</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-lg"><Plus size={24} /> Add New Lead</button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="p-8 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">Status</th>
              <th className="p-8 text-[10px] font-black text-slate-400 text-right uppercase tracking-widest">Value</th>
              <th className="p-8 text-[10px] font-black text-slate-400 text-right uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-8 font-black text-slate-900 text-lg">{lead.company}</td>
                <td className="p-8 text-slate-500 font-bold text-sm">{lead.email}</td>
                <td className="p-8 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{lead.status}</span>
                </td>
                <td className="p-8 text-right font-black text-slate-900 text-lg">${(lead.value || 0).toLocaleString()}</td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleViewJourney(lead)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Eye size={20} /></button>
                    {isAdmin && <button onClick={() => setDeletingLead(lead)} className="p-3 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={20} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS - ADD & DELETE */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <form onSubmit={handleAddLead} className="bg-white rounded-[3rem] p-16 max-w-md w-full relative shadow-2xl">
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={24}/></button>
            <h2 className="text-4xl font-black mb-10 text-slate-900">New Lead</h2>
            <div className="space-y-6">
              <input required className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Company Name" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} />
              <input required className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Email" type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
              <input required className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Value ($)" type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} />
            </div>
            <button type="submit" className="w-full mt-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all">Create Lead</button>
          </form>
        </div>
      )}

      {deletingLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl">
          <div className="bg-white rounded-[3.5rem] p-14 text-center max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-pulse"><AlertTriangle size={48} /></div>
            <h2 className="text-3xl font-black mb-4">Delete Lead?</h2>
            <p className="text-slate-500 font-bold mb-10 leading-relaxed">Confirm removal of <br/><span className="text-slate-900 px-3 py-1 bg-slate-50 rounded-lg">{deletingLead.company}</span></p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-lg hover:bg-red-600">Confirm Delete</button>
              <button onClick={() => setDeletingLead(null)} className="w-full py-5 bg-white text-slate-400 rounded-2xl font-black text-lg">Keep Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;