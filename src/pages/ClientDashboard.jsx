import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  LogOut, Building, DollarSign, FolderOpen,
  Clock, CheckCircle, AlertCircle, TrendingUp,
  FileText, Send, MessageSquare,
} from "lucide-react";

const ClientDashboard = ({ onClientLogout }) => {
  const navigate = useNavigate();
  const client = JSON.parse(localStorage.getItem("clientUser") || "{}");
  const clientToken = localStorage.getItem("clientToken");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth header for client token
  const authHeader = { headers: { Authorization: `Bearer ${clientToken}` } };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject._id);
      fetchDocuments(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      // Use admin axiosInstance but with clientId filter — projects are public per client
      const res = await axiosInstance.get(`/projects?clientId=${client.id}`);
      setProjects(res.data || []);
      if (res.data?.length > 0) setSelectedProject(res.data[0]);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/messages`);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchDocuments = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/documents`);
      setDocuments(res.data || []);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!msgText.trim() || !selectedProject) return;
    try {
      await axiosInstance.post(`/projects/${selectedProject._id}/messages`, {
        from: "client",
        text: msgText,
      });
      setMsgText("");
      fetchMessages(selectedProject._id);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    onClientLogout();
    navigate("/login");
  };

  const paidPercent = client.totalAmount
    ? Math.min(100, Math.round((client.amountPaid / client.totalAmount) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Navbar */}
      <div className="bg-slate-900 px-8 py-5 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{client.name || "Client Portal"}</h1>
          <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-0.5">Client Dashboard</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-8">

        {/* Welcome */}
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {client.name} 👋</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">{client.email}</p>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Amount", value: client.totalAmount || 0, icon: DollarSign, color: "text-slate-900", bg: "bg-slate-100" },
            { label: "Amount Paid", value: client.amountPaid || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Remaining", value: client.remaining || 0, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={color} size={22} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              <p className={`text-3xl font-black mt-1 ${color}`}>₹{Number(value).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Payment Progress */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Progress</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{paidPercent}% Paid</p>
            </div>
            <TrendingUp className="text-blue-500" size={28} />
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Building className="text-slate-600" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Info</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</p>
              <p className="text-xl font-black text-slate-900 mt-1">{client.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
              <p className="text-xl font-black text-slate-900 mt-1">{client.email}</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FolderOpen className="text-blue-500" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Projects</p>
          </div>

          {loading ? (
            <p className="text-slate-400 font-bold text-sm">Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl">
              <FolderOpen className="text-slate-200 mx-auto mb-3" size={36} />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const paidTotal = project.installments?.filter(i => i.paid).reduce((s, i) => s + i.amount, 0) || 0;
                const progress = project.totalPayment > 0 ? (paidTotal / project.totalPayment) * 100 : 0;
                const allPaid = paidTotal >= project.totalPayment;
                const isOverdue = project.deadline && new Date(project.deadline) < new Date() && !allPaid;
                const status = allPaid ? "Completed" : isOverdue ? "Overdue" : "Active";

                return (
                  <div
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-6 rounded-2xl cursor-pointer transition-colors border-2 ${
                      selectedProject?._id === project._id
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-transparent bg-slate-50 hover:bg-blue-50/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-slate-900">{project.name}</p>
                        <p className="text-slate-400 font-bold text-sm mt-0.5">
                          Deadline: {project.deadline ? new Date(project.deadline).toDateString() : "Not Set"}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                        status === "Overdue" ? "bg-red-100 text-red-600" :
                        "bg-slate-100 text-slate-600"
                      }`}>{status}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{progress.toFixed(0)}% paid</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Journey */}
        {selectedProject && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Clock className="text-blue-500" size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Project Journey — {selectedProject.name}
              </p>
            </div>

            {selectedProject.installments?.length === 0 ? (
              <p className="text-slate-400 font-bold text-sm">No journey yet</p>
            ) : (
              <div className="space-y-4">
                {selectedProject.installments?.map((inst, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${inst.paid ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{inst.phase} — ₹{inst.amount}</p>
                      <p className="text-slate-400 font-bold text-xs mt-0.5">
                        {inst.paid
                          ? `Paid on ${new Date(inst.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        {selectedProject && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <FileText className="text-blue-500" size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Documents — {selectedProject.name}
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl">
                <FileText className="text-slate-200 mx-auto mb-2" size={32} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No documents yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500" size={20} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-400">{new Date(doc.uploadedAt).toDateString()}</p>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-xs hover:underline">
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messaging */}
        {selectedProject && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <MessageSquare className="text-blue-500" size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Messages — {selectedProject.name}
              </p>
            </div>

            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No messages yet</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-5 py-3 rounded-2xl text-sm font-bold ${
                      msg.from === "client" ? "bg-slate-900 text-white" : "bg-blue-50 text-slate-900"
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-[10px] mt-1 text-slate-400">
                        {msg.from === "client" ? "You" : "Admin"} · {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <input
                placeholder="Type a message to admin..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Contact Admin */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Need Help?</p>
          <h3 className="text-2xl font-black text-white mb-2">Contact Your Admin</h3>
          <p className="text-slate-400 font-bold text-sm mb-6">Reach out for any queries regarding your project or payments.</p>
          <a
            href="mailto:admin@yourcompany.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg"
          >
            Send Email
          </a>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
