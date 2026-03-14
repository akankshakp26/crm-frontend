import React, { useState } from "react";
import {
  Plus, X, Mail, Building, AlertTriangle, Edit2, User, Lock,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { addActivityLog } from "../utils/activityStore";

const emptyLead = {
  company: "",
  email: "",
  username: "",
  password: "",
};

const emptyErrors = {
  username: "",
  password: "",
};

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />}
      <input
        className={`w-full ${Icon ? "pl-12" : "pl-6"} pr-4 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 ${error ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-[11px] font-bold pl-1">{error}</p>}
  </div>
);

const validateUsername = (val) => {
  if (val.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Only letters, numbers and underscores allowed";
  return "";
};

const validatePassword = (val) => {
  if (val.length < 8) return "Password must be at least 8 characters";
  if (!/\d/.test(val)) return "Password must contain at least 1 number";
  return "";
};

const LeadsPage = ({ leads, setLeads, user, refresh }) => {
  const isAdmin = user?.role === "admin";

  const [showAdd, setShowAdd] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [newLead, setNewLead] = useState(emptyLead);
  const [addErrors, setAddErrors] = useState(emptyErrors);
  const [editErrors, setEditErrors] = useState(emptyErrors);

  // 🔹 ADD LEAD
  const handleAddLead = async (e) => {
    e.preventDefault();

    const usernameErr = validateUsername(newLead.username);
    const passwordErr = validatePassword(newLead.password);
    setAddErrors({ username: usernameErr, password: passwordErr });
    if (usernameErr || passwordErr) return;

    try {
      await axiosInstance.post("/leads", {
        name: newLead.company,
        company: newLead.company,
        email: newLead.email,
        username: newLead.username,
        password: newLead.password,
      });

      addActivityLog(`New lead "${newLead.company}" added`, "lead_add");
      setShowAdd(false);
      setNewLead(emptyLead);
      setAddErrors(emptyErrors);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 UPDATE LEAD
  const handleUpdateLead = async (e) => {
    e.preventDefault();

    const usernameErr = validateUsername(editingLead.username || "");
    const passwordErr = validatePassword(editingLead.password || "");
    setEditErrors({ username: usernameErr, password: passwordErr });
    if (usernameErr || passwordErr) return;

    try {
      const id = editingLead.id || editingLead._id;

      await axiosInstance.put(`/leads/${id}`, {
        name: editingLead.company || editingLead.name,
        company: editingLead.company || editingLead.name,
        email: editingLead.email,
        username: editingLead.username,
        password: editingLead.password,
      });

      addActivityLog(`Lead "${editingLead.company || editingLead.name}" updated`, "note");
      setEditingLead(null);
      setEditErrors(emptyErrors);
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

      addActivityLog(`Lead "${deletingLead.company || deletingLead.name}" deleted`, "note");
      setLeads((prev) => prev.filter((l) => (l.id || l._id) !== id));
      setDeletingLead(null);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Leads</h1>
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

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Company</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Email</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Username</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Password</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Total Amount</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Amount Paid</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Remaining</th>
              {isAdmin && (
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7}
                  className="p-16 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id || lead._id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-6 font-black text-slate-900 text-base">
                    {lead.company || lead.name || "Unnamed"}
                  </td>
                  <td className="p-6 text-slate-500 font-bold text-sm">{lead.email}</td>
                  <td className="p-6 text-slate-700 font-bold text-sm">{lead.username || "—"}</td>
                  <td className="p-6 text-slate-700 font-bold text-sm">{lead.password || "—"}</td>
                  <td className="p-6 text-right font-black text-slate-900">
                    ₹{Number(lead.totalAmount || 0).toLocaleString()}
                  </td>
                  <td className="p-6 text-right font-black text-emerald-600">
                    ₹{Number(lead.amountPaid || 0).toLocaleString()}
                  </td>
                  <td className="p-6 text-right font-black text-red-500">
                    ₹{Number(lead.remaining || 0).toLocaleString()}
                  </td>
                  {isAdmin && (
                    <td className="p-6 text-center space-x-2">
                      <button onClick={() => setEditingLead(lead)}
                        className="p-2 text-slate-300 hover:text-blue-600 transition-colors" type="button">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeletingLead(lead)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors" type="button">
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── ADD LEAD MODAL ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header — fixed */}
            <div className="p-8 bg-slate-50 border-b border-slate-100 rounded-t-[3rem] flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">New Lead</h2>
                <p className="text-slate-400 font-bold text-xs mt-1">Amounts are auto-calculated from projects</p>
              </div>
              <button onClick={() => { setShowAdd(false); setAddErrors(emptyErrors); }} type="button">
                <X size={24} className="text-slate-400 hover:text-slate-900" />
              </button>
            </div>
            {/* Body — scrollable */}
            <form onSubmit={handleAddLead} className="p-8 space-y-5 overflow-y-auto">
              <InputField label="Company Name" icon={Building} required placeholder="Acme Corp"
                value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} />
              <InputField label="Email" icon={Mail} required type="email" placeholder="contact@acme.com"
                value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
              <InputField label="Username" icon={User} required placeholder="acme_user"
                error={addErrors.username}
                value={newLead.username}
                onChange={(e) => {
                  setNewLead({ ...newLead, username: e.target.value });
                  setAddErrors({ ...addErrors, username: validateUsername(e.target.value) });
                }} />
              <InputField label="Password" icon={Lock} required placeholder="min 8 chars, 1 number"
                error={addErrors.password}
                value={newLead.password}
                onChange={(e) => {
                  setNewLead({ ...newLead, password: e.target.value });
                  setAddErrors({ ...addErrors, password: validatePassword(e.target.value) });
                }} />

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  💡 Total Amount, Amount Paid & Remaining are automatically calculated from the client's projects.
                </p>
              </div>

              <button type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                Create Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT LEAD MODAL ── */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header — fixed */}
            <div className="p-8 bg-blue-600 text-white rounded-t-[3rem] flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Edit Lead</h2>
                <p className="text-blue-200 text-xs font-bold mt-1">Amounts calculated from projects</p>
              </div>
              <button onClick={() => { setEditingLead(null); setEditErrors(emptyErrors); }} type="button">
                <X size={24} />
              </button>
            </div>
            {/* Body — scrollable */}
            <form onSubmit={handleUpdateLead} className="p-8 space-y-5 overflow-y-auto">
              {[
                { label: "Company Name", key: "company", type: "text", value: editingLead.company || editingLead.name || "" },
                { label: "Email", key: "email", type: "email", value: editingLead.email || "" },
              ].map(({ label, key, type, value }) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                  <input required type={type}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                    value={value}
                    onChange={(e) => setEditingLead({ ...editingLead, [key]: e.target.value })}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
                <input required type="text"
                  className={`w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 ${editErrors.username ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`}
                  value={editingLead.username || ""}
                  onChange={(e) => {
                    setEditingLead({ ...editingLead, username: e.target.value });
                    setEditErrors({ ...editErrors, username: validateUsername(e.target.value) });
                  }}
                />
                {editErrors.username && <p className="text-red-500 text-[11px] font-bold pl-1">{editErrors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <input required type="text"
                  className={`w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 ${editErrors.password ? "ring-2 ring-red-400" : "focus:ring-blue-500"}`}
                  value={editingLead.password || ""}
                  onChange={(e) => {
                    setEditingLead({ ...editingLead, password: e.target.value });
                    setEditErrors({ ...editErrors, password: validatePassword(e.target.value) });
                  }}
                />
                {editErrors.password && <p className="text-red-500 text-[11px] font-bold pl-1">{editErrors.password}</p>}
              </div>

              {/* Read-only amounts */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Amounts (from projects)</p>
                {[
                  { label: "Total Amount", value: editingLead.totalAmount || 0, color: "text-slate-900" },
                  { label: "Amount Paid", value: editingLead.amountPaid || 0, color: "text-emerald-600" },
                  { label: "Remaining", value: editingLead.remaining || 0, color: "text-red-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">{label}</span>
                    <span className={`font-black text-sm ${color}`}>₹{Number(value).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deletingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-[440px] rounded-[3rem] shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <div className="w-12 h-12 border-4 border-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Delete Lead?</h2>
            <p className="text-slate-500 font-bold text-lg leading-relaxed mb-10 px-4">
              Are you sure you want to remove{" "}
              <span className="text-slate-900">"{deletingLead.company || deletingLead.name}"</span>?
              <br />
              <span className="text-slate-400 font-medium text-base">This action cannot be undone.</span>
            </p>
            <div className="flex gap-4 px-2">
              <button onClick={() => setDeletingLead(null)}
                className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all"
                type="button">Cancel</button>
              <button onClick={confirmDelete}
                className="flex-1 py-5 bg-red-500 text-white rounded-3xl font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-100"
                type="button">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
