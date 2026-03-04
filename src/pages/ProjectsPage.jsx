import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ProjectsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
const [editingClient, setEditingClient] = useState(false);

const [clientForm, setClientForm] = useState({
  ceoName: "",
  associatedFrom: ""
});

const [form, setForm] = useState({
  name: "",
  handledBy: "",
  totalPayment: "",
  phase1Percent: "",
  phase2Percent: "",
  phase3Percent: "",
  deadline: ""
});

  // 🔹 Fetch client with projects
 const fetchClient = async () => {
  try {
    setLoading(true);
    const res = await axiosInstance.get(`/clients/${clientId}`);

    setClient(res.data);

    // 🔹 ADD THIS HERE
    setClientForm({
      ceoName: res.data.ceoName || "",
      associatedFrom: res.data.associatedFrom
        ? res.data.associatedFrom.substring(0, 10)
        : ""
    });

  } catch (err) {
    console.error("Error fetching client:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchClient();
  }, [clientId]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Create new project
 const handleSubmit = async () => {
  if (!form.name) return alert("Project name is required");

  try {
    if (editingProject) {
      await axiosInstance.put(
        `/projects/${editingProject._id}`,
        form
      );
      setEditingProject(null);
    } else {
      await axiosInstance.post("/projects", {
        ...form,
        clientId
      });
    }

    setForm({
      name: "",
      handledBy: "",
      totalPayment: "",
      phase1Percent: "",
      phase2Percent: "",
      phase3Percent: "",
      deadline: ""
    });

    setShowForm(false);
    fetchClient();
  } catch (err) {
    console.error("Save failed:", err);
  }
};

  // 🔹 Delete project
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      fetchClient();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!client) return <div className="p-8">Client not found</div>;
// 🔹 CLIENT REVENUE SUMMARY

const totalProjects = client.projects?.length || 0;

const totalRevenue =
  client.projects?.reduce((sum, p) => sum + (p.totalPayment || 0), 0) || 0;

const receivedAmount =
  client.projects?.reduce((sum, p) => {
    const paid =
      p.installments
        ?.filter((i) => i.paid)
        .reduce((s, i) => s + i.amount, 0) || 0;

    return sum + paid;
  }, 0) || 0;

const pendingAmount = totalRevenue - receivedAmount;
  
const handleDeleteClient = async () => {
  if (!window.confirm("Are you sure you want to delete this client?")) return;

  try {
    await axiosInstance.delete(`/clients/${clientId}`);
    navigate("/clients");
  } catch (err) {
    console.error("Failed to delete client:", err);
  }
};


const openEdit = (project) => {
  setEditingProject(project);
  setShowForm(true);

  setForm({
    name: project.name,
    handledBy: project.handledBy,
    totalPayment: project.totalPayment,
    phase1Percent: "",
    phase2Percent: "",
    phase3Percent: "",
    deadline: project.deadline
      ? project.deadline.substring(0, 10)
      : ""
  });
};


const totalValue =
  client.projects?.reduce((sum, project) => {
    return sum + (project.totalPayment || 0);
  }, 0) || 0;

const remainingRevenue = totalValue - totalRevenue;

const progress =
  totalValue > 0 ? (totalRevenue / totalValue) * 100 : 0;
return (
  <div className="p-10 bg-slate-50 min-h-screen">

    <div className="mb-6">
  <button
    onClick={() => navigate("/clients")}
    className="text-sm font-bold text-blue-600 hover:underline"
  >
    ← Back to Clients
  </button>
</div>

{/* 🔹 CLIENT HEADER */}
<div className="mb-12 flex justify-between items-start">

  {/* LEFT SIDE - CLIENT INFO */}
  <div>
<h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">
  {client.name}
</h1>
{/* 🔹 PROJECT REVENUE SUMMARY */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

  <div className="bg-white p-6 rounded-2xl shadow border">
    <p className="text-xs text-slate-400">Projects</p>
    <p className="text-2xl font-black text-slate-900">
      {totalProjects}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow border">
    <p className="text-xs text-slate-400">Total Revenue</p>
    <p className="text-2xl font-black text-slate-900">
      ₹{totalRevenue}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow border">
    <p className="text-xs text-slate-400">Received</p>
    <p className="text-2xl font-black text-emerald-600">
      ₹{receivedAmount}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow border">
    <p className="text-xs text-slate-400">Pending</p>
    <p className="text-2xl font-black text-red-600">
      ₹{pendingAmount}
    </p>
  </div>

</div>
    <div className="mt-4 space-y-1 text-sm text-slate-500">
      <p>Email: {client.email}</p>
      <p>CEO: {client.ceoName || "—"}</p>
      <p>
        Associated From:{" "}
        {client.associatedFrom
          ? new Date(client.associatedFrom).toDateString()
          : new Date(client.createdAt).toDateString()}
      </p>
    </div>
  </div>

  {/* RIGHT SIDE - BUTTONS */}
  <div className="flex gap-4">

    <button
      onClick={() => setEditingClient(!editingClient)}
      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition"
    >
      {editingClient ? "Cancel" : "Edit Client"}
    </button>

    <button
      onClick={handleDeleteClient}
      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition"
    >
      Delete Client
    </button>

  </div>

</div>
{editingClient && (
  <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 mb-10 space-y-4">

    <input
      name="ceoName"
      placeholder="CEO Name"
      value={clientForm.ceoName}
      onChange={(e) =>
        setClientForm({ ...clientForm, ceoName: e.target.value })
      }
      className="w-full p-3 border border-slate-200 rounded-xl"
    />

    <input
      name="associatedFrom"
      type="date"
      value={clientForm.associatedFrom}
      onChange={(e) =>
        setClientForm({
          ...clientForm,
          associatedFrom: e.target.value
        })
      }
      className="w-full p-3 border border-slate-200 rounded-xl"
    />

    <button
      onClick={async () => {
        await axiosInstance.put(`/clients/${clientId}`, clientForm);
        setEditingClient(false);
        fetchClient();
      }}
      className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
    >
      Save Changes
    </button>
  </div>
)}
    {/* 🔹 ADD PROJECT BUTTON */}
    <div className="mb-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-lg transition"
      >
        + Add Project
      </button>
    </div>

    {/* 🔹 PROJECT FORM */}
    {showForm && (
      <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 mb-12 space-y-4">

        <h3 className="text-lg font-black text-slate-800 mb-4">
          Create Project
        </h3>

        <input
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-slate-200 rounded-xl"
        />

        <input
          name="handledBy"
          placeholder="Handled By"
          value={form.handledBy}
          onChange={handleChange}
          className="w-full p-3 border border-slate-200 rounded-xl"
        />

<input
  name="totalPayment"
  type="number"
  value={form.totalPayment}
  onChange={handleChange}
  disabled={editingProject}
  className={`w-full p-3 rounded-xl ${
    editingProject
      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
      : "border border-slate-200"
  }`}
/>
<div className="grid grid-cols-3 gap-4">

  {/* ADVANCE */}
  <input
    name="phase1Percent"
    type="number"
    placeholder="Advance %"
    value={form.phase1Percent}
    onChange={handleChange}
    disabled={editingProject}
    className={`p-3 rounded-xl ${
      editingProject
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "border border-slate-200"
    }`}
  />

  {/* MIDDLE */}
  <input
    name="phase2Percent"
    type="number"
    placeholder="Middle %"
    value={form.phase2Percent}
    onChange={handleChange}
    disabled={editingProject}
    className={`p-3 rounded-xl ${
      editingProject
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "border border-slate-200"
    }`}
  />

  {/* DEPLOYMENT */}
  <input
    name="phase3Percent"
    type="number"
    placeholder="Deployment %"
    value={form.phase3Percent}
    onChange={handleChange}
    disabled={editingProject}
    className={`p-3 rounded-xl ${
      editingProject
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "border border-slate-200"
    }`}
  />

</div>

        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-3 border border-slate-200 rounded-xl"
        />

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
        >
          Save Project
        </button>
      </div>
    )}

   {/* 🔹 PROJECT LIST */}
<h2 className="text-2xl font-black text-slate-900 mb-6">
  Projects
</h2>

{/* 🔎 SEARCH */}
<div className="mb-6">
  <input
    type="text"
    placeholder="Search projects..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-80 p-3 border border-slate-200 rounded-xl"
  />
</div>

{client.projects?.length === 0 ? (
  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
    No projects added yet.
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {client.projects
      .filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((project) => {

        const paidTotal =
          project.installments
            ?.filter(i => i.paid)
            .reduce((sum, i) => sum + i.amount, 0) || 0;

        const allPaid = paidTotal >= project.totalPayment;

        const progress =
          project.totalPayment > 0
            ? (paidTotal / project.totalPayment) * 100
            : 0;

        const isOverdue =
          project.deadline &&
          new Date(project.deadline) < new Date() &&
          !allPaid;

        let status = "Active";
        if (allPaid) status = "Completed";
        if (isOverdue) status = "Overdue";

        return (
          <div
            key={project._id}
            className={`relative rounded-3xl p-1 transition-all ${
              isOverdue
                ? "bg-red-500/10"
                : allPaid
                ? "bg-emerald-500/10"
                : "bg-slate-900/5"
            }`}
          >

            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">

              {/* HEADER */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Handled by {project.handledBy}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-[10px] font-black rounded-full ${
                    status === "Completed"
                      ? "bg-emerald-500 text-white"
                      : status === "Overdue"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* OVERDUE WARNING */}
              {isOverdue && (
                <div className="mb-3 bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg font-bold">
                  ⚠ Payment overdue
                </div>
              )}

              {/* PAYMENT BLOCK */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-sm font-bold text-slate-800">
                  Total: ₹{project.totalPayment}
                </p>

                {project.installments?.map((inst, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs border-t pt-2"
                  >
                    <span>
                      {inst.phase} ({inst.percentage}%)
                    </span>

                    <span className="font-bold">
                      ₹{inst.amount}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        inst.paid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {inst.paid ? "Paid" : "Pending"}
                    </span>
                  </div>
                ))}

                <p className="text-xs text-slate-400 pt-2 border-t">
                  Deadline:{" "}
                  {project.deadline
                    ? new Date(project.deadline).toDateString()
                    : "Not Set"}
                </p>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {progress.toFixed(0)}% paid
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-6 mt-5 text-xs font-bold">

                <button
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>

                <button
                  onClick={() => openEdit(project)}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        );
      })}

  </div>
)}
  </div>
);}

export default ProjectsPage;