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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">
          Lead Management
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2"
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

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
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black"
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
    </div>
  );
};

export default LeadsPage;
