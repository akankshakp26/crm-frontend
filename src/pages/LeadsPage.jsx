import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Mail,
  Building,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { addActivityLog } from "../utils/activityStore";

const LeadsPage = ({ leads, setLeads, user, setSelectedLead, refresh }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  // Modals States
  const [showAdd, setShowAdd] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [newLead, setNewLead] = useState({ company: "", email: "", value: "" });

  // 🔹 ADD LEAD
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/leads", {
        name: newLead.company,
        email: newLead.email,
        value: newLead.value,
        status: "New",
      });

      // ✅ Activity Log (only here)
      addActivityLog(`New lead "${newLead.company}" added`, "lead_add");

      setShowAdd(false);
      setNewLead({ company: "", email: "", value: "" });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 UPDATE LEAD
  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      const id = editingLead.id || editingLead._id;

      await axiosInstance.put(`/leads/${id}`, {
        name: editingLead.company || editingLead.name,
        email: editingLead.email,
        value: editingLead.value,
      });

      // ✅ Activity Log (only here)
      addActivityLog(
        `Lead "${editingLead.company || editingLead.name}" updated`,
        "note"
      );

      setEditingLead(null);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 DELETE LEAD
  const confirmDelete = async () => {
    try {
      const id = deletingLead.id || deletingLead._id;

      await axiosInstance.delete(`/leads/${id}`);

      // ✅ Activity Log (only once)
      addActivityLog(
        `Lead "${deletingLead.company || deletingLead.name}" deleted`,
        "note"
      );

      setLeads((prev) => prev.filter((l) => (l.id || l._id) !== id));
      setDeletingLead(null);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen relative font-sans">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Leads
          </h1>
          <p className="text-blue-500 font-bold text-xs uppercase mt-2 tracking-[0.4em] italic">
            Precision Growth Tracking
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-2xl"
        >
          <Plus size={20} /> Add Lead
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">
                Company
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">
                Email
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">
                Value
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-center">
                Status
              </th>
              {isAdmin && (
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr
                key={lead.id || lead._id}
                className="hover:bg-blue-50/40 transition-colors group"
              >
                <td
                  onClick={() => {
                    setSelectedLead(lead);
                    navigate("/journey");
                  }}
                  className="p-8 font-black text-slate-900 text-lg cursor-pointer hover:text-blue-600 underline decoration-blue-100 decoration-4 underline-offset-8"
                >
                  {lead.company || lead.name || "Unnamed Company"}
                </td>

                <td className="p-8 text-slate-500 font-bold">{lead.email}</td>

                <td className="p-8 text-right font-black text-slate-900 text-lg">
                  ₹{(lead.value || 0).toLocaleString()}
                </td>

                <td className="p-8 text-center">
                  <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {lead.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="p-8 text-right space-x-2">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => setDeletingLead(lead)}
                      className="p-2 text-slate-300 hover:text-red-500 text-xl transition-colors"
                      type="button"
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 ADD LEAD POPUP */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                New Lead
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-slate-400 hover:text-slate-900"
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Company Name
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Acme Corp"
                    value={newLead.company}
                    onChange={(e) =>
                      setNewLead({ ...newLead, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@acme.com"
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Value (INR)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                    type="number"
                    value={newLead.value}
                    onChange={(e) =>
                      setNewLead({ ...newLead, value: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
              >
                Create Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 EDIT LEAD POPUP */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-left">
                Edit Lead
              </h2>
              <button onClick={() => setEditingLead(null)} type="button">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Company Name
                </label>
                <input
                  required
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingLead.company || editingLead.name}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, company: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email
                </label>
                <input
                  required
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Value (INR)
                </label>
                <input
                  required
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  value={editingLead.value}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, value: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 CUSTOM DELETE DIALOG */}
      {deletingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-[440px] rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <div className="w-12 h-12 border-4 border-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Delete Lead?
            </h2>

            <p className="text-slate-500 font-bold text-lg leading-relaxed mb-10 px-4">
              Are you sure you want to remove{" "}
              <span className="text-slate-900">
                "{deletingLead.company || deletingLead.name}"
              </span>
              ?<br />
              <span className="text-slate-400 font-medium text-base">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex gap-4 px-2">
              <button
                onClick={() => setDeletingLead(null)}
                className="flex-1 py-5 bg-[#f1f5f9] text-slate-700 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-5 bg-[#ff4d4d] text-white rounded-3xl font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-100"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;