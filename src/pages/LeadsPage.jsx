import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  ChevronRight,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeads, setLeads as saveLeads } from "../utils/crmStore";

const LeadsPage = ({ leads: leadsProp, setLeads: setLeadsProp, setSelectedLead }) => {
  const navigate = useNavigate();

  const [localLeads, setLocalLeads] = useState([]);
  const leads = leadsProp ?? localLeads;
  const setLeads = setLeadsProp ?? setLocalLeads;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [newLead, setNewLead] = useState({ company: "", value: "" });

  useEffect(() => {
    if (leadsProp === undefined) {
      setLocalLeads(getLeads());
    }
  }, [leadsProp]);

  useEffect(() => {
    if (leadsProp === undefined) {
      saveLeads(leads);
    }
  }, [leads, leadsProp]);

  const handleLeadClick = (lead) => {
    setSelectedLead?.(lead);
    navigate("/journey");
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.company || !newLead.value) return;

    const entry = {
      id: Date.now(),
      company: newLead.company,
      value: parseInt(newLead.value),
      stage: "Discovery",
      status: "New",
    };

    setLeads([...leads, entry]);
    setShowAddModal(false);
    setNewLead({ company: "", value: "" });
  };

  const confirmDelete = () => {
    setLeads(leads.filter((l) => l.id !== deletingLead.id));
    setDeletingLead(null);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setLeads(leads.map((l) => (l.id === editingLead.id ? editingLead : l)));
    setEditingLead(null);
  };

  const handleConvert = (id) => {
    setLeads(
      leads.map((l) =>
        l.id === id ? { ...l, stage: "Closed Won", status: "Converted" } : l
      )
    );
  };

  return (
    <div className="relative p-4 text-left">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">
          Lead Management
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition"
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-6 text-xs font-black text-slate-400 uppercase">
                Company
              </th>
              <th className="p-6 text-xs font-black text-slate-400 text-center uppercase">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 text-right uppercase">
                Value
              </th>
              <th className="p-6 text-xs font-black text-slate-400 text-right uppercase">
                Convert
              </th>
              <th className="p-6 text-xs font-black text-slate-400 text-right uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="p-6">
                  <button
                    onClick={() => handleLeadClick(lead)}
                    className="flex items-center gap-2 font-black text-slate-800"
                  >
                    {lead.company}
                    <ChevronRight size={14} />
                  </button>
                </td>

                <td className="p-6 text-center">
                  <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-700">
                    {lead.status}
                  </span>
                </td>

                <td className="p-6 text-right font-black">
                  ${(lead.value || 0).toLocaleString()}
                </td>

                <td className="p-6 text-right">
                  <button
                    onClick={() => handleConvert(lead.id)}
                    className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition"
                  >
                    Convert
                  </button>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="p-2 text-slate-400 hover:text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => setDeletingLead(lead)}
                      className="p-2 text-slate-400 hover:text-red-500"
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

      {/* DELETE POPUP */}
      {deletingLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Delete Lead?
            </h2>

            <p className="text-slate-500 text-sm font-medium mb-8">
              Are you sure you want to remove{" "}
              <span className="font-bold text-slate-900">
                {deletingLead.company}
              </span>?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeletingLead(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form
            onSubmit={handleAddLead}
            className="bg-white rounded-3xl p-12 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-8">
              New Lead
            </h2>

            <div className="space-y-4">
              <input
                className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black"
                placeholder="Company Name"
                value={newLead.company}
                onChange={(e) =>
                  setNewLead({ ...newLead, company: e.target.value })
                }
              />

              <input
                className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black"
                placeholder="Value"
                type="number"
                value={newLead.value}
                onChange={(e) =>
                  setNewLead({ ...newLead, value: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black"
            >
              Create Lead
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
