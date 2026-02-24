// src/pages/ClientsPage.jsx
import React, { useEffect, useState } from "react";
import { Plus, Trash2, AlertTriangle, Loader2, X } from "lucide-react";

// If you created src/api.js (recommended)
import { CLIENTS_API } from "../api";
 

const ClientsPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = userInfo?.role === "admin";
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [deletingClient, setDeletingClient] = useState(null);

  // ✅ Same pattern as LeadsPage
  const fetchClients = async () => {
    try {
      const response = await fetch(CLIENTS_API);
      const data = await response.json();

      const formatted = (Array.isArray(data) ? data : data?.clients || []).map(
        (c) => ({
          id: c._id,
          name: c.name || c.company || "",
          company: c.company || c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          tier: c.tier || "Enterprise Account",
        })
      );

      setClients(formatted);
    } catch (err) {
      console.error("Clients fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ POST /api/clients
  const handleAddClient = async (e) => {
    e.preventDefault();

    // Send only what backend expects (safe)
    const payload = {
      name: newClient.name || newClient.company,
      email: newClient.email,
      phone: newClient.phone,
      company: newClient.company || newClient.name,
    };

    try {
      const response = await fetch(CLIENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchClients();
        setShowAddModal(false);
        setNewClient({ name: "", email: "", phone: "", company: "" });
      } else {
        alert("Add client failed. Check fields / unique email.");
      }
    } catch (err) {
      console.error("Add client failed", err);
    }
  };

  // ✅ DELETE /api/clients/:id  (token only if your backend uses auth)
  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${CLIENTS_API}/${deletingClient.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setClients((prev) => prev.filter((c) => c.id !== deletingClient.id));
        setDeletingClient(null);
      } else {
        alert("Delete failed. Check backend auth/route.");
      }
    } catch (err) {
      console.error("Delete client failed", err);
    }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Clients
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-widest">
            Client Management Dashboard
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <Plus size={24} /> Add New Client
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
        {isLoading ? (
          <div className="p-32 flex flex-col items-center gap-6 text-slate-400">
            <Loader2 className="animate-spin" size={48} />
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">
              Syncing Clients Database
            </p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-bold">
            No clients found.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Client / Company
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Email
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Phone
                </th>
{isAdmin && (
  <th className="p-8 text-[10px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">
    Actions
  </th>
)}
              </tr>
            </thead>

<tbody className="divide-y divide-slate-50">
  {clients.map((c) => (
    <tr
      key={c.id}
      className="hover:bg-slate-50/30 transition-colors group"
    >
      <td className="p-8 font-black text-slate-900 text-lg">
        {c.company || c.name}
      </td>

      <td className="p-8 text-slate-500 font-bold text-sm">
        {c.email}
      </td>

      <td className="p-8 text-slate-500 font-bold text-sm">
        {c.phone || "-"}
      </td>

      {isAdmin && (   // ✅ Only admin sees this column
        <td className="p-8 text-right">
          <div className="flex justify-end">
            <button
              onClick={() => setDeletingClient(c)}
              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </td>
      )}

    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <form
            onSubmit={handleAddClient}
            className="bg-white rounded-[3rem] p-16 max-w-md w-full relative shadow-2xl border border-slate-100"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-black mb-10 text-slate-900 tracking-tight">
              New Client
            </h2>

            <div className="space-y-6">
              <input
                required
                className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 ring-slate-200 transition"
                placeholder="Client / Company Name"
                value={newClient.company}
                onChange={(e) =>
                  setNewClient((p) => ({ ...p, company: e.target.value }))
                }
              />
              <input
                required
                className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 ring-slate-200 transition"
                placeholder="Email Address"
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient((p) => ({ ...p, email: e.target.value }))
                }
              />
              <input
                className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 ring-slate-200 transition"
                placeholder="Phone"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>

            <button
              type="submit"
              className="w-full mt-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              Create Client
            </button>
          </form>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingClient && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl">
          <div className="bg-white rounded-[3.5rem] p-14 text-center shadow-2xl max-w-sm w-full mx-4 border border-slate-100">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
              <AlertTriangle size={48} />
            </div>

            <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">
              Delete Client?
            </h2>

            <p className="text-slate-500 font-bold mb-10 leading-relaxed">
              Confirm removal of <br />
              <span className="text-slate-900 px-3 py-1 bg-slate-50 rounded-lg">
                {deletingClient.company || deletingClient.name}
              </span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-100"
              >
                Confirm Delete
              </button>

              <button
                onClick={() => setDeletingClient(null)}
                className="w-full py-5 bg-white text-slate-400 rounded-2xl font-black text-lg hover:text-slate-900 transition-all"
              >
                Keep Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;