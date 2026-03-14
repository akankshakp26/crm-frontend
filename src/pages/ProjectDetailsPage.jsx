import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";
import { Send, FileText, Trash2, Plus } from "lucide-react";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [showDocForm, setShowDocForm] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchMessages();
    fetchDocuments();
  }, []);

  const fetchProject = async () => {
    const res = await axiosInstance.get(`/projects/${projectId}`);
    setProject(res.data);
  };

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/messages`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/documents`);
      setDocuments(res.data);
    } catch (err) { console.error(err); }
  };

  const markInstallmentPaid = async (index) => {
    try {
      await axiosInstance.put(`/projects/${projectId}/installment/${index}`);
      fetchProject();
    } catch (error) {
      console.error("Payment update failed:", error);
    }
  };

  const undoInstallment = async (index) => {
    if (!window.confirm("Are you sure you want to undo this payment?")) return;
    try {
      await axiosInstance.put("/projects/installment/undo", {
        projectId,
        installmentIndex: index,
      });
      fetchProject();
    } catch (error) {
      console.error("Undo payment failed:", error);
    }
  };

  const sendMessage = async () => {
    if (!msgText.trim()) return;
    try {
      await axiosInstance.post(`/projects/${projectId}/messages`, {
        from: "admin",
        text: msgText,
      });
      setMsgText("");
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  const addDocument = async () => {
    if (!docName.trim() || !docUrl.trim()) return;
    try {
      await axiosInstance.post(`/projects/${projectId}/documents`, {
        name: docName,
        url: docUrl,
      });
      setDocName("");
      setDocUrl("");
      setShowDocForm(false);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await axiosInstance.delete(`/projects/${projectId}/documents/${documentId}`);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.text(`Project: ${project.name}`, 10, 10);
    doc.text(`Client Payment Summary`, 10, 20);
    doc.text(`Total: ₹${project.totalPayment}`, 10, 40);
    doc.text(`Paid: ₹${paidTotal}`, 10, 50);
    doc.text(`Remaining: ₹${remaining}`, 10, 60);
    doc.save(`${project.name}-invoice.pdf`);
  };

  if (!project) return <div className="p-10">Loading...</div>;

  const paidTotal =
    project.installments?.filter((i) => i.paid).reduce((sum, i) => sum + i.amount, 0) || 0;
  const remaining = project.totalPayment - paidTotal;
  const progress = project.totalPayment > 0 ? (paidTotal / project.totalPayment) * 100 : 0;

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-blue-600 hover:underline">
          ← Back
        </button>
      </div>

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500 mt-2">Handled by {project.handledBy}</p>
        </div>
        <button onClick={downloadInvoice} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
          Download Invoice
        </button>
      </div>

      {/* PAYMENT SUMMARY */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-8">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400">Total Payment</p>
            <p className="text-2xl font-black text-slate-900">₹{project.totalPayment}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Paid</p>
            <p className="text-2xl font-black text-emerald-600">₹{paidTotal}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="text-2xl font-black text-red-600">₹{remaining}</p>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div className="bg-emerald-500 h-3 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progress.toFixed(0)}% Completed</p>
      </div>

      {/* INSTALLMENTS */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-8">
        <h2 className="text-xl font-black mb-6 text-slate-900">Installments</h2>

        <h3 className="text-lg font-bold mt-2 mb-3">Payment History</h3>
        {project.installments?.filter((i) => i.paid).map((inst, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-3 py-2 mb-2">
            <p className="font-bold">{inst.phase}</p>
            <p className="text-xs text-slate-500">
              ₹{inst.amount} paid on {inst.paidAt ? new Date(inst.paidAt).toDateString() : "—"}
            </p>
          </div>
        ))}

        {project.installments?.map((inst, index) => (
          <div key={index} className="flex justify-between items-center border-b py-4">
            <div>
              <p className="font-bold text-slate-800">{inst.phase}</p>
              <p className="text-xs text-slate-400">{inst.percentage}% of total</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">₹{inst.amount}</p>
              {inst.paid ? (
                <button
                  onClick={() => undoInstallment(index)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded font-bold"
                >
                  Undo Payment
                </button>
              ) : (
                <button
                  onClick={() => markInstallmentPaid(index)}
                  className="text-xs bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded font-bold"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 text-xs text-slate-400">
          Deadline: {project.deadline ? new Date(project.deadline).toDateString() : "Not Set"}
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Documents</h2>
          <button
            onClick={() => setShowDocForm(!showDocForm)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
          >
            <Plus size={16} /> Add Document
          </button>
        </div>

        {showDocForm && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 space-y-3">
            <input
              placeholder="Document name (e.g. Invoice Jan 2025)"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Document URL or link"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button onClick={addDocument} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700">
                Save
              </button>
              <button onClick={() => setShowDocForm(false)} className="px-5 py-2 bg-slate-200 rounded-xl font-bold text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl">
            <FileText className="text-slate-200 mx-auto mb-2" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No documents yet</p>
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
                <div className="flex items-center gap-4">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-xs hover:underline">
                    View
                  </a>
                  <button onClick={() => deleteDocument(doc._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGING */}
      <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100">
        <h2 className="text-xl font-black text-slate-900 mb-6">Messages</h2>

        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No messages yet</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-5 py-3 rounded-2xl text-sm font-bold ${
                  msg.from === "admin"
                    ? "bg-slate-900 text-white"
                    : "bg-blue-50 text-slate-900"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "admin" ? "text-slate-400" : "text-slate-400"}`}>
                    {msg.from === "admin" ? "You" : "Client"} · {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Type a message to client..."
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
    </div>
  );
};

export default ProjectDetailsPage;
