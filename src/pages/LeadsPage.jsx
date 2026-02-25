import React, { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const LeadsPage = ({ leads, setLeads, user, setSelectedLead, refresh }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ company: "", email: "", value: "" });

  const handleAdd = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/leads", { name: newLead.company, email: newLead.email, value: newLead.value });
    setShowAdd(false);
    refresh();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await axiosInstance.delete(`/leads/${id}`);
      refresh();
    }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900">Leads</h1>
          <p className="text-blue-500 font-bold text-xs uppercase mt-2 tracking-widest italic">Growth & Opportunity Tracker</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all">
          <Plus size={20} /> Add Lead
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">Company</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">Email</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Value</th>
              {isAdmin && <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                <td onClick={() => { setSelectedLead(lead); navigate('/journey'); }} className="p-8 font-black text-slate-900 text-lg cursor-pointer hover:text-blue-600 underline decoration-blue-100 decoration-4 underline-offset-8">
                  {lead.company}
                </td>
                <td className="p-8 text-slate-500 font-bold">{lead.email}</td>
                <td className="p-8 text-center">
                  <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">{lead.status}</span>
                </td>
                <td className="p-8 text-right font-black text-slate-900 text-lg">₹{lead.value.toLocaleString()}</td>
                {isAdmin && (
                  <td className="p-8 text-right space-x-2">
                    <button className="p-2 text-slate-300 hover:text-blue-600"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete(lead.id)} className="p-2 text-slate-300 hover:text-red-500">🗑️</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LeadsPage;