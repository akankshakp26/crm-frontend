import React, { useEffect, useState } from "react";
import { Plus, ChevronRight, Edit2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeadsPage = ({ setSelectedLead }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ company: "", value: "" });
  const [deletingLead, setDeletingLead] = useState(null);

  const API_URL = "http://localhost:5000/api/leads";

  // Load leads from Harshitha's backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const formatted = data.map(l => ({
          id: l._id,
          company: l.name,
          value: l.value || 0,
          status: l.status || "New"
        }));
        setLeads(formatted);
      } catch (err) {
        console.error("Database fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    const leadData = { name: newLead.company, value: parseInt(newLead.value) };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });
    if (response.ok) {
      window.location.reload(); // Refresh to show new data
    }
  };

  const confirmDelete = async () => {
    await fetch(`${API_URL}/${deletingLead.id}`, { method: "DELETE" });
    setLeads(leads.filter(l => l.id !== deletingLead.id));
    setDeletingLead(null);
  };

  return (
    <div className="p-4 text-left">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">Lead Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2">
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold">Connecting to crm's Database...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-bold">
            No leads in database. Click "Add New Lead" to create one.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-6 text-xs font-black text-slate-400 uppercase">Company</th>
                <th className="p-6 text-xs font-black text-slate-400 text-center uppercase">Status</th>
                <th className="p-6 text-xs font-black text-slate-400 text-right uppercase">Value</th>
                <th className="p-6 text-xs font-black text-slate-400 text-right uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="p-6 font-black text-slate-800">{lead.company}</td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-700">{lead.status}</span>
                  </td>
                  <td className="p-6 text-right font-black">${lead.value.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <button onClick={() => setDeletingLead(lead)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleAddLead} className="bg-white rounded-3xl p-12 max-w-md w-full">
            <h2 className="text-3xl font-black mb-8">New Lead</h2>
            <input className="w-full p-5 bg-slate-50 rounded-2xl mb-4" placeholder="Company Name" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} />
            <input className="w-full p-5 bg-slate-50 rounded-2xl mb-8" placeholder="Value" type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} />
            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black">Save to MongoDB</button>
          </form>
        </div>
      )}

      {deletingLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 text-center">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-8">Delete {deletingLead.company}?</h2>
            <div className="flex gap-4">
              <button onClick={() => setDeletingLead(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;